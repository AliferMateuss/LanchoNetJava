import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {Router, RouterLink} from "@angular/router";
import {ModalComponent} from "../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import {MatLabel} from "@angular/material/form-field";
import {MatStepLabel} from "@angular/material/stepper";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-contas-areceber',
  templateUrl: './contas-areceber.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyMaskModule,
    DatePipe,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    MatHeaderCellDef,
    MatCellDef,
    NgIf,
    MatColumnDef,
    MatPaginator,
    MatSort,
    MatSortHeader,
    RouterLink,
    MatLabel,
    MatStepLabel,
    NgForOf,
    NgOptionComponent,
    NgSelectComponent,
    ReactiveFormsModule
  ],
  styleUrls: ['./contas-areceber.component.css']
})
export class ContasAReceberComponent {
  public contaAReceber!: any;
  public contasAReceber: ContasAReceber[] = [];
  public TiposPagamentos!: TipoPagamento[] | null;
  public tipoPagamentoSelecionado: TipoPagamento | null | undefined;
  dataSource = new MatTableDataSource<ContasAReceber>(this.contasAReceber);
  displayedColumns: string[] = ['VendaId', 'Cliente', 'DataCompetencia', 'DataVencimento', 'DataConta', 'Parcela', 'Valor', 'Botoes'];
  clienteSelececionado: string = "";
  produtoSelecionado: string = "";
  valorAbate!: number;
  mostrarMensagem: boolean = false;
  parcelar: boolean = false;
  textoMensagem: string = "";
  tituloMensagem: string = "";
  baseUrl: string = 'http://localhost:8080/';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("modalBaixa") modalBaixa!: any;

  constructor(private http: HttpClient, private modalService: NgbModal, private cdr: ChangeDetectorRef,
              private dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
    this.buscaTodasContas();
  }

  buscaTodasContas() {
    this.http.get<ContasAReceber[]>(this.baseUrl + 'api/Contas/RecuperarContasReceber').subscribe(data => {
      this.contasAReceber = data;
      this.dataSource = new MatTableDataSource<ContasAReceber>(this.contasAReceber);
    }, error => console.error(error));
  }

  baixaParcial(conta: ContasAReceber) {
    this.carregarTiposPagamentos();
    this.contaAReceber = {} as ContasAReceber;
    this.contaAReceber = conta;
    this.valorAbate = 0;

    this.modalService.open(this.modalBaixa, {centered: true});
  }

  baixaTotal(conta: ContasAReceber) {
    this.carregarTiposPagamentos();
    this.contaAReceber = {} as ContasAReceber;
    this.contaAReceber = conta;
    this.valorAbate = this.contaAReceber.valor;
    this.modalService.open(this.modalBaixa, {centered: true});
  }

  baixa() {
    this.contaAReceber.tipoPagamentoId = this.tipoPagamentoSelecionado?.id;
    this.http.post<any[]>(this.baseUrl + 'api/Contas/BaixarContasAReceber', this.contaAReceber).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  excluir(id: number) {
    this.http.post<any[]>(this.baseUrl + 'api/Contas/DeletarContaReceber', id).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  abaterValor() {
    this.mostrarMensagem = false;
    this.tituloMensagem = "Atenção";

    if(this.valorAbate === 0){
      this.textoMensagem = "Valor de abate não informado!"
      this.mostrarMensagem = true;
      this.cdr.detectChanges();
      return;
    }

    if(!this.tipoPagamentoSelecionado){
      this.textoMensagem = "Tipo de pagamento não informado!"
      this.mostrarMensagem = true;
      this.cdr.detectChanges();
      return;
    }
    this.contaAReceber.valor -= Number(this.valorAbate);

  }

  selecionaFormaPagamento(tp: TipoPagamento){
    this.tipoPagamentoSelecionado = tp;
  }

formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    let parteDecimal = partes[1] || '00';


    if (parteDecimal.length === 1) {
        parteDecimal += '0';
    }

    return `R$ ${parteInteira},${parteDecimal}`;
}

  reload() {
    this.modalService.dismissAll();
    this.buscaTodasContas();
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
  }

  carregarTiposPagamentos() {
    this.http.get<TipoPagamento[]>(this.baseUrl + 'api/TipoPagamento/RecuperarTipoPagamentos').subscribe(data => {
      this.TiposPagamentos = data;
    }, error => this.openDialog("Erro: ", error.error.message, "Voltar", true));

  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: {titulo: titulo, mensagem: mensagem, botao: botao, erro: erro}
    });
    if (!erro) {
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/../comandas']);
      });
    }
  }
}

interface TipoPagamento {
  id: number;
  nome: string;
  juros: number;
  parcelas: number;
  parcelaEscolhida: number;
  avista: boolean;
  valorParcela: number;
  temResto: boolean;
  ultimaParcelas: number;
}

interface ContasAReceber {
  id: number;
  vendaId: number;
  dataCompetencia: Date;
  dataVencimento: Date;
  dataConta: Date;
  parcela: number;
  valor: number;
  status: string;
  clienteNome: string;
  clienteId: number;
  tipoPagamentoId: number;
}
