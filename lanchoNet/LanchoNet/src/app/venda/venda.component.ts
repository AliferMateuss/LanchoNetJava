import { Component, OnInit, Inject, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import {HttpClient, HttpClientModule, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";


@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatPaginatorModule,
    MatSortModule],
  standalone: true,
  styleUrls: ['./venda.component.css']
})
export class VendaComponent {
  public venda: Venda = {} as Venda;
  public itemVenda: ItensVenda = new ItensVenda();
  public itensVenda: ItensVenda[] = [];
  public Clientes?: any[];
  public Produtos?: any[];
  vendaForm!: FormGroup;
  valido: boolean = false;
  baseUrl: string = 'http://localhost:8080/';
  mostrarModal: boolean = false;
  mostrarMensagem: boolean = false;
  parcelar: boolean = false;
  textoMensagem: string = "";
  tituloMensagem: string = "";
  dataSource = new MatTableDataSource<ItensVenda>(this.itensVenda);
  displayedColumns: string[] = ['Produto', 'Quantidade', 'Preço', 'SubTotal'];
  clienteSelececionado!: any;
  PgtoSelececionado!: any;
  produtoSelecionado!: Produto;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('modalContent') modalContent: any;
  @ViewChild('modalVenda') modalFinalizarVenda: any;

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal) { }

  ngOnInit() {
    this.CarregarClientes();
    this.CarregarProdutos();
    this.atualizarHora();
    setInterval(() => {
      this.atualizarHora();
    }, 1000);
  }

  atualizarHora() {
    this.venda.DataVenda = new Date();
  }

  CarregarProdutos() {
    this.http.get<any[]>(this.baseUrl + 'api/Produto/BuscaTodos').subscribe(data => {
      this.Produtos = data;
    }, error => console.error(error));

  }
  CarregarClientes() {
    this.http.get<any[]>(this.baseUrl + 'api/Cliente/BuscaTodos').subscribe(data => {
      this.Clientes = data;
    }, error => console.error(error));

  }

  SelecionarCliente() {
    if (this.Clientes && this.venda.ClienteId) {

      const clienteSelecionadoId = this.venda.ClienteId;
      this.clienteSelececionado = this.Clientes.find(cliente => cliente.id === clienteSelecionadoId);

      if (this.clienteSelececionado) {
      }
    }
  }

  SelecionarProduto() {
    if (this.Produtos && this.itemVenda.ProdutoId) {
      this.mapeaDataParaProduto(this.Produtos.find(produto => produto.id === this.itemVenda.ProdutoId));
      if (this.produtoSelecionado) {
        this.itemVenda.Produto = this.produtoSelecionado;
        this.itemVenda.PrecoUnitario = this.produtoSelecionado.Preco;
      }
    }
  }

  mapeaDataParaProduto(data: any) {
    this.produtoSelecionado = {} as Produto;
    this.produtoSelecionado.Descricao = data.descricao;
    this.produtoSelecionado.Id = data.id;
    this.produtoSelecionado.Nome = data.nome;
    this.produtoSelecionado.Preco = data.preco;
    this.produtoSelecionado.Quantidade = data.quantidade;
  }

  validarEntrada(): boolean {
    return (
      this.itemVenda.ProdutoId !== null &&
      this.itemVenda.Quantidade !== null &&
      this.itemVenda.PrecoUnitario !== null &&
      this.itemVenda.ProdutoId > 0 &&
      this.itemVenda.Quantidade > 0 &&
      this.itemVenda.PrecoUnitario > 0
    );
  }

  temEstoqueSuficiente(): boolean {
    return this.produtoSelecionado.Quantidade >= this.itemVenda.Quantidade;
  }

  AdicionarItem() {
    this.mostrarMensagem = false;
    if (this.validarEntrada()) {
      if (this.temEstoqueSuficiente()) {
        this.produtoSelecionado.Quantidade -= this.itemVenda.Quantidade;
        this.itemVenda.SubTotal = this.itemVenda.Quantidade * this.itemVenda.PrecoUnitario;

        const produtoExistente = this.itensVenda.find(
          (item) =>
            item.ProdutoId === this.itemVenda.ProdutoId &&
            item.PrecoUnitario === this.itemVenda.PrecoUnitario
        );

        if (produtoExistente) {
          produtoExistente.Quantidade += this.itemVenda.Quantidade;
          produtoExistente.SubTotal += this.itemVenda.SubTotal;
        } else {
          this.itensVenda.push({ ...this.itemVenda });
        }

        this.dataSource = new MatTableDataSource<ItensVenda>(this.itensVenda);
        this.itemVenda = new ItensVenda();
        console.log(this.itensVenda);
      } else {
        this.tituloMensagem = "Estoque insuficiente para o item: " + this.itemVenda.Produto.Nome;
        this.textoMensagem = "Quantidade em estoque: " + this.itemVenda.Produto.Quantidade;
        this.mostrarMensagem = true;
      }
    } else {
      console.log("Entrada inválida");
    }
  }

  formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1] || '00';
    return `R$ ${parteInteira},${parteDecimal}`;
  }

  CalcularValorTotal() {
    return this.formatarValorParaExibicao(this.itensVenda.reduce((total, item) => total + item.SubTotal, 0));
  }

  ChangeFormaPagamento() {
    if (this.PgtoSelececionado === 3) {
      this.parcelar = true;
    } else {
      this.parcelar = false;
    }
  }

  AbrirModalFormaPagamento() {
    this.modalService.open(this.modalFinalizarVenda, { centered: true });
  }

  FinalizarVenda() {
    this.venda.ItensVenda = this.itensVenda;
    this.venda.ValorTotal = this.itensVenda.reduce((total, item) => total + item.SubTotal, 0);
    this.http.post<Venda>(this.baseUrl + 'api/Venda/Salvar', this.venda).subscribe(
      result => {
        this.tituloMensagem = "Venda";
        this.textoMensagem = "Venda finalizada com sucesso";
        this.itemVenda = new ItensVenda();
        this.itensVenda = [];
        this.dataSource = new MatTableDataSource<ItensVenda>(this.itensVenda);
        this.venda = {} as Venda;
        this.modalService.dismissAll();
        this.openModal();

      },
      error => { console.error(error); });
  }

  openModal() {
    this.modalService.open(this.modalContent, { centered: true });
  }
}

interface Venda {
  Id: number;
  DataVenda: Date;
  ValorTotal: number;
  ClienteId: number;
  Parcelas: number;
  UsuarioId: number;
  ItensVenda: ItensVenda[];
}

interface Produto {
  Id: number;
  Nome: string;
  Descricao?: string;
  Quantidade: number;
  Preco: number;
}

class ItensVenda {
  Id: number;
  VendaId: number;
  PrecoUnitario: number;
  SubTotal: number;
  Quantidade: number;
  ProdutoId!: number;
  Produto: Produto

  constructor() {
    this.Id = 0;
    this.VendaId = 0;
    this.PrecoUnitario = 0;
    this.SubTotal = 0;
    this.Quantidade = 0;
    this.Produto = {} as Produto;
  }
}
