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

@Component({
  selector: 'app-cadastro-mesa',
  templateUrl: './cadastro-mesa.component.html',
  imports: [CommonModule, FormsModule , ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule ],
  standalone: true,
  styleUrls: ['./cadastro-mesa.component.css']
})
export class CadastroMesaComponent {
  baseUrl: string = 'http://localhost:8080/';
  mesa: Mesa = new Mesa();
  formMesa?: FormGroup;
  ehAlteracao: boolean = false;

  @ViewChild('modalResposta') modalResposta!: TemplateRef<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    var id = Number(this.route.snapshot.paramMap.get('id?'));
    if (id) {
      this.http.post<Mesa>(this.baseUrl + 'api/Mesa/RertornaPorId', id ).subscribe(data => {
        this.mesa = data;
        this.ehAlteracao = true;
      }, error => this.openDialog("Erro ao recuperar mesa", error, "Voltar", true));
    }

    this.formMesa = new FormGroup({
      numero: new FormControl(this.mesa.numero, [Validators.required]),
      capacidade: new FormControl(this.mesa.capacidade, [Validators.required]),
    });
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

  salvarMesa() {
    if (this.formMesa?.invalid) {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');
      return;
    } else {
      this.http.post<Mesa>(this.baseUrl + 'api/Mesa/Salvar', this.mesa).subscribe(data => {
        this.openDialog(this.ehAlteracao ? "Alteração realizada com sucesso" : "Cadastro realizado com sucesso", "", "Continuar", false);
      }, error => this.openDialog(this.ehAlteracao ? "Erro ao salvar alterações" : "Erro ao cadastrar", error, "Voltar", true));
    }
  }
}

export class Mesa {
  id: number | null = null;
  numero: number | null = null;
  capacidade: number | null = null;
}
