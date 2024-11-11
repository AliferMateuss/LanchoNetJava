import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavMenuComponent} from "./nav-menu/nav-menu.component";
import {MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent, MatTabGroup],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LanchoNet';

  constructor(private router : Router) {
  }
  ngOnInit() {
    this.router.navigate(['/login']);
  }
}
