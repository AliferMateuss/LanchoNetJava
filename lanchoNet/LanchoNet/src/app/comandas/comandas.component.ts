import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ComandaComponent} from "./comanda/comanda.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatFabButton} from "@angular/material/button";
import {ModalComponent} from "../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import {ModalPedidosComponent} from "../pedidos/modal-pedidos/modal-pedidos.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule, ComandaComponent, MatTabGroup, MatTab, MatFabButton],
  standalone: true,
  styleUrls: ['./comandas.component.css']
})
export class ComandasComponent implements OnInit {
  baseUrl: string = 'http://localhost:8080/';
  columns: { title: string; items: Comanda[] }[] = [
    { title: 'Coluna 1', items: [] },
    { title: 'Coluna 2', items: [] },
    { title: 'Coluna 3', items: [] },
    { title: 'Coluna 4', items: [] }
  ];

  connectedDropLists: string[] = [];
  constructor(private dialog: MatDialog, private http: HttpClient, private router: Router) {

  }

  ngOnInit() {
    this.carregaComandas();
  }

  carregaComandas() {
    this.http.get<any[]>(this.baseUrl + 'api/Pedido/RecuperPedidosAbertos').subscribe(data => {
      this.distribuiComandas(data);
      this.connectedDropLists = this.columns.map((_, index) => `cdk-drop-list-${index}`);
    }, error => this.openDialogError("Erro: ", error, "Voltar", true));
  }

  distribuiComandas(comandas: any[]) {
    let columnIndex = 0;

    comandas.forEach((comanda, index) => {
      const newComanda = new Comanda();
      newComanda.id = comanda.id;
      newComanda.nomeCliente = comanda.nomeCliente;
      newComanda.valorTotal = comanda.valorTotal;
      newComanda.dragging = false;
      newComanda.expanded = false
      this.columns[columnIndex].items.push(newComanda);
      columnIndex = (columnIndex + 1) % this.columns.length;
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(ModalPedidosComponent, {
      panelClass: 'modalPedidos',
      hasBackdrop: true,
      maxHeight: 1000,
      maxWidth: 1000
    });
  }

  openDialogError(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: {titulo: titulo, mensagem: mensagem, botao: botao, erro: erro}
    });
  }


  drop(event: CdkDragDrop<Comanda[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    this.resetDraggingState();
  }

  onDragStarted(event: CdkDragStart) {
    this.setDraggingState(event, true);
  }

  onDragEnded(event: CdkDragEnd) {
    this.setDraggingState(event, false);
  }

  toggleExpand(item: any) {
    item.expanded = !item.expanded;
  }

  private setDraggingState(event: CdkDragStart | CdkDragEnd, dragging: boolean) {
    const item = (event as CdkDragStart).source.data;
    if (item) {
      item.dragging = dragging;
    }
  }

  private resetDraggingState() {
    this.columns.forEach(column => {
      column.items.forEach(item => {
        item.dragging = false;
      });
    });
  }
}

class Comanda{
  id!: number;
  valorTotal!: number;
  nomeCliente!: string;
  expanded!: false;
  dragging!: false;
}
