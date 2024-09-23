import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatDialogModule, MatButton],
  standalone: true,
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  constructor(public dialogRef: MatDialogRef<ModalComponent>, @Inject(MAT_DIALOG_DATA) public data: Data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

class Data {
  titulo!: string;
  mensagem!: string;
  botao!: string;
  erro!: boolean;
}
