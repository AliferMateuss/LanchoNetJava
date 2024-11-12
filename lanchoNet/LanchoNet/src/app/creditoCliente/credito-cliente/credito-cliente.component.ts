import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { ApiServices } from '../../services/api.services';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {FormsModule} from "@angular/forms";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {Select2Module} from "ng-select2-component";
import {ModalComponent} from "../../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MatStepLabel} from "@angular/material/stepper";
import {MatLabel} from "@angular/material/form-field";
@Component({
  selector: 'app-credito-cliente',
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
    MatLabel
  ],
  templateUrl: './credito-cliente.component.html',
  styleUrl: './credito-cliente.component.css'
})
export class CreditoClienteComponent {
  creditoCliente!: CreditoCliente;
  movimentosCredito: any[] = [];
  pagamentosCredito: any[] = [];
  pagamentoCredito!: PagamentoCredito;
  TiposPagamentos!: TipoPagamento[] | null;
  tipoPagamentoSelecionado: TipoPagamento | null | undefined;
  dataSourceMovimentos = new MatTableDataSource(this.movimentosCredito);
  dataSourcePagamentos = new MatTableDataSource(this.pagamentosCredito);
  @ViewChild("modalBaixa") modalBaixa!: any;
  displayedColumnsMovimento: string[] = ['dataMovimento', 'valor', 'tipoPagamento', 'vendaId'];
  displayedColumnsPagamento: string[] = ['dataMovimento', 'valor', 'tipoPagamento'];  valorAbate!: number;
  mostrarMensagem: boolean = false;
  parcelar: boolean = false;
  textoMensagem: string = "";
  tituloMensagem: string = "";


  constructor(private http: HttpClient, private service: ApiServices, private router: Router,
              private dialog: MatDialog, private modalService: NgbModal, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.creditoCliente = this.service.getCredito();
    if (this.creditoCliente.idCredito) {
      this.carregarMovimentosCredito(this.creditoCliente.idCredito);
      this.carregarPagamentosCredito(this.creditoCliente.idCredito);
    }
  }

  carregarMovimentosCredito(id: number) {
    this.http.post<any[]>(`http://localhost:8080/api/CreditoCliente/RetornaMovimentosPorId`, id).subscribe(
      (data) => {
        this.movimentosCredito = data;
        this.dataSourceMovimentos.data = this.movimentosCredito;
      },
      (error) => {
        console.error('Erro ao carregar movimentos de crédito', error);
      }
    );
  }

  carregarPagamentosCredito(id: number) {
    this.http.post<any[]>(`http://localhost:8080/api/CreditoCliente/RetornaPagamentosPorId`, id).subscribe(
      (data) => {
        this.pagamentosCredito = data;
        this.dataSourcePagamentos.data = this.pagamentosCredito;
      },
      (error) => {
        console.error('Erro ao carregar pagamentos de crédito', error);
      }
    );
  }

  fechar() {
    this.router.navigate(['/listaCreditoCliente']);
  }

  abrirModal(){
    this.carregarTiposPagamentos();
    this.modalService.open(this.modalBaixa, {centered: true});
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
    if(this.creditoCliente)
       this.creditoCliente.valorTotal -= Number(this.valorAbate);

    if(this.tipoPagamentoSelecionado.parcelaEscolhida && this.tipoPagamentoSelecionado.parcelaEscolhida > 0){
      this.parcelar = true;
      this.calcularParcelas(this.valorAbate, this.tipoPagamentoSelecionado.parcelaEscolhida);
    }
  }

  selecionaFormaPagamento(tp: TipoPagamento) {
    this.tipoPagamentoSelecionado = tp;
  }

  calcularValorCreditoJuros(): number {
    let total = this.creditoCliente.valorTotal;
    if (this.tipoPagamentoSelecionado?.juros) {
      total = total + ((total * this.tipoPagamentoSelecionado?.juros) / 100);
    }
    return total;
  }

  calcularParcelas(valorTotal: number, parcelas: number) {
    valorTotal = parseFloat(valorTotal.toFixed(2));
    const valorParcela = Math.trunc((valorTotal / parcelas) * Math.pow(10, 2)) / Math.pow(10, 2);
    const total = parseFloat((valorParcela * parcelas).toFixed(2));
    const resto = parseFloat((valorTotal - total).toFixed(2));
    const temResto = resto > 0
    const ultimaParcela = parseFloat((valorParcela + resto).toFixed(2));

    if(this.tipoPagamentoSelecionado){
      this.tipoPagamentoSelecionado.valorParcela = valorParcela;
      this.tipoPagamentoSelecionado.ultimaParcelas = ultimaParcela;
      this.tipoPagamentoSelecionado.temResto = temResto;
    }
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

  salvarPagamento(){
    this.pagamentoCredito = new PagamentoCredito();
    this.pagamentoCredito.dataMovimento = new Date();
    this.pagamentoCredito.valor = this.valorAbate;
    this.pagamentoCredito.tipoPagamentoId = this.tipoPagamentoSelecionado?.id;
    this.pagamentoCredito.creditoId = this.creditoCliente.idCredito;
    this.http.post('http://localhost:8080/api/CreditoCliente/GerarPagamentoCredito', this.pagamentoCredito).subscribe(data => {
        this.modalService.dismissAll();
        if (this.creditoCliente.idCredito) {
          this.carregarMovimentosCredito(this.creditoCliente.idCredito);
          this.carregarPagamentosCredito(this.creditoCliente.idCredito);
        }
    }, error => this.openDialog("Erro: ", error.error.message, "Voltar", true));
  }

  carregarTiposPagamentos() {
    this.http.get<TipoPagamento[]>('http://localhost:8080/api/TipoPagamento/RecuperarTipoPagamentos').subscribe(data => {
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

class CreditoCliente {
  idCliente!: number;
  nome!: string;
  idCredito!: number;
  valorTotal!: number;
}

class PagamentoCredito {
  id!: number;
  dataMovimento!: Date;
  valor!: number;
  tipoPagamentoId!: number | undefined;
  creditoId!: number;
}

