import { HttpClient } from '@angular/common/http';
import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from "ngx-mask";
import { NgSelectModule } from "@ng-select/ng-select";
import {ModalComponent} from "../../modal/modal.component";

@Component({
  selector: 'app-cadastro-caixa',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective, NgSelectModule, RouterLink],
  templateUrl: './cadastro-caixa.component.html',
  styleUrl: './cadastro-caixa.component.css'
})

export class CadastroCaixaComponent {
  baseUrl: string = 'http://localhost:8080/';
  caixa: Caixa = new Caixa();
  formCaixa?: FormGroup;
  ehAlteracao: boolean = false;

  @ViewChild('modalResposta') modalResposta!: TemplateRef<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    var id = Number(this.route.snapshot.paramMap.get('id?'));
    if (id) {
      this.http.post<Caixa>(this.baseUrl + 'api/Caixa/RertornaPorId', id).subscribe(data => {
        this.caixa = data;
        this.ehAlteracao = true;
      }, error => {
        this.openDialog("Erro ao recuperar caixa", error, "Voltar", true);
      });
    }

    this.formCaixa = new FormGroup({
      dataAbertura: new FormControl(this.caixa.dataAbertura, [Validators.required]),
      valorInicial: new FormControl(this.caixa.valorInicial, [Validators.required]),
      ...(this.ehAlteracao ? {
        dataFechamento: new FormControl(this.caixa.dataFechamento),
        valorTotal: new FormControl(this.caixa.valorTotal)
      } : {})
    });
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'modalClass',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!erro) this.router.navigate(['/../listaCaixas']);
    });
  }

  salvarCaixa() {
    if (this.formCaixa?.invalid) {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');
      return;
    } else {
      this.http.post<any>(this.baseUrl + 'api/Caixa/AbreCaixa', this.caixa).subscribe(data => {
        this.openDialog(this.ehAlteracao ? "Alteração realizada com sucesso" : "Cadastro realizado com sucesso", "", "Continuar", false);
      }, error => this.openDialog(this.ehAlteracao ? "Erro ao salvar alterações" : "Erro ao cadastrar", error, "Voltar", true));
    }
  }
}

class Caixa {
  id: number | null = null;
  dataAbertura: string | null = null;
  dataFechamento: string | null = null;
  valorInicial: number | null = null;
  valorTotal: number | null = null;
  status: string | null = "ABERTO";
}
