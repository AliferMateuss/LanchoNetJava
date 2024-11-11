import { HttpClient } from '@angular/common/http';
import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from "ngx-mask";
import { NgSelectModule } from "@ng-select/ng-select";
import {ModalComponent} from "../../modal/modal.component";
import {ApiServices} from "../../services/api.services";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatTooltip} from "@angular/material/tooltip";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-cadastro-caixa',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective, NgSelectModule, RouterLink, MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatSort, MatTable, MatTooltip, MatHeaderCellDef, MatNoDataRow],
  templateUrl: './cadastro-caixa.component.html',
  styleUrl: './cadastro-caixa.component.css'
})

export class CadastroCaixaComponent implements OnInit{
  baseUrl: string = 'http://localhost:8080/';
  caixa!: CaixaDto;
  movimentosCaixa: MovimentoCaixaDto[] = [];
  dataSourceMovimentos = new MatTableDataSource(this.movimentosCaixa);
  displayedColumns: string[] = ['dataMovimento', 'tipoPagamento', 'valor', 'tipoMovimento'];
  valorFiado = 0;
  valorEntrada = 0;
  valorSaida = 0;
  ehAlteracao: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private router: Router,
              private service: ApiServices) { }

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get('id');
    if(!id){
      this.openDialog("Atenção!", "Erro ao recuperar caixa.", "Voltar", true)
    } else {
      this.carregarMovimentosCaixa(Number.parseFloat(id));
    }
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'modalClass',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!erro) this.router.navigate(['/../caixa']);
    });
  }

  carregarMovimentosCaixa(id :number) {
    this.http.post<CaixaDto>('http://localhost:8080/api/Caixa/RetornaMovimentosPorId', id).subscribe(data => {
      this.caixa = data;
      this.movimentosCaixa = this.caixa.movimentos;
      this.calcularTotalCaixa();
      this.dataSourceMovimentos.data = this.caixa.movimentos;
      this.dataSourceMovimentos.paginator = this.paginator;
    }, error => {
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
        default:
          this.valorSaida += mov.valor;
          break;
      }
    })
  }


  getIconClass(tipoMovimento: string): string {
    switch (tipoMovimento) {
      case 'ENTRADA':
        return 'bi bi-arrow-up';
      case 'FIADO':
        return 'bi bi-arrow-right';
      default:
        return 'bi bi-arrow-down';
    }
  }

  getColor(tipoMovimento: string): string {
    switch (tipoMovimento) {
      case 'ENTRADA':
        return 'btn btn-success';
      case 'FIADO':
        return 'btn btn-warning';
      default:
        return 'btn btn-danger';
    }
  }

  getMovimentoDescricao(tipoMovimento: string): string {
    switch (tipoMovimento) {
      case 'ENTRADA':
        return 'Entrada';
      case 'FIADO':
        return 'Fiado';
      default:
        return 'Saída';
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

