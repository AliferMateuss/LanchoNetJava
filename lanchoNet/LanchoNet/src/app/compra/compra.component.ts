import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  NgZone,
  LOCALE_ID,
  Inject, inject
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCell, MatHeaderCell, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import {CommonModule, registerLocaleData} from '@angular/common';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import ptBr from '@angular/common/locales/pt';
import {Router, RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatStep, MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {ModalComponent} from "../modal/modal.component";

registerLocaleData(ptBr, 'pt-BR');

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatPaginatorModule,
    MatSortModule, NgSelectComponent, NgOptionComponent, CurrencyMaskModule, MatTableModule, MatHeaderCell, MatCell,
    MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule, MatCheckbox],
  templateUrl: './compra.component.html',
  styleUrl: './compra.component.css'
})
export class CompraComponent implements  AfterViewInit, OnInit, OnDestroy {
  public compra: Compra = new Compra();
  public itemCompra: ItensCompra = new ItensCompra();
  public itensCompra: ItensCompra[] = [];
  public Fornecedores?: any[];
  public Produtos?: any[];
  public TiposPagamentos!: TipoPagamento[] | null;
  public tipoPagamentoSelecionado: TipoPagamento | null | undefined;
  compraForm!: FormGroup;
  valido: boolean = false;
  baseUrl: string = 'http://localhost:8080/';
  mostrarModal: boolean = false;
  mostrarMensagem: boolean = false;
  parcelar: boolean = false;
  textoMensagem: string = "";
  tituloMensagem: string = "";
  dataSource = new MatTableDataSource<ItensCompra>(this.itensCompra);
  displayedColumns: string[] = ['Produto', 'Quantidade', 'Preço', 'SubTotal', 'Acoes'];
  fornecedorSelecionado: any = null;
  fornecedorNome!: string;
  produtoSelecionado!: Produto;
  private _formBuilder = inject(FormBuilder);
  primeiroStep!: FormGroup;
  segundoStep!: FormGroup;
  private intervalo$!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('modalCompra') modalFinalizarCompra: any;
  @ViewChild(MatStep) stepper!: MatStep;
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private router: Router
  ) {
    this.compraForm = new FormGroup({
      fornecedorId: new FormControl('', [Validators.required]),
      fornecedorNome: new FormControl(''),
      produtoId: new FormControl('', [Validators.required]),
      quantidade: new FormControl('', [Validators.required]),
      preco: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.carregarFornecedores();
    this.carregarProdutos();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    if (this.intervalo$) {
      this.intervalo$.unsubscribe();
    }
  }

  carregarFornecedores() {
    this.http.get<any[]>(this.baseUrl + 'api/Pessoas/RecuperarFornecedores').subscribe(
      (data) => {
        this.Fornecedores = data;
      },
      (error) => this.openDialog('Erro: ', error.error.message, 'Voltar', true)
    );
  }

  carregarProdutos() {
    this.http.get<any[]>(this.baseUrl + 'api/Produto/RecuperarProdutos').subscribe(
      (data) => {
        this.Produtos = data;
      },
      (error) => this.openDialog('Erro: ', error.error.message, 'Voltar', true)
    );
  }

  selecionarFornecedor() {
    if (this.Fornecedores && this.compraForm.get('fornecedorId')?.value) {
      const fornecedorSelecionadoId = this.compraForm.get('fornecedorId')?.value;
      this.fornecedorSelecionado = this.Fornecedores.find((fornecedor) => fornecedor.id === fornecedorSelecionadoId);
      if (this.fornecedorSelecionado != null) {
        this.fornecedorNome = this.fornecedorSelecionado.nome;
      }
    } else {
      this.fornecedorSelecionado = null;
    }
  }

  selecionarProduto() {
    if (this.Produtos && this.compraForm.get('produtoId')?.value) {
      const prod = this.Produtos.find((produto) => produto.id === this.compraForm.get('produtoId')?.value);
      if (!prod) {
        this.openDialog('Erro ', 'Ocorreu um erro ao selecionar o produto', 'Ok', true);
        return;
      }
      this.mapeaDataParaProduto(prod);
      this.compraForm.get('preco')?.setValue(this.produtoSelecionado.precoCompra);
      this.itemCompra.produto = this.produtoSelecionado;
    }
  }

  mapeaDataParaProduto(data: any) {
    this.produtoSelecionado = {} as Produto;
    this.produtoSelecionado.id = data.id;
    this.produtoSelecionado.nome = data.nome;
    this.produtoSelecionado.precoCompra = data.precoCompra;
  }

  adicionarItem() {
    this.mostrarMensagem = false;
    if (this.compraForm.valid) {
      this.itemCompra.quantidade = this.getQuantidade();
      this.itemCompra.precoUnitario = this.getPreco();
      this.itemCompra.produtoId = this.getProdutoId();
      this.itemCompra.subTotal = this.itemCompra.quantidade * this.itemCompra.precoUnitario;

      const produtoExistente = this.itensCompra.find(
        (item) => item.produtoId === this.itemCompra.produtoId && item.precoUnitario === this.itemCompra.precoUnitario
      );

      if (produtoExistente) {
        produtoExistente.quantidade += this.itemCompra.quantidade;
        produtoExistente.subTotal += this.itemCompra.subTotal;
      } else {
        this.itensCompra.push({ ...this.itemCompra });
      }

      this.dataSource.data = this.itensCompra;
      this.itemCompra = new ItensCompra();
    } else {
      this.tituloMensagem = 'Preencha corretamente os campos!';
      this.mostrarMensagem = true;
    }
  }

  removerItem(itemCompra: ItensCompra) {
    const itemIndex = this.itensCompra.findIndex(
      (item) => item.produtoId === itemCompra.produtoId && item.precoUnitario === itemCompra.precoUnitario
    );

    if (itemIndex > -1) {
      this.itensCompra.splice(itemIndex, 1);
      this.dataSource.data = this.itensCompra;
    } else {
      this.tituloMensagem = 'Item não encontrado';
      this.textoMensagem = 'O item selecionado não está na lista de compras.';
      this.mostrarMensagem = true;
    }
  }

  abrirModalFinalizarCompra() {
    this.formToCompra();
    this.primeiroStep = this._formBuilder.group({
      tipoPagamento: new FormControl(this.tipoPagamentoSelecionado, [Validators.required]),
      parcelas: new FormControl(this.compra.parcelas),
    });
    this.segundoStep = this._formBuilder.group({});
    this.carregarTiposPagamentos();
    this.modalService.open(this.modalFinalizarCompra, {centered: true});
  }

  fecharModalFinalizarCompra() {
    this.TiposPagamentos = null;
    this.tipoPagamentoSelecionado = null;
    this.stepper.reset();
    this.modalService.dismissAll(this.modalFinalizarCompra);
  }

  finalizarCompra() {
    this.compra.itensCompra = this.itensCompra;
    this.compra.valorTotal = this.calcularValorCompraJuros();
    this.compra.usuarioId = 1;
    this.compra.dataCompra = new Date();
    if (this.tipoPagamentoSelecionado){
      this.compra.parcelas = this.tipoPagamentoSelecionado.parcelaEscolhida;
      this.compra.tipoPagamentoId = this.tipoPagamentoSelecionado.id;
    }


    this.http.post<Compra>(this.baseUrl + 'api/Compra/Salvar', this.compra).subscribe(
      data => {
        this.itemCompra = new ItensCompra();
        this.itensCompra = [];
        this.dataSource = new MatTableDataSource<ItensCompra>(this.itensCompra);
        this.compra = {} as Compra;
        this.modalService.dismissAll();
        this.openDialog("Compra: ", "Compra realizada com sucesso", "Ok", false);

      },
      error => this.openDialog("Erro: ", error.error.message, "Voltar", true));
  }

  carregarTiposPagamentos() {
    this.http.get<TipoPagamento[]>(this.baseUrl + 'api/TipoPagamento/RecuperarTipoPagamentos').subscribe(data => {
      this.TiposPagamentos = data;
    }, error => this.openDialog("Erro: ", error.error.message, "Voltar", true));

  }

  changeFormaPagamento() {
    this.tipoPagamentoSelecionado = this.primeiroStep.get('tipoPagamento')?.value;
    if (!this.tipoPagamentoSelecionado) {
      this.openDialog("Erro: ", "Erro ao selecionar tipo pagamento", "Ok", true);
      console.log(this.primeiroStep.get('tipoPagamento')?.value);
      return;
    }

    this.parcelar = this.tipoPagamentoSelecionado?.avista !== true;
  }

  changeParcelas() {
    if (this.tipoPagamentoSelecionado) {
      this.tipoPagamentoSelecionado.parcelaEscolhida = this.primeiroStep.get('parcelas')?.value;
    }
  }

  avancaStep() {
    if (this.tipoPagamentoSelecionado)
      this.calcularParcelas(this.calcularValorCompraJuros(), this.tipoPagamentoSelecionado.parcelaEscolhida);

    this.cdr.detectChanges();
  }
  calcularValorCompra(): number {
    return this.itensCompra.reduce((total, item) => total + item.subTotal, 0);
  }

  calcularValorCompraJuros(): number {
    let total = this.itensCompra.reduce((total, item) => total + item.subTotal, 0);
    if (this.tipoPagamentoSelecionado?.juros) {
      total = total + ((total * this.tipoPagamentoSelecionado?.juros) / 100);
    }
    return total;
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });

    if (!erro) {
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/../comandas']);
      });
    }
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

  formToCompra(): void {
    this.compra.pessoaId = this.getFornecedorId();
    this.compra.nomeFornecedor = this.fornecedorSelecionado == null ? this.getFornecedorNome() : this.fornecedorSelecionado.nome;
  }

  getQuantidade(): number {
    return this.compraForm.get('quantidade')?.value;
  }

  getPreco(): number {
    return this.compraForm.get('preco')?.value;
  }

  getProdutoId(): number {
    return this.compraForm.get('produtoId')?.value;
  }

  getFornecedorNome(): string {
    return this.compraForm.get('fornecedorNome')?.value;
  }

  getFornecedorId(): number {
    return this.compraForm.get('fornecedorId')?.value;
  }
}

export class Compra {
  dataCompra!: Date;
  valorTotal!: number;
  pessoaId!: number;
  parcelas!: number;
  usuarioId!: number;
  tipoPagamentoId!: number;
  nomeFornecedor!: string;
  compraBalcao!: boolean;
  compraFiado!: boolean
  itensCompra!: ItensCompra[];
}

export class Produto {
  id!: number;
  nome!: string;
  precoCompra!: number;
}

export class ItensCompra {
  produtoId!: number;
  quantidade!: number;
  precoUnitario!: number;
  produto!: Produto;
  subTotal!: number;
}

export class TipoPagamento {
  id!: number;
  nome!: string;
  juros!: number;
  parcelas!: number;
  parcelaEscolhida!: number;
  avista!: boolean;
  valorParcela!: number;
  temResto!: boolean;
  ultimaParcelas!: number;
}
