import { HttpClient, HttpParams } from '@angular/common/http';
import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import { MatSortModule } from '@angular/material/sort';
import {ApiServices} from "../services/api.services";

@Component({
  selector: 'app-comandas-fechadas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './comandas-fechadas.component.html',
  styleUrl: './comandas-fechadas.component.css'
})
export class ComandasFechadasComponent implements OnInit{
  dataSource!: MatTableDataSource<Pedido>;
  baseUrl: string = 'http://localhost:8080/';
  displayedColumns: string[] = ['nomeCliente', 'valorTotal', 'Acoes'];

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
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.http.get<Pedido[]>(this.baseUrl + "api/Pedido/RecuperPedidosFechados").subscribe(data => {
      this.dataSource = new MatTableDataSource<Pedido>();
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }, error => console.error(error));
  }

  visualizarPedido(pedido : Pedido){
    this.apiServices.setPedido(pedido);
    this.router.navigate(['/pedidoFechado']);
  }

}

class Pedido {
  id!: number;
  idPessoa!: number;
  idMesa!: number;
  idUsuario!: number;
  nomeCliente!: string;
  valorTotal!: number;
}
