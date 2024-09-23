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
import {RouterModule} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";

@Component({
  selector: 'app-comandas',
  templateUrl: './comandas.component.html',
  imports: [CommonModule, FormsModule , ReactiveFormsModule, DragDropModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule],
  standalone: true,
  styleUrls: ['./comandas.component.css']
})
export class ComandasComponent implements OnInit {
  baseUrl: string = 'http://localhost:8080/';
  columns = [
    { title: 'Coluna 1', items: [{ title: 'Comanda 1', details: 'Detalhes da Comanda 1', expanded: false, dragging: false }, { title: 'Comanda 2', details: 'Detalhes da Comanda 2', expanded: false, dragging: false }, { title: 'Comanda 3', details: 'Detalhes da Comanda 3', expanded: false, dragging: false }] },
    { title: 'Coluna 2', items: [{ title: 'Comanda 4', details: 'Detalhes da Comanda 4', expanded: false, dragging: false }, { title: 'Comanda 5', details: 'Detalhes da Comanda 5', expanded: false, dragging: false }] },
    { title: 'Coluna 3', items: [{ title: 'Comanda 6', details: 'Detalhes da Comanda 6', expanded: false, dragging: false }, { title: 'Comanda 7', details: 'Detalhes da Comanda 7', expanded: false, dragging: false }] },
    { title: 'Coluna 4', items: [{ title: 'Comanda 8', details: 'Detalhes da Comanda 8', expanded: false, dragging: false }, { title: 'Comanda 9', details: 'Detalhes da Comanda 9', expanded: false, dragging: false }] }
  ];

  connectedDropLists: string[] = [];

  ngOnInit() {
    this.connectedDropLists = this.columns.map((_, index) => `cdk-drop-list-${index}`);
  }

  drop(event: CdkDragDrop<{ title: string; details: string; expanded: boolean; dragging: boolean }[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // Reset dragging state after drop
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
