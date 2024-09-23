import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";

@Component({
  selector: 'app-counter-component',
  templateUrl: './counter.component.html',
  imports: [CommonModule, FormsModule , ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule ],
  standalone: true,
})
export class CounterComponent {
  public currentCount = 0;

  public incrementCounter() {
    this.currentCount++;
  }
}
