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

@Component({
  selector: 'app-rel-pessoa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDatepickerToggle,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatCheckbox
  ],
  templateUrl: './rel-pessoa.component.html',
  styleUrl: './rel-pessoa.component.css'
})
export class RelPessoaComponent implements OnInit {

  objetoFiltro = new objetoFiltro();
  range!: FormGroup;

  constructor(private relServ: RelServices, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.objetoFiltro.dataFim = new Date();
    this.objetoFiltro.dataInicio = new Date();
    this.range = new FormGroup({
      start: new FormControl<Date | null>(this.objetoFiltro.dataInicio, [Validators.required]),
      end: new FormControl<Date | null>(this.objetoFiltro.dataFim, [Validators.required]),
    });
    this.cdr.detectChanges();
  }

  geraRel() {
    this.relServ.gerarRelPessoas(this.objetoFiltro);
  }
}
