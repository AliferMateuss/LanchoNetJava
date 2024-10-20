import { HttpClient, HttpParams } from '@angular/common/http';
import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import { MatSortModule } from '@angular/material/sort';
import {ApiServices} from "../../services/api.services";

@Component({
  selector: 'app-lista-credito-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './lista-credito-cliente.component.html',
  styleUrl: './lista-credito-cliente.component.css'
})
export class ListaCreditoClienteComponent {
  dataSource!: MatTableDataSource<CreditoCliente>;
  baseUrl: string = 'http://localhost:8080/';
  displayedColumns: string[] = ['nome', 'valorTotal', 'Acoes'];

  @ViewChild('paginator') paginator!: MatPaginator;
  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef, private matPaginatorIntl: MatPaginatorIntl, private apiServices: ApiServices) {
    this.matPaginatorIntl.itemsPerPageLabel = 'Itens por página:';
    this.matPaginatorIntl.nextPageLabel = 'Próxima página';
    this.matPaginatorIntl.previousPageLabel = 'Página anterior';
    this.matPaginatorIntl.firstPageLabel = 'Primeira página';
    this.matPaginatorIntl.lastPageLabel = 'Última página';
    this.matPaginatorIntl.getRangeLabel = this.rangeLabel.bind(this);
  }

  rangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }

  ngOnInit() {
    this.carregarCreditosClientes();
  }

  carregarCreditosClientes() {
    this.http.get<CreditoCliente[]>(this.baseUrl + "api/CreditoCliente/RecuperaCreditos").subscribe(data => {
      this.dataSource = new MatTableDataSource<CreditoCliente>();
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }, error => console.error(error));
  }

  visualizarCredito(credito : CreditoCliente){
    this.apiServices.setCredito(credito);
    this.router.navigate(['/creditoCliente']);
  }

}

class CreditoCliente {
  idCliente!: number;
  nome!: string;
  idCredito!: number;
  valorTotal!: string;
}
