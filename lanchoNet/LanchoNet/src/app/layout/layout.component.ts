import { Component, Renderer2, ElementRef } from '@angular/core';
import {NavMenuComponent} from "../nav-menu/nav-menu.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [
    NavMenuComponent,
    RouterOutlet
  ],
  standalone: true
})
export class LayoutComponent {
  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.renderer.removeClass(document.body, 'body-blue');
  }

}
