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
import {MatCell, MatHeaderCell, MatTableModule , MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CommonModule, registerLocaleData } from "@angular/common";
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
import { interval, Subscription } from 'rxjs';
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
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }]
})
export class VendaComponent implements AfterViewInit, OnInit, OnDestroy{
  public venda: Venda = {} as Venda;
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
  clienteSelececionado!: any;
  clienteNome!: string;
  produtoSelecionado!: Produto;
  private _formBuilder = inject(FormBuilder);
  primeiroStep! :FormGroup;
  segundoStep! :FormGroup;
  private intervalo$!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatStep) stepper!: MatStep;
  @ViewChild('modalContent') modalContent: any;
  @ViewChild('modalVenda') modalFinalizarVenda: any;

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal,
              private dialog: MatDialog, private router: Router, private cdr: ChangeDetectorRef, private zone: NgZone) {
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarProdutos();
    this.vendaForm = new FormGroup({
      pessoaId: new FormControl(this.venda.pessoaId, [Validators.required]),
      vendaBalcao: new FormControl(this.venda.vendaBalcao, [Validators.required]),
      // vendaFiado: new FormControl(this.venda.vendaFiado, [Validators.required]),
      clienteNome: new FormControl(this.venda.nomeCliente, [Validators.required]),
      produtoId: new FormControl(this.itemVenda.produtoId, [Validators.required]),
      quantidade: new FormControl(this.itemVenda.quantidade, [Validators.required]),
      preco: new FormControl(this.itemVenda.quantidade, [Validators.required])
    });
  }

  ngAfterViewInit(): void {
    this.atualizarHora();
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
    if (this.Clientes && this.venda.pessoaId) {

      const clienteSelecionadoid = this.venda.pessoaId;
      this.clienteSelececionado = this.Clientes.find(cliente => cliente.id === clienteSelecionadoid);

      if (this.clienteSelececionado) {
        this.clienteNome = this.clienteSelececionado.nome;
      }
    }
  }

  selecionarProduto() {
    if (this.Produtos && this.itemVenda.produtoId) {
      this.mapeaDataParaProduto(this.Produtos.find(produto => produto.id === this.itemVenda.produtoId));
      if (this.produtoSelecionado) {
        this.itemVenda.produto = this.produtoSelecionado;
        this.itemVenda.precoUnitario = this.produtoSelecionado.preco;
      }
    }
  }

  mapeaDataParaProduto(data: any) {
    this.produtoSelecionado = {} as Produto;
    this.produtoSelecionado.id = data.id;
    this.produtoSelecionado.nome = data.nome;
    this.produtoSelecionado.preco = data.preco;
    this.produtoSelecionado.quantidade = data.quantidade;
  }

  validarEntrada(): boolean {
    return (
      this.itemVenda.produtoId !== null &&
      this.itemVenda.quantidade !== null &&
      this.itemVenda.precoUnitario !== null &&
      this.itemVenda.produtoId > 0 &&
      this.itemVenda.quantidade > 0 &&
      this.itemVenda.precoUnitario > 0
    );
  }

  temEstoqueSuficiente(): boolean {
    return this.produtoSelecionado.quantidade >= this.itemVenda.quantidade;
  }

  adicionarItem() {
    this.mostrarMensagem = false;
    if (this.validarEntrada()) {
      if (this.temEstoqueSuficiente()) {
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
          this.itensVenda.push({ ...this.itemVenda });
        }

        this.dataSource.data = this.itensVenda;
        this.itemVenda = new ItensVenda();
      } else {
        this.tituloMensagem = "Estoque insuficiente para o item: " + this.itemVenda.produto.nome;
        this.textoMensagem = "Quantidade em estoque: " + this.itemVenda.produto.quantidade;
        this.mostrarMensagem = true;
      }
    } else {
      this.tituloMensagem = "Prencha corretamente os campos!" + this.itemVenda.produto.nome;
      this.textoMensagem = "Quantidade em estoque: " + this.itemVenda.produto.quantidade;
      this.mostrarMensagem = true;
    }
  }

  removerItem(itemVenda : ItensVenda) {
    const itemIndex = this.itensVenda.findIndex(
      (item) => item.produtoId === itemVenda.produtoId && item.precoUnitario === itemVenda.precoUnitario
    );

    if (itemIndex > -1) {
      this.itensVenda.splice(itemIndex, 1);

      this.dataSource.data = this.itensVenda;

      this.produtoSelecionado.quantidade += this.itensVenda[itemIndex].quantidade;
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

  changeFormaPagamento() {
    if (this.tipoPagamentoSelecionado?.avista === true) {
      this.parcelar = false;
    } else {
      this.parcelar = true;
    }
  }

  abrirModalFinalizarVenda() {
    this.primeiroStep = this._formBuilder.group({
      tipoPagamento: new FormControl(this.tipoPagamentoSelecionado),
      parcelas: new FormControl(this.venda.parcelas),
      vendaFiado: new FormControl(this.venda.vendaFiado, [Validators.required]),
    });
    this.segundoStep = this._formBuilder.group({});
    this.carregarTiposPagamentos();
    this.modalService.open(this.modalFinalizarVenda, { centered: true });
  }

  fecharModalFinalizarVenda(){
    this.TiposPagamentos = null;
    this.tipoPagamentoSelecionado = null;
    this.stepper.reset();
    this.modalService.dismissAll(this.modalFinalizarVenda);
  }

  finalizarVenda() {
    this.venda.itensVenda = this.itensVenda;
    this.venda.valorTotal = this.itensVenda.reduce((total, item) => total + item.subTotal, 0);
    this.venda.vendaBalcao = false;
    this.venda.vendaFiado = false;
    this.venda.usuarioId = 1;
    if(this.tipoPagamentoSelecionado)
      this.venda.tipoPagamentoId = this.tipoPagamentoSelecionado.id;


    this.http.post<Venda>(this.baseUrl + 'api/Venda/Salvar', this.venda).subscribe(
      result => {
        this.itemVenda = new ItensVenda();
        this.itensVenda = [];
        this.dataSource = new MatTableDataSource<ItensVenda>(this.itensVenda);
        this.venda = {} as Venda;
        this.modalService.dismissAll();
        this.openDialog("Venda: ", "Venda realizada com sucesso", "Ok", true);

      },
      error => this.openDialog("Erro: ", error.mensage, "Voltar", false));
  }

  carregarTiposPagamentos() {
    this.http.get<TipoPagamento[]>(this.baseUrl + 'api/TipoPagamento/RecuperarTipoPagamentos').subscribe(data => {
      this.TiposPagamentos = data;
    }, error => this.openDialog("Erro: ", error.mensage, "Voltar", true));

  }

  openModal() {
    this.modalService.open(this.modalContent, { centered: true });
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
    if (!erro) {
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/../listaMesas']);
      });
    }
  }

  getVendaBalcaoValue(): boolean {
    const vendaBalcaoControl = this.vendaForm.get('vendaBalcao');
    return vendaBalcaoControl?.value;  // Retorna o valor do controle 'vendaBalcao'
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
  avista: boolean;
}
