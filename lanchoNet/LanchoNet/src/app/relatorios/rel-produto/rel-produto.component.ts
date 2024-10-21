import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from "@angular/material/datepicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RelServices, objetoFiltro } from "../../services/relatorio.services";
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {NgForOf} from "@angular/common";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {HttpClient} from "@angular/common/http";
import {ModalComponent} from "../../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-rel-produto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatCheckbox,
    NgForOf,
    NgOptionComponent,
    NgSelectComponent
  ],
  templateUrl: './rel-produto.component.html',
  styleUrl: './rel-produto.component.css'
})
export class RelProdutoComponent implements OnInit {
  public Produtos?: any[];
  objetoFiltro = new objetoFiltro();
  range!: FormGroup;
  baseUrl: string = 'http://localhost:8080/';
  categorias!: any;

  constructor(private relServ: RelServices, private dialog: MatDialog,
              private cdr: ChangeDetectorRef, private http: HttpClient) {
  }

  ngOnInit() {
    this.carregarProdutos();
    this.carregarCategorias();
    this.cdr.detectChanges();
  }

  carregarProdutos() {
    this.http.get<any[]>(this.baseUrl + 'api/Produto/RecuperarProdutos').subscribe(data => {
      this.Produtos = data;
    }, error => this.openDialog("Erro: ", error, "Voltar", true));
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
      data: {titulo: titulo, mensagem: mensagem, botao: botao, erro: erro}
    });
  }

  geraRel() {
    this.relServ.gerarRelProdutos(this.objetoFiltro);
  }
}
