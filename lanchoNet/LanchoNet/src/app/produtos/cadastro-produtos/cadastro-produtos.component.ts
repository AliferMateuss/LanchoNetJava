import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, RendererFactory2, TemplateRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule, ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../../modal/modal.component';
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {NgxMaskDirective} from "ngx-mask";
import {NgSelectModule} from "@ng-select/ng-select";
import {CurrencyMaskModule} from "ng2-currency-mask";
declare var $: any;
@Component({
  selector: 'app-cadastro-produtos',
  templateUrl: './cadastro-produtos.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule, NgxMaskDirective, NgSelectModule, CurrencyMaskModule],
  standalone: true,
  styleUrls: ['./cadastro-produtos.component.css'],
})
export class CadastroProdutosComponent {
  baseUrl: string = 'http://localhost:8080/';
  produto: Produtos = new Produtos();
  formProduto?: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  ehAlteracao: boolean = false;
  categorias!: any;


  tituloModal: string = "Salvo com sucesso";
  erro: boolean = false;

  @ViewChild('modalResposta') modalResposta!: TemplateRef<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.carregarCategorias();
    var id =  Number(this.route.snapshot.paramMap.get('id?'));
    if (id) {
      this.http.post<Produtos>(this.baseUrl + 'api/Produto/RertornaPorId', id).subscribe(data => {
        this.produto = data;
        if (data.imagem)
          this.imageUrl = data.imagem;

        this.ehAlteracao = true;

      }, error => {
        this.openDialog("Erro ao recuperar produto", error, "Voltar", true);
      });
    }

    this.formProduto = new FormGroup({
      nome: new FormControl(this.produto.nome, [Validators.required]),
      quantidade: new FormControl(this.produto.quantidade, [Validators.required]),
      preco: new FormControl(this.produto.preco, [Validators.required]),
      precoCompra: new FormControl(this.produto.precoCompra, [Validators.required]),
      categoriaId: new FormControl(this.produto.categoriaId, [Validators.required])
    }, [this.validacaoPrecos()]);

  }

  carregarCategorias() {
    this.http.get<any[]>(this.baseUrl + 'api/Categoria/RecuperarCategorias').subscribe(data => {
      this.categorias = data;
    }, error => this.openDialog("Erro: ", error, "Voltar", true));

  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: {titulo: titulo, mensagem: mensagem, botao:botao, erro:erro }
    });
    if (erro) {

    } else {
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/../listaProdutos']);
      });
    }

  }

  validacaoPrecos(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const preco = group.get('preco')?.value;
      const precoCompra = group.get('precoCompra')?.value;
      if (preco && precoCompra && preco <= precoCompra) {
        return { invalidComparison: true };
      }
      return null;
    };
  }

  salvarproduto() {
    if (this.formProduto?.invalid) {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');

      if (this.formProduto.errors?.['invalidComparison']) {
        var preco = document.querySelector('#precoCompra') as HTMLFormElement;
        preco.style.borderColor = 'var(--bs-form-invalid-color)';
        var input = document.querySelector('.invalid-feedback.preco') as HTMLFormElement;
        input.style.display = 'block';
      } else {
        var data = document.querySelector('#precoCompra') as HTMLFormElement;
        data.style.borderColor = 'var(--bs-border-color)';
        var input = document.querySelector('.invalid-feedback.preco') as HTMLFormElement;
        if (input)
          input.style.display = 'none';
      }
      return;
    } else {
        this.http.post<any>(this.baseUrl + 'api/Produto/Salvar', this.produto).subscribe(data => {
          this.openDialog(this.ehAlteracao ? "Alteração realizada com sucesso" : "Cadastro realizado com sucesso", "", "Continuar", false);
        }, error => this.openDialog(this.ehAlteracao ? "Erro ao salvar alterações" : "Erro ao cadastrar", error, "Voltar", true));
      }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.produto.imagem = reader.result as string;
      };
    } else {
      this.produto.imagem = null;
    }
  }

  fileToFormFile(file: File): FormData {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return formData;
  }
}


class Produtos {
  id: number | null = null;
  nome: string | null = null;
  quantidade: number | null = null;
  preco: number | null = null;
  precoCompra: number | null = null;
  imagem: string | null = null;
  categoriaId: number | null = null;
}

