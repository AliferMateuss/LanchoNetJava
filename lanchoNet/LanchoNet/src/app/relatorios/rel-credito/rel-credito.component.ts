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

@Component({
  selector: 'app-rel-credito',
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
  templateUrl: './rel-credito.component.html',
  styleUrl: './rel-credito.component.css'
})
export class RelCreditoComponent implements OnInit {
  baseUrl: string = 'http://localhost:8080/';
  objetoFiltro = new objetoFiltro();
  pessoas!:any;

  constructor(private relServ: RelServices, private cdr: ChangeDetectorRef, private http:HttpClient, private dialog:MatDialog) {
  }

  ngOnInit() {
    this.carregarPessoas();
    this.cdr.detectChanges();
  }

  carregarPessoas() {
    this.http.get<any[]>(this.baseUrl + 'api/Pessoas/RecuperarPessoas').subscribe(data => {
      this.pessoas = data;
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
    this.relServ.gerarRelCreditos(this.objetoFiltro);
  }


}
