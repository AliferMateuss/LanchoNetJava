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
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {ModalComponent} from "../../modal/modal.component";
import {NgForOf} from "@angular/common";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-rel-contas-receber',
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
  templateUrl: './rel-contas-receber.component.html',
  styleUrl: './rel-contas-receber.component.css'
})
export class RelContasReceberComponent implements OnInit {
  baseUrl: string = 'http://localhost:8080/';
  objetoFiltro = new objetoFiltro();
  pessoas!:any;
  range!: FormGroup;

  constructor(private relServ: RelServices, private cdr: ChangeDetectorRef,private http:HttpClient, private dialog:MatDialog) {
  }

  ngOnInit() {
    this.objetoFiltro.dataFim = new Date();
    this.objetoFiltro.dataInicio = new Date();
    this.range = new FormGroup({
      start: new FormControl<Date | null>(this.objetoFiltro.dataInicio, [Validators.required]),
      end: new FormControl<Date | null>(this.objetoFiltro.dataFim, [Validators.required]),
    });
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
    this.relServ.gerarRelContasReceber(this.objetoFiltro);
  }
}
