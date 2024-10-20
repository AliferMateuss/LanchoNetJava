import {ChangeDetectorRef, Component} from '@angular/core';
import {CdkDropList} from "@angular/cdk/drag-drop";
import {ComandaComponent} from "../comandas/comanda/comanda.component";
import {ComandasFechadasComponent} from "../comandas-fechadas/comandas-fechadas.component";
import {MatFabButton} from "@angular/material/button";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgForOf} from "@angular/common";
import {MovimentosCaixaComponent} from "./movimentos-caixa/movimentos-caixa.component";
import {ListaCaixaComponent} from "./lista-caixa/lista-caixa.component";
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {ApiServices} from "../services/api.services";

@Component({
  selector: 'app-caixa',
  standalone: true,
  imports: [
    CdkDropList,
    ComandaComponent,
    ComandasFechadasComponent,
    MatFabButton,
    MatTab,
    MatTabGroup,
    NgForOf,
    MovimentosCaixaComponent,
    ListaCaixaComponent,
    RouterLink
  ],
  templateUrl: './caixa.component.html',
  styleUrl: './caixa.component.css'
})
export class CaixaComponent {
  indiceTab: number = 0;
}
