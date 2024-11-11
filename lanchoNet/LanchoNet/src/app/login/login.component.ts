import { Component, Renderer2, ElementRef } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {Mesa} from "../mesa/cadastro-mesa/cadastro-mesa.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {ModalComponent} from "../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-login',
  templateUrl: 'login.html',
  styleUrls: ['login.css'],
  imports: [CommonModule, FormsModule , ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule ],
  standalone: true
})
export class LoginComponent {
  baseUrl: string = 'http://localhost:8080/';
  username: string;
  password: string;

  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef,
              private http: HttpClient, private dialog: MatDialog) {
    this.username = '';
    this.password = '';
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'body-blue');
  }
  public login() {
    if (this.username === '' && this.password === '') {

    } else {
      this.http.post(this.baseUrl + 'api/Usuario/Logar', {login: this.username, senha:this.password} ).subscribe(data => {

        if (data) {
          this.router.navigate(['/comandas']);
        } else {
          this.openDialog("Atenção", "Usuario ou senha incorretos!!" , "Voltar", true)
        }

      }, error => this.openDialog("Atenção", "Usuario ou senha incorretos!!", "Voltar", true));
    }
  }
}
