import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit,
  inject,
  ViewChild,
  NgZone,
  LOCALE_ID,
  ChangeDetectorRef
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCell, MatHeaderCell, MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule, registerLocaleData} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";
import {ModalComponent} from "../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {CurrencyMaskModule} from "ng2-currency-mask";
import ptBr from '@angular/common/locales/pt';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStep, MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {interval, Subscription} from 'rxjs';
import {MatCheckbox} from "@angular/material/checkbox";

registerLocaleData(ptBr, 'pt-BR');

@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatPaginatorModule,
    MatSortModule, NgSelectComponent, NgOptionComponent, CurrencyMaskModule, MatTableModule, MatHeaderCell, MatCell,
    MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule, MatCheckbox],
  standalone: true,
  styleUrls: ['./venda.component.css'],
  providers: [{provide: LOCALE_ID, useValue: 'pt-BR'}]
})
export class VendaComponent implements AfterViewInit, OnInit, OnDestroy {
  public venda: Venda = {vendaBalcao: false, vendaFiado: false} as Venda;
  public itemVenda: ItensVenda = new ItensVenda();
  public itensVenda: ItensVenda[] = [];
  public Clientes?: any[];
  public Produtos?: any[];
  public TiposPagamentos!: TipoPagamento[] | null;
  public tipoPagamentoSelecionado: TipoPagamento | null | undefined;
  vendaForm!: FormGroup;
  valido: boolean = false;
  baseUrl: string = 'http://localhost:8080/';
  mostrarModal: boolean = false;
  mostrarMensagem: boolean = false;
  parcelar: boolean = false;
  textoMensagem: string = "";
  tituloMensagem: string = "";
  dataSource = new MatTableDataSource<ItensVenda>(this.itensVenda);
  displayedColumns: string[] = ['Produto', 'Quantidade', 'Preço', 'SubTotal', 'Acoes'];
  clienteSelececionado: any = null;
  clienteNome!: string;
  produtoSelecionado!: Produto;
  private _formBuilder = inject(FormBuilder);
  primeiroStep!: FormGroup;
  segundoStep!: FormGroup;
  private intervalo$!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatStep) stepper!: MatStep;
  @ViewChild('modalContent') modalContent: any;
  @ViewChild('modalVenda') modalFinalizarVenda: any;

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal,
              private dialog: MatDialog, private router: Router, private cdr: ChangeDetectorRef, private zone: NgZone) {
    this.vendaForm = new FormGroup({
      pessoaId: new FormControl('', [Validators.required]),
      vendaBalcao: new FormControl(this.venda.vendaBalcao, [Validators.required]),
      // vendaFiado: new FormControl(this.venda.vendaFiado, [Validators.required]),
      clienteNome: new FormControl(''),
      produtoId: new FormControl('', [Validators.required]),
      quantidade: new FormControl('', [Validators.required]),
      preco: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarProdutos();
  }

  ngAfterViewInit(): void {
    // this.atualizarHora();
  }

  ngOnDestroy(): void {
    if (this.intervalo$) {
      this.intervalo$.unsubscribe();
    }
  }

  atualizarHora(): void {
    this.intervalo$ = interval(1000).subscribe(() => {
      this.venda.dataVenda = new Date();
    });
  }

  vendaBalcaoChange() {
    if (this.getVendaBalcao()) {
      this.vendaForm.get('pessoaId')?.clearValidators();
      this.vendaForm.get('pessoaId')?.reset();
      this.vendaForm.get('clienteNome')?.clearValidators();
      this.vendaForm.get('clienteNome')?.reset();
      this.vendaForm.get('clienteNome')?.setValidators([Validators.required]);
      this.vendaForm.get('clienteNome')?.updateValueAndValidity();
    } else {
      this.vendaForm.get('clienteNome')?.clearValidators();
      this.vendaForm.get('clienteNome')?.reset();
      this.vendaForm.get('pessoaId')?.clearValidators();
      this.vendaForm.get('pessoaId')?.reset();
      this.vendaForm.get('pessoaId')?.setValidators([Validators.required]);
      this.vendaForm.get('pessoaId')?.updateValueAndValidity();
    }
    this.cdr.detectChanges();
  }

  selecionaVendaFiado(): void {
    this.venda.vendaFiado = this.primeiroStep.get('vendaFiado')?.value;
    if (this.primeiroStep.get('vendaFiado')?.value) {
      this.primeiroStep.get('tipoPagamento')?.clearValidators();
      this.primeiroStep.get('tipoPagamento')?.reset();
      this.primeiroStep.get('tipoPagamento')?.updateValueAndValidity();
      this.tipoPagamentoSelecionado = null;
    } else {
      this.primeiroStep.get('tipoPagamento')?.reset();
      this.primeiroStep.get('tipoPagamento')?.setValidators([Validators.required]);
      this.primeiroStep.get('tipoPagamento')?.updateValueAndValidity();
    }
    this.cdr.detectChanges();
  }

  carregarProdutos() {
    this.http.get<any[]>(this.baseUrl + 'api/Produto/RecuperarProdutos').subscribe(data => {
      this.Produtos = data;
    }, error => this.openDialog("Erro: ", error, "Voltar", true));

  }

  carregarClientes() {
    this.http.get<any[]>(this.baseUrl + 'api/Pessoas/RecuperarPessoas').subscribe(data => {
      this.Clientes = data;
    }, error => this.openDialog("Erro: ", error, "Voltar", true));
  }

  selecionarCliente() {
    if (this.Clientes && this.vendaForm.get('pessoaId')?.value) {

      const clienteSelecionadoid = this.vendaForm.get('pessoaId')?.value;
      this.clienteSelececionado = this.Clientes.find(cliente => cliente.id === clienteSelecionadoid);

      if (this.clienteSelececionado != null) {
        this.clienteNome = this.clienteSelececionado.nome;
      }
    } else {
      this.clienteSelececionado = null;
    }
  }

  selecionarProduto() {
    if (this.Produtos && this.vendaForm.get('produtoId')?.value) {
      const prod = this.Produtos.find(produto => produto.id === this.vendaForm.get('produtoId')?.value);
      if (!prod) {
        this.openDialog("Erro ", "Ocorreu um erro ao selecionar o produto", "Ok", true);
        return;
      }
      this.mapeaDataParaProduto(prod);
      this.vendaForm.get('preco')?.setValue(this.produtoSelecionado.preco)
      this.itemVenda.produto = this.produtoSelecionado;
    }
  }

  mapeaDataParaProduto(data: any) {
    this.produtoSelecionado = {} as Produto;
    this.produtoSelecionado.id = data.id;
    this.produtoSelecionado.nome = data.nome;
    this.produtoSelecionado.preco = data.preco;
    this.produtoSelecionado.quantidade = data.quantidade;
  }

  temEstoqueSuficiente(): boolean {
    return this.produtoSelecionado.quantidade >= this.getQuantidade();
  }

  adicionarItem() {
    this.mostrarMensagem = false;
    if (this.vendaForm.valid) {
      if (this.temEstoqueSuficiente()) {
        this.itemVenda.quantidade = this.getQuantidade();
        this.itemVenda.precoUnitario = this.getPreco();
        this.itemVenda.produtoId = this.getProdutoId()
        this.produtoSelecionado.quantidade -= this.itemVenda.quantidade;
        this.itemVenda.subTotal = this.itemVenda.quantidade * this.itemVenda.precoUnitario;

        const produtoExistente = this.itensVenda.find(
          (item) =>
            item.produtoId === this.itemVenda.produtoId &&
            item.precoUnitario === this.itemVenda.precoUnitario
        );

        if (produtoExistente) {
          produtoExistente.quantidade += this.itemVenda.quantidade;
          produtoExistente.subTotal += this.itemVenda.subTotal;
        } else {
          this.itensVenda.push({...this.itemVenda});
        }

        this.dataSource.data = this.itensVenda;
        this.itemVenda = new ItensVenda();
        console.log(this.itensVenda);
      } else {
        this.tituloMensagem = "Estoque insuficiente para o item: " + this.produtoSelecionado.nome;
        this.textoMensagem = "Quantidade em estoque: " + this.produtoSelecionado.quantidade;
        this.mostrarMensagem = true;
      }
    } else {
      this.tituloMensagem = "Prencha corretamente os campos!";
      this.mostrarMensagem = true;
    }
  }

  removerItem(itemVenda: ItensVenda) {
    const itemIndex = this.itensVenda.findIndex(
      (item) => item.produtoId === itemVenda.produtoId && item.precoUnitario === itemVenda.precoUnitario
    );

    if (itemIndex > -1) {

      const indexProd = this.Produtos?.findIndex(
        (prod) => prod.id === itemVenda.produtoId && prod.preco === itemVenda.precoUnitario
      );

      if (indexProd && this.Produtos) {
        this.Produtos[indexProd].quantidade = itemVenda.quantidade;

        if (this.Produtos[indexProd].id === this.produtoSelecionado.id) {
          this.produtoSelecionado.quantidade = this.Produtos[indexProd].quantidade;
        }

      }
      this.itensVenda.splice(itemIndex, 1);
      this.dataSource.data = this.itensVenda;

    } else {
      this.tituloMensagem = "Item não encontrado";
      this.textoMensagem = "O item selecionado não está na lista de vendas.";
      this.mostrarMensagem = true;
    }
  }

  formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1] || '00';
    return `R$ ${parteInteira},${parteDecimal}`;
  }

  calcularValorTotal() {
    return this.formatarValorParaExibicao(this.itensVenda.reduce((total, item) => total + item.subTotal, 0));
  }

  carregarTiposPagamentos() {
    this.http.get<TipoPagamento[]>(this.baseUrl + 'api/TipoPagamento/RecuperarTipoPagamentos').subscribe(data => {
      this.TiposPagamentos = data;
    }, error => this.openDialog("Erro: ", error.mensage, "Voltar", true));

  }

  changeFormaPagamento() {
    this.tipoPagamentoSelecionado = this.primeiroStep.get('tipoPagamento')?.value;
    if (!this.tipoPagamentoSelecionado) {
      this.openDialog("Erro: ", "Erro ao selecionar tipo pagamento", "Ok", true);
      return;
    }

    this.parcelar = !this.tipoPagamentoSelecionado?.avista;
  }

  changeParcelas() {
    if (this.tipoPagamentoSelecionado) {
      this.tipoPagamentoSelecionado.parcelaEscolhida = this.primeiroStep.get('parcelas')?.value;
    }
  }

  avancaStep() {
    if (this.tipoPagamentoSelecionado)
      this.calcularParcelas(this.calcularValorVendaJuros(), this.tipoPagamentoSelecionado.parcelaEscolhida);

    this.cdr.detectChanges();
  }

  abrirModalFinalizarVenda() {
    this.formToVenda();
    this.primeiroStep = this._formBuilder.group({
      tipoPagamento: new FormControl(this.tipoPagamentoSelecionado, [Validators.required]),
      parcelas: new FormControl(this.venda.parcelas),
      vendaFiado: new FormControl(this.venda.vendaFiado, [Validators.required]),
    });
    this.segundoStep = this._formBuilder.group({});
    this.carregarTiposPagamentos();
    this.modalService.open(this.modalFinalizarVenda, {centered: true, size: "xl"});
  }

  fecharModalFinalizarVenda() {
    this.TiposPagamentos = null;
    this.tipoPagamentoSelecionado = null;
    this.stepper.reset();
    this.primeiroStep.reset();
    this.modalService.dismissAll(this.modalFinalizarVenda);
  }

  finalizarVenda() {
    this.venda.itensVenda = this.itensVenda;
    this.venda.valorTotal = this.calcularValorVendaJuros();
    this.venda.usuarioId = 1;
    this.venda.dataVenda = new Date();
    if (this.tipoPagamentoSelecionado) {
      this.venda.parcelas = this.tipoPagamentoSelecionado.parcelaEscolhida;
      this.venda.tipoPagamentoId = this.tipoPagamentoSelecionado.id;
    }


    this.http.post<Venda>(this.baseUrl + 'api/Venda/Salvar', this.venda).subscribe(
      result => {
        this.itemVenda = new ItensVenda();
        this.itensVenda = [];
        this.dataSource = new MatTableDataSource<ItensVenda>(this.itensVenda);
        this.venda = {} as Venda;
        this.modalService.dismissAll();
        this.openDialog("Venda: ", "Venda realizada com sucesso", "Ok", false);

      },
      error => this.openDialog("Erro: ", error.mensage, "Voltar", true));
  }

  calcularValorVendaJuros(): number {
    let total = this.itensVenda.reduce((total, item) => total + item.subTotal, 0);
    if (this.tipoPagamentoSelecionado?.juros) {
      total = total + ((total * this.tipoPagamentoSelecionado?.juros) / 100);
    }
    return total;
  }

  calcularValorVenda(): number {
    let total = this.itensVenda.reduce((total, item) => total + item.subTotal, 0);
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

  openModal() {
    this.modalService.open(this.modalContent, {centered: true});
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

  formToVenda(): void {
    this.venda.pessoaId = this.getPessoaId();
    this.venda.vendaBalcao = this.getVendaBalcao();
    this.venda.nomeCliente = this.clienteSelececionado == null ? this.getClienteNome() : this.clienteSelececionado.nome;
  }

  getPessoaId(): number {
    return this.vendaForm.get('pessoaId')?.value;
  }

  getVendaBalcao(): boolean {
    return this.vendaForm.get('vendaBalcao')?.value;
  }

  getClienteNome(): string {
    return this.vendaForm.get('clienteNome')?.value;
  }

  getProdutoId(): number {
    return this.vendaForm.get('produtoId')?.value;
  }

  getQuantidade(): number {
    return this.vendaForm.get('quantidade')?.value;
  }

  getPreco(): number {
    return this.vendaForm.get('preco')?.value;
  }
}

interface Venda {
  id: number;
  dataVenda: Date;
  valorTotal: number;
  pessoaId: number;
  parcelas: number;
  usuarioId: number;
  tipoPagamentoId: number;
  nomeCliente: string;
  vendaBalcao: boolean;
  vendaFiado: boolean
  itensVenda: ItensVenda[];
}

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
}

class ItensVenda {
  precoUnitario: number;
  subTotal: number;
  quantidade: number;
  produtoId!: number;
  produto: Produto;

  constructor() {
    this.precoUnitario = 0;
    this.subTotal = 0;
    this.quantidade = 0;
    this.produto = {} as Produto;
    this.produtoId = 0
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
