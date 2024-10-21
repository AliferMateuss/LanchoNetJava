import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate
} from "@angular/material/datepicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RelServices, objetoFiltro } from "../../services/relatorio.services";
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatCheckbox} from "@angular/material/checkbox";
import {Select2Module} from "ng-select2-component";

@Component({
  selector: 'app-rel-pedido',
  standalone: true,
  imports: [
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatFormField,
    MatLabel,
    MatStartDate,
    MatSuffix,
    Select2Module
  ],
  templateUrl: './rel-pedido.component.html',
  styleUrl: './rel-pedido.component.css'
})
export class RelPedidoComponent implements OnInit{

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
    this.relServ.gerarRelPedidos(this.objetoFiltro);
  }
}
