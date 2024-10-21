import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatSort} from "@angular/material/sort";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {FormsModule} from "@angular/forms";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {Select2Module} from "ng-select2-component";
import {MatStepLabel} from "@angular/material/stepper";
import {MatLabel} from "@angular/material/form-field";
import {MatTooltip} from "@angular/material/tooltip";
import {ModalComponent} from "../../modal/modal.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalAbrirCaixaComponent} from "../modais/modal-abrir-caixa/modal-abrir-caixa.component";

@Component({
  selector: 'app-movimentos-caixa',
  standalone: true,
  imports: [
    NgIf,
    CurrencyPipe,
    MatTable,
    MatTab,
    MatTabGroup,
    MatHeaderCell,
    MatCell,
    DatePipe,
    MatPaginator,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatNoDataRow,
    MatSort,
    CurrencyMaskModule,
    FormsModule,
    NgForOf,
    NgOptionComponent,
    NgSelectComponent,
    Select2Module,
    MatStepLabel,
    MatLabel,
    MatTooltip,
    NgClass,
    NgStyle
  ],
  templateUrl: './movimentos-caixa.component.html',
  styleUrl: './movimentos-caixa.component.css'
})
export class MovimentosCaixaComponent implements OnInit, OnDestroy{
  caixa!: CaixaDto;
  movimentosCaixa: MovimentoCaixaDto[] = [];
  dataSourceMovimentos = new MatTableDataSource(this.movimentosCaixa);
  displayedColumns: string[] = ['dataMovimento', 'tipoPagamento', 'valor', 'tipoMovimento'];
  valorFiado = 0;
  valorEntrada = 0;
  valorSaida = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.carregarMovimentosCaixa();
  }

  ngOnDestroy() {
    this.dialog.closeAll(); // Fecha todos os diálogos ao destruir o componente
  }

  carregarMovimentosCaixa() {
    this.http.get<CaixaDto>('http://localhost:8080/api/Caixa/RetornaCaixaAberto').subscribe(data => {
      this.caixa = data;
      this.movimentosCaixa = this.caixa.movimentos;
      this.dataSourceMovimentos.data = this.caixa.movimentos;
      this.dataSourceMovimentos.paginator = this.paginator;
      this.calcularTotalCaixa();
    }, error => {
      const dialogRef = this.dialog.open(ModalComponent, {
        panelClass: 'modalClass',
        hasBackdrop: true,
        data: {titulo: "Atenção", mensagem: "Não foi encontrado nenhum caixa aberto! Deseja abrir um?", botao: "Sim", erro: false}
      });
      dialogRef.afterClosed().subscribe(result => {
        const otherDialog = this.dialog.open(ModalAbrirCaixaComponent, {
          panelClass: 'modalClass',
          hasBackdrop: true
        });
        otherDialog.afterClosed().subscribe(()=>{
          this.carregarMovimentosCaixa();
        })
      });
    });
  }

  fecharCaixa(id: number) {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'modalClass',
      hasBackdrop: true,
      data: {titulo: "Atenção", mensagem: "Deseja fechar o caixa", botao: "Sim", erro: false}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.http.post('http://localhost:8080/api/Caixa/FechaCaixa', id).subscribe(data => {
      }, error => console.error(error));
    });
  }

  calcularTotalCaixa() {

    this.caixa.movimentos.forEach(mov => {
      switch (mov.tipoMovimento) {
        case 'ENTRADA':
          this.valorEntrada += mov.valor;
          break;
        case 'FIADO':
          this.valorFiado += mov.valor;
          break;
        case 'SAIDA':
          this.valorSaida += mov.valor;
          break;
        default:
          break;
      }
    })
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'modalClass',
      hasBackdrop: true,
      data: {titulo: titulo, mensagem: mensagem, botao: botao, erro: erro}
    });
  }


  getIconClass(tipoMovimento: string): string {
    switch (tipoMovimento) {
      case 'ENTRADA':
        return 'bi bi-arrow-up';
      case 'FIADO':
        return 'bi bi-arrow-right';
      case 'SAIDA':
        return 'bi bi-arrow-down';
      default:
        return '';
    }
  }

  getColor(tipoMovimento: string): string {
    switch (tipoMovimento) {
      case 'ENTRADA':
        return 'btn btn-success';
      case 'FIADO':
        return 'btn btn-warning';
      case 'SAIDA':
        return 'btn btn-danger';
      default:
        return '';
    }
  }

  getMovimentoDescricao(tipoMovimento: string): string {
    switch (tipoMovimento) {
      case 'ENTRADA':
        return 'Entrada';
      case 'FIADO':
        return 'Fiado';
      case 'SAIDA':
        return 'Saída';
      default:
        return '';
    }
  }
}

interface MovimentoCaixaDto {
  id: number;
  tipoMovimento: string;
  tipoPagamentoNome: string;
  valor: number;
}


interface CaixaDto {
  id: number;
  dataAbertura: Date;
  dataFechamento: Date;
  valorTotal: number;
  valorInicial: number;
  movimentos: MovimentoCaixaDto[];
}
