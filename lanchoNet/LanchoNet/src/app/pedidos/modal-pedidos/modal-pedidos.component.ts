import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {PedidosComponent} from "../pedidos/pedidos.component";

@Component({
  selector: 'app-modal-pedidos',
  standalone: true,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    PedidosComponent
  ],
  templateUrl: './modal-pedidos.component.html',
  styleUrl: './modal-pedidos.component.css'
})
export class ModalPedidosComponent {

  constructor(public dialogRef: MatDialogRef<ModalPedidosComponent>) {
    this.dialogRef.updateSize('100%', '80%');
  }

  fecharModal() {
    this.dialogRef.close();
  }

}
