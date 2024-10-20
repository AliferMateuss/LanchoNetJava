import {ChangeDetectorRef, Component, Inject, ViewChild, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {HttpClient} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router, RouterLink} from "@angular/router";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {ModalComponent} from "../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-contas-pagar',
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
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatRowDef,
    NgIf,
    MatNoDataRow,
    MatPaginator,
    RouterLink,
    NgForOf,
    NgOptionComponent,
    NgSelectComponent
  ],
  templateUrl: './contas-pagar.component.html',
  styleUrl: './contas-pagar.component.css'
})
export class ContasPagarComponent implements OnInit {
  public contaAPagar!: any;
  public contasAPagar: ContasAPagar[] = [];
  public TiposPagamentos!: TipoPagamento[] | null;
  public tipoPagamentoSelecionado: TipoPagamento | null | undefined;
  dataSource = new MatTableDataSource<ContasAPagar>(this.contasAPagar);
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
    this.http.get<ContasAPagar[]>(this.baseUrl + 'api/Contas/RecuperarContasPagar').subscribe(data => {
      this.contasAPagar = data;
      this.dataSource.data = this.contasAPagar;
    }, error => console.error(error));
  }

  baixaParcial(conta: ContasAPagar) {
    this.carregarTiposPagamentos();
    this.contaAPagar = {} as ContasAPagar;
    this.contaAPagar = conta;
    this.valorAbate = 0;
    this.modalService.open(this.modalBaixa, {centered: true});
  }

  baixaTotal(conta: ContasAPagar) {
    this.carregarTiposPagamentos();
    this.contaAPagar = {} as ContasAPagar;
    this.contaAPagar = conta;
    this.valorAbate = this.contaAPagar.valor;
    this.modalService.open(this.modalBaixa, {centered: true});
  }

  baixa() {
    this.contaAPagar.tipoPagamentoId = this.tipoPagamentoSelecionado?.id;
    this.http.post<any[]>(this.baseUrl + 'api/Contas/BaixarContasAPagar', this.contaAPagar).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  excluir(id: number) {
    this.http.post<any[]>(this.baseUrl + 'api/Contas/DeletarContaAPagar', id).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  abaterValor() {
    this.mostrarMensagem = false;
    this.tituloMensagem = "Atenção";

    if (this.valorAbate === 0) {
      this.textoMensagem = "Valor de abate não informado!"
      this.mostrarMensagem = true;
      this.cdr.detectChanges();
      return;
    }

    if (!this.tipoPagamentoSelecionado) {
      this.textoMensagem = "Tipo de pagamento não informado!"
      this.mostrarMensagem = true;
      this.cdr.detectChanges();
      return;
    }
    this.contaAPagar.valor -= Number(this.valorAbate);

  }

  selecionaFormaPagamento(tp: TipoPagamento) {
    this.tipoPagamentoSelecionado = tp;
  }

  formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1] || '00';
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
    }, error => this.openDialog("Erro: ", error.mensage, "Voltar", true));

  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: {titulo: titulo, mensagem: mensagem, botao: botao, erro: erro}
    });
    if (!erro) {
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/../']);
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

interface ContasAPagar {
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
}
