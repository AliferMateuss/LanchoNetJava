import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  imports: [CommonModule, FormsModule , ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule ],
  standalone: true,
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent {
  baseUrl: string = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  relatorioVenda() {
    this.http.get(this.baseUrl + 'api/Relatorio/RelatorioVenda', {
      responseType: 'blob',
    }).subscribe(data => {
      this.exibirPDF(data);
    }, error => {
      console.error('Erro ao baixar o relatório de venda: ', error);
    });
  }

  exibirPDF(blobData: Blob) {
    const blob = new Blob([blobData], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
