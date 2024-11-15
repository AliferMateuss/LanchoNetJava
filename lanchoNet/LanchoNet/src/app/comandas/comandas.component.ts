import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
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
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
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
import {ComandasFechadasComponent} from "../comandas-fechadas/comandas-fechadas.component";
import {inflate} from "node:zlib";
import {ApiServices} from "../services/api.services";

@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule, ComandaComponent, MatTabGroup, MatTab, MatFabButton, ComandasFechadasComponent],
  standalone: true,
  styleUrls: ['./comandas.component.css']
})
export class ComandasComponent implements OnInit {
  baseUrl: string = 'http://localhost:8080/';
  indiceTab: number = 0;
  columns: { title: string; items: Comanda[] }[] = [
    { title: 'Coluna 1', items: [] },
    { title: 'Coluna 2', items: [] },
    { title: 'Coluna 3', items: [] },
    { title: 'Coluna 4', items: [] }
  ];


  connectedDropLists: string[] = [];
  constructor(private dialog: MatDialog, private http: HttpClient, private router: Router,
              private cdr: ChangeDetectorRef, private route:ActivatedRoute, private apiService: ApiServices) {

  }

  ngOnInit() {
    this.carregaComandas();
    if(this.apiService.getAba()){
      this.indiceTab = 1;
    }
  }

  carregaComandas() {
    this.http.get<any[]>(this.baseUrl + 'api/Pedido/RecuperPedidosAbertos').subscribe(data => {
      this.limpaColumns();
      this.distribuiComandas(data);
      this.connectedDropLists = this.columns.map((_, index) => `cdk-drop-list-${index}`);
      this.cdr.detectChanges();
    }, error => this.openDialogError("Erro: ", error.error.message, "Voltar", true));
  }

  distribuiComandas(comandas: any[]) {
    let columnIndex = 0;

    comandas.forEach((comanda, index) => {
      const newComanda = new Comanda();
      newComanda.id = comanda.id;
      newComanda.nomeCliente = comanda.nomeCliente;
      newComanda.valorTotal = comanda.valorTotal;
      newComanda.idMesa = comanda.idMesa;
      newComanda.idPessoa = comanda.idPessoa;
      newComanda.idUsuario = comanda.idUsuario;
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

    dialogRef.afterClosed().subscribe(() => {
      this.carregaComandas();
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

  toggleExpand(comanda: Comanda) {
    if(comanda.expanded){
      //fecha
      comanda.expanded = false;
    } else {
      //abre
      this.columns.forEach(column => {
        column.items.forEach(comanda => {
          comanda.expanded = false;
        });
      });
      comanda.expanded = true;
    }
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

  private limpaColumns(){
    this.columns = [
      { title: 'Coluna 1', items: [] },
      { title: 'Coluna 2', items: [] },
      { title: 'Coluna 3', items: [] },
      { title: 'Coluna 4', items: [] }
    ];
  }
}

class Comanda{
  id!: number;
  idPessoa!: number;
  idMesa!: number;
  idUsuario!: number;
  valorTotal!: number;
  nomeCliente!: string;
  expanded:boolean = false;
  dragging:boolean =  false;
  itens: any[] = [];
}
