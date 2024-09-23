import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTableModule ],
  standalone: true,
})
export class HomeComponent {
}
