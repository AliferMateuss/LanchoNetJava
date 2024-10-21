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

@Component({
  selector: 'app-rel-usuario',
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
  templateUrl: './rel-usuario.component.html',
  styleUrl: './rel-usuario.component.css'
})
export class RelUsuarioComponent implements OnInit {
  baseUrl: string = 'http://localhost:8080/';
  objetoFiltro = new objetoFiltro();
  range!: FormGroup;
  grupoUsuario: any[] | null = null;

  constructor(private relServ: RelServices, private cdr: ChangeDetectorRef, private http: HttpClient) {
  }

  ngOnInit() {
    this. carregargrupoUsuario()
    this.cdr.detectChanges();
  }

  carregargrupoUsuario() {
    this.http.get<any[]>(this.baseUrl + 'api/GrupoUsuario/RecuperarGrupoUsuarios').subscribe(data => {
      this.grupoUsuario = data;
      this.cdr.detectChanges();
    }, error => console.error(error));
  }

  geraRel() {
    this.relServ.gerarRelUsuarios(this.objetoFiltro);
  }
}
