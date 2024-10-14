import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CdkDrag} from "@angular/cdk/drag-drop";
import {NgClass, NgIf, NgStyle} from "@angular/common";


@Component({
  selector: 'app-comanda',
  standalone: true,
  imports: [
    CdkDrag,
    NgClass,
    NgStyle,
    NgIf
  ],
  templateUrl: './comanda.component.html',
  styleUrl: './comanda.component.css'
})
export class ComandaComponent {
  @Input() comanda!: Comanda;
  @Output() toggleExpand = new EventEmitter();
  @Output() onDragStart = new EventEmitter();
  @Output() onDragEnd = new EventEmitter();

  toggle() {
    this.toggleExpand.emit();
  }

  dragStarted() {
    this.onDragStart.emit();
  }

  dragEnded() {
    this.onDragEnd.emit();
  }
}

class Comanda{
  id!: number;
  valorTotal!: number;
  nomeCliente!: string;
  expanded!: false;
  dragging!: false;
}
