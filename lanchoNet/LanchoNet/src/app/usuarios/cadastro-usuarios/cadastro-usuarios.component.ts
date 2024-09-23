import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, RendererFactory2, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'app-cadastro-usuarios',
  templateUrl: './cadastro-usuarios.component.html',
  styleUrls: ['./cadastro-usuarios.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule, NgSelectModule ],
  standalone: true,
})
export class CadastroUsuariosComponent {
  baseUrl: string = 'http://localhost:8080/';
  usuario: Usuario = new Usuario();
  formUsuario?: FormGroup;
  grupoUsuario: any[] | null = null;
  pessoas: any[] | null = null;
  ehAlteracao: boolean = false;

  @ViewChild('modalResposta') modalResposta!: TemplateRef<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private dialog: MatDialog, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get('id?');
    if (id) {
      const params = new HttpParams().set("id", id);
      this.http.get<Usuario>(this.baseUrl + 'api/Usuario/RertornaPorId', { params }).subscribe(data => {
        this.usuario = data;
        this.ehAlteracao = true;
      }, error => this.openDialog("Erro ao recuperar usuário", error, "Voltar", true));
    }

    this.formUsuario = new FormGroup({
      usuario: new FormControl(this.usuario.usuario, [Validators.required]),
      senha: new FormControl(this.usuario.senha, [Validators.required]),
      idPessoa: new FormControl(this.usuario.idPessoa, [Validators.required]),
      idGrupoUsuario: new FormControl(this.usuario.idGrupoUsuario, [Validators.required])
    });

    this.carregargrupoUsuario();
    this.carregarPessoas();
  }

  carregargrupoUsuario() {
    this.http.get<any[]>(this.baseUrl + 'api/GrupoUsuario/RecuperarGrupoUsuarios').subscribe(data => {
      this.grupoUsuario = data;
      this.cdr.detectChanges();
    }, error => console.error(error));
  }

  carregarPessoas() {
    this.http.get<any[]>(this.baseUrl + 'api/Pessoas/RecuperarPessoas').subscribe(data => {
      this.pessoas = data;
      this.cdr.detectChanges();
    }, error => console.error(error));
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
    if (!erro) {
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/../listaUsuarios']);
      });
    }
  }

  salvarUsuario() {
    if (this.formUsuario?.invalid) {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');
      return;
    } else {
      const url = this.ehAlteracao ? 'api/Usuario/Atualizar' : 'api/Usuario/Salvar';
      this.http.post<any>(this.baseUrl + url, this.usuario).subscribe(data => {
        this.openDialog(this.ehAlteracao ? "Alteração realizada com sucesso" : "Cadastro realizado com sucesso", "", "Continuar", false);
      }, error => this.openDialog(this.ehAlteracao ? "Erro ao salvar alterações" : "Erro ao cadastrar", error, "Voltar", true));
    }
  }

  selecionarPessoa(event: any) {
    // Lógica para selecionar pessoa
  }

  selecionarGrupoUsuario(event: any) {
    // Lógica para selecionar grupo de usuário
  }
}

export class Usuario {
  id: number | null = null;
  usuario: string | null = null;
  senha: string | null = null;
  idPessoa: number | null = null;
  idGrupoUsuario: number | null = null;
  dataSenha: Date | null = null;
}
