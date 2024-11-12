import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {ModalComponent} from "../../../../modal/modal.component";
import {NgForOf, NgIf} from "@angular/common";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-adicionar-item-pedido',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    NgForOf,
    NgOptionComponent,
    NgSelectComponent,
    NgIf
  ],
  templateUrl: './adicionar-item-pedido.component.html',
  styleUrl: './adicionar-item-pedido.component.css'
})
export class AdicionarItemPedidoComponent {
  baseUrl: string = 'http://localhost:8080/';
  formItemPedido?: FormGroup;
  ehAlteracao: boolean = false;
  itemPedido!: ItemPedido;
  public Produtos?: any[];
  produtoSelecionado!: Produto;
  mostrarMensagem: boolean = false;
  textoMensagem: string = "";
  tituloMensagem: string = "";
  idComanda!: number;

  @ViewChild('modalResposta') modalResposta!: TemplateRef<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: number , private dialogRef: MatDialogRef<AdicionarItemPedidoComponent>) {
    this.idComanda = data;
  }

  ngOnInit() {
    this.carregarProdutos();
    this.itemPedido = new ItemPedido();
    this.formItemPedido = new FormGroup({
      produtoId: new FormControl( this.itemPedido.produtoId, [Validators.required]), // ReadOnly
      precoUnitario: new FormControl(this.itemPedido.precoUnitario, [Validators.required]),
      quantidade: new FormControl(this.itemPedido.quantidade, [Validators.required]),
      subTotal: new FormControl({ value: this.itemPedido.subTotal, disabled: true }, [Validators.required]) // ReadOnly
    });
  }

  carregarProdutos() {
    this.http.get<any[]>(this.baseUrl + 'api/Produto/RecuperarProdutos').subscribe(data => {
      this.Produtos = data;
    }, error => this.openDialog("Erro: ", error, "Voltar", true));

  }

  selecionarProduto() {
    if (this.Produtos && this.formItemPedido?.get('produtoId')?.value) {
      const prod = this.Produtos.find(produto => produto.id === this.formItemPedido?.get('produtoId')?.value);
      if (!prod) {
        this.openDialog("Erro ", "Ocorreu um erro ao selecionar o produto", "Ok", true);
        return;
      }
      this.mapeaDataParaProduto(prod);
      this.formItemPedido.get('precoUnitario')?.setValue(this.produtoSelecionado.preco)
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
    return this.produtoSelecionado.quantidade >= this.formItemPedido?.get('quantidade')?.value;
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
    if (!erro) {
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/../listaItensPedido']);
      });
    }
  }

  calculaSubTotal(): string{
    const valor = (this.itemPedido.precoUnitario * this.itemPedido.quantidade).toFixed(2)
    return this.formatarValorParaExibicao(Number.parseFloat(valor));
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

  salvarItemPedido() {
    if (this.formItemPedido?.invalid) {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');
      return;
    } else {

      if(!this.validaEstoque()){ return;}

      this.itemPedido.idPedido = this.idComanda;

      this.http.post<ItemPedido>(this.baseUrl + 'api/Pedido/SalvaItemPedido', this.itemPedido).subscribe(data => {
        this.dialogRef.close();
      }, error => this.openDialog("Erro ao salvar alterações", error, "Voltar", true));
    }
  }

  validaEstoque() : boolean{
    if (this.temEstoqueSuficiente()) {
      this.itemPedido.quantidade = this.formItemPedido?.get('quantidade')?.value;
      this.itemPedido.precoUnitario = this.formItemPedido?.get('precoUnitario')?.value;
      this.itemPedido.produtoId = this.formItemPedido?.get('produtoId')?.value
      this.itemPedido.subTotal = this.itemPedido.quantidade * this.itemPedido.precoUnitario;
      return true;
    } else {
      this.tituloMensagem = "Estoque insuficiente para o item: " + this.produtoSelecionado.nome;
      this.textoMensagem = "Quantidade em estoque: " + this.produtoSelecionado.quantidade;
      this.mostrarMensagem = true;
      return false;
    }
  }

  fecharModal(){
    this.dialogRef.close();
  }
}

export class ItemPedido {
  id!: number;
  subTotal!: number;
  precoUnitario!: number;
  quantidade!: number;
  produtoNome!: string;
  produtoId!: number;
  idPedido!: number;
}

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
}
