import { Component, OnInit, Inject, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import {HttpClient, HttpClientModule, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCell, MatHeaderCell, MatTable, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";
import {ModalComponent} from "../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {CurrencyMaskModule} from "ng2-currency-mask";


@Component({
  selector: 'app-venda',
  templateUrl: './venda.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatPaginatorModule,
    MatSortModule, NgSelectComponent, NgOptionComponent, CurrencyMaskModule, MatTable, MatHeaderCell, MatCell],
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

  constructor(private http: HttpClient, private fb: FormBuilder, private modalService: NgbModal,
              private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.carregarClientes();
    this.carregarProdutos();
    this.atualizarHora();
    setInterval(() => {
      this.atualizarHora();
    }, 1000);
  }

  atualizarHora() {
    this.venda.dataVenda = new Date();
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
    if (this.Clientes && this.venda.clienteid) {

      const clienteSelecionadoid = this.venda.clienteid;
      this.clienteSelececionado = this.Clientes.find(cliente => cliente.id === clienteSelecionadoid);

      if (this.clienteSelececionado) {
      }
    }
  }

  selecionarProduto() {
    if (this.Produtos && this.itemVenda.produtoid) {
      this.mapeaDataParaProduto(this.Produtos.find(produto => produto.id === this.itemVenda.produtoid));
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
      this.itemVenda.produtoid !== null &&
      this.itemVenda.quantidade !== null &&
      this.itemVenda.precoUnitario !== null &&
      this.itemVenda.produtoid > 0 &&
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
            item.produtoid === this.itemVenda.produtoid &&
            item.precoUnitario === this.itemVenda.precoUnitario
        );

        if (produtoExistente) {
          produtoExistente.quantidade += this.itemVenda.quantidade;
          produtoExistente.subTotal += this.itemVenda.subTotal;
        } else {
          this.itensVenda.push({ ...this.itemVenda });
        }

        this.dataSource = new MatTableDataSource<ItensVenda>(this.itensVenda);
        this.itemVenda = new ItensVenda();
        console.log(this.itensVenda);
      } else {
        this.tituloMensagem = "Estoque insuficiente para o item: " + this.itemVenda.produto.nome;
        this.textoMensagem = "Quantidade em estoque: " + this.itemVenda.produto.quantidade;
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

  calcularValorTotal() {
    return this.formatarValorParaExibicao(this.itensVenda.reduce((total, item) => total + item.subTotal, 0));
  }

  changeFormaPagamento() {
    if (this.PgtoSelececionado === 3) {
      this.parcelar = true;
    } else {
      this.parcelar = false;
    }
  }

  abrirModalFormaPagamento() {
    this.modalService.open(this.modalFinalizarVenda, { centered: true });
  }

  finalizarVenda() {
    this.venda.itensVenda = this.itensVenda;
    this.venda.valorTotal = this.itensVenda.reduce((total, item) => total + item.subTotal, 0);
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
}

interface Venda {
  id: number;
  dataVenda: Date;
  valorTotal: number;
  clienteid: number;
  parcelas: number;
  usuarioid: number;
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
  produtoid!: number;
  produto: Produto;

  constructor() {
    this.precoUnitario = 0;
    this.subTotal = 0;
    this.quantidade = 0;
    this.produto = {} as Produto;
    this.produtoid = 0
  }
}
