import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {MatLabel} from "@angular/material/form-field";
import {MatStepperPrevious} from "@angular/material/stepper";
import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
  inject, Output, EventEmitter
} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatFooterCell, MatFooterCellDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";
import {MatStep} from '@angular/material/stepper';
import {Subscription} from 'rxjs';
import {CurrencyMaskModule} from "ng2-currency-mask";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton,
    MatLabel,
    MatStepperPrevious,
    NgIf,
    CurrencyMaskModule,
    MatTable,
    MatHeaderCell,
    MatCell,
    NgOptionComponent,
    NgSelectComponent,
    MatCheckbox,
    ReactiveFormsModule,
    MatFooterCell,
    MatHeaderRow,
    MatRow,
    DatePipe,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    MatColumnDef,
    MatFooterCellDef,
    NgForOf
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {
  public pedido: Pedido = { pedidoCliente: false } as Pedido;
  public itemPedido: ItemPedido = new ItemPedido();
  public itensPedido: ItemPedido[] = [];
  public Clientes?: any[];
  public Produtos?: any[];
  public Mesas?: any[];
  pedidoForm!: FormGroup;
  valido: boolean = false;
  baseUrl: string = 'http://localhost:8080/';
  mostrarModal: boolean = false;
  mostrarMensagem: boolean = false;
  textoMensagem: string = "";
  tituloMensagem: string = "";
  dataSource = new MatTableDataSource<ItemPedido>(this.itensPedido);
  displayedColumns: string[] = ['Produto', 'Quantidade', 'Preço', 'Acoes'];
  clienteSelecionado: any = null;
  produtoSelecionado!: Produto;
  private _formBuilder = inject(FormBuilder);
  primeiroStep!: FormGroup;
  segundoStep!: FormGroup;
  private intervalo$!: Subscription;

  @Output() finalizacaoSucesso = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatStep) stepper!: MatStep;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {
    this.pedidoForm = new FormGroup({
      pessoaId: new FormControl('', [Validators.required]),
      produtoId: new FormControl('', [Validators.required]),
      mesaId: new FormControl('', [Validators.required]),
      quantidade: new FormControl('', [Validators.required]),
      pedidoCliente: new FormControl(this.pedido.pedidoCliente, [Validators.required]),
      clienteNome: new FormControl(''),
      preco: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarProdutos();
    this.carregarMesas();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.intervalo$) {
      this.intervalo$.unsubscribe();
    }
  }

  pedidoClienteChange() {
    if (this.getPedidoCliente()) {
      this.pedidoForm.get('pessoaId')?.clearValidators();
      this.pedidoForm.get('pessoaId')?.reset();
      this.pedidoForm.get('clienteNome')?.clearValidators();
      this.pedidoForm.get('clienteNome')?.reset();
      this.pedidoForm.get('clienteNome')?.setValidators([Validators.required]);
      this.pedidoForm.get('clienteNome')?.updateValueAndValidity();
    } else {
      this.pedidoForm.get('clienteNome')?.clearValidators();
      this.pedidoForm.get('clienteNome')?.reset();
      this.pedidoForm.get('pessoaId')?.clearValidators();
      this.pedidoForm.get('pessoaId')?.reset();
      this.pedidoForm.get('pessoaId')?.setValidators([Validators.required]);
      this.pedidoForm.get('pessoaId')?.updateValueAndValidity();
    }
    this.cdr.detectChanges();
  }

  carregarProdutos() {
    this.http.get<any[]>(this.baseUrl + 'api/Produto/RecuperarProdutos').subscribe(data => {
      this.Produtos = data;
    }, error => this.openDialog("Erro: ", error, "Voltar", true));
  }

  carregarMesas() {
    this.http.get<any[]>(this.baseUrl + 'api/Mesa/RecuperarMesas').subscribe(data => {
      this.Mesas = data;
    }, error => this.openDialog("Erro: ", error, "Voltar", true));
  }

  carregarClientes() {
    this.http.get<any[]>(this.baseUrl + 'api/Pessoas/RecuperarPessoas').subscribe(data => {
      this.Clientes = data;
    }, error => this.openDialog("Erro: ", error, "Voltar", true));
  }

  selecionarCliente() {
    if (this.Clientes && this.pedidoForm.get('clienteId')?.value) {
      const clienteId = this.pedidoForm.get('clienteId')?.value;
      this.clienteSelecionado = this.Clientes.find(cliente => cliente.id === clienteId);
    } else {
      this.clienteSelecionado = null;
    }
  }

  selecionarMesa() {
    if (this.Mesas && this.pedidoForm.get('mesaId')?.value) {
      const mesaId = this.pedidoForm.get('mesaId')?.value;
      this.pedido.mesaId = mesaId;
    }
  }

  selecionarProduto() {
    if (this.Produtos && this.pedidoForm.get('produtoId')?.value) {
      const produto = this.Produtos.find(prod => prod.id === this.pedidoForm.get('produtoId')?.value);
      if (produto) {
        this.produtoSelecionado = produto;
        this.pedidoForm.get('preco')?.setValue(this.produtoSelecionado.preco);
        this.itemPedido.produto = this.produtoSelecionado;
      }
    }
  }

  adicionarItem() {
    console.log(this.pedidoForm)
    if (this.pedidoForm.valid) {
      this.itemPedido.quantidade = this.getQuantidade();
      this.itemPedido.precoUnitario = this.getPreco();
      this.itemPedido.produtoId = this.getProdutoId();

      this.itemPedido.subTotal = this.itemPedido.quantidade * this.itemPedido.precoUnitario;

      const itemExistente = this.itensPedido.find(item =>
        item.produtoId === this.itemPedido.produtoId && item.precoUnitario === this.itemPedido.precoUnitario
      );

      if (itemExistente) {
        itemExistente.quantidade += this.itemPedido.quantidade;
        itemExistente.subTotal += this.itemPedido.subTotal;
      } else {
        this.itensPedido.push({...this.itemPedido});
      }
      this.dataSource.data = this.itensPedido;
      this.itemPedido = new ItemPedido();
    }
  }

  removerItem(item: ItemPedido) {
    const index = this.itensPedido.findIndex(i => i.produtoId === item.produtoId);
    if (index > -1) {
      this.itensPedido.splice(index, 1);
      this.dataSource.data = this.itensPedido;
    }
  }

  formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1] || '00';
    return `R$ ${parteInteira},${parteDecimal}`;
  }

  calcularValorTotal() {
    return this.formatarValorParaExibicao(this.itensPedido.reduce((total, item) => total + item.subTotal, 0));
  }

  calcularTotal() {
    return this.itensPedido.reduce((total, item) => total + item.subTotal, 0);
  }

  salvarPedido() {
    this.formToPedido();
    this.pedido.itensPedido = this.itensPedido;
    this.pedido.valorTotal = this.calcularTotal();
    this.pedido.dataPedido = new Date();

    this.http.post<Pedido>(this.baseUrl + 'api/Pedido/Salvar', this.pedido).subscribe(
      () => {
        if(!this.verificarOuvintes()){
          this.openDialog("Pedido", "Pedido realizado com sucesso", "Ok", false);
        }
        this.itensPedido = [];
        this.dataSource = new MatTableDataSource<ItemPedido>(this.itensPedido);
        this.finalizacaoSucesso.emit();
      },
      error => this.openDialog("Erro", error.message, "Voltar", true)
    );
  }

  verificarOuvintes(): boolean {
    return this.finalizacaoSucesso.observed;
  }

  openDialog(titulo: string, mensagem: string, botao: string, mostrarModal: boolean) {
    this.tituloMensagem = titulo;
    this.textoMensagem = mensagem;
    this.mostrarModal = mostrarModal;
  }

  private getProdutoId(): number {
    return this.pedidoForm.get('produtoId')?.value;
  }

  private getPessoaId(): number {
    return this.pedidoForm.get('pessoaId')?.value;
  }

  private getQuantidade(): number {
    return this.pedidoForm.get('quantidade')?.value;
  }

  private getPreco(): number {
    return this.pedidoForm.get('preco')?.value;
  }

  getPedidoCliente(): boolean {
    return this.pedidoForm.get('pedidoCliente')?.value;
  }

  getClienteNome(): boolean {
    return this.pedidoForm.get('clienteNome')?.value;
  }

  formToPedido(): void {
    this.pedido.pessoaId = this.getPessoaId();
    this.pedido.pedidoCliente = this.getPedidoCliente();
    this.pedido.nomeCliente = this.clienteSelecionado == null ? this.getClienteNome() : this.clienteSelecionado.nome;
  }
}

export class Pedido {
  id!: number;
  dataPedido!: Date;
  dataFechamentoPedido!: Date;
  parcelas!: number;
  valorTotal!: number;
  nomeCliente!: string;
  statusPedido!: string;
  tipoPedido!: string;
  pedidoFechado: boolean = false;
  pedidoPago: boolean = false;
  pessoaId!: number;
  usuarioId!: number;
  mesaId!: number;
  vendaId!: number;
  pedidoCliente: boolean = false
  itensPedido!: ItemPedido[];
}

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
}

class ItemPedido {
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
