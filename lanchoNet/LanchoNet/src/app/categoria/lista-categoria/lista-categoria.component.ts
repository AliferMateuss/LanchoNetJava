import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, ViewChild, OnInit } from '@angular/core';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";

@Component({
  selector: 'app-lista-categoria',
  templateUrl: './lista-categoria.component.html',
  imports: [CommonModule, FormsModule , ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule ],
  standalone: true,
  styleUrls: ['./lista-categoria.component.css']
})
export class ListaCategoriasComponent {
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  baseUrl: string = 'http://localhost:8080/';
  dataSource!: MatTableDataSource<Categoria>;
  displayedColumns: string[] = ['nome', 'acoes'];

  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private matPaginatorIntl: MatPaginatorIntl) {
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
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.http.get<any>(this.baseUrl + "api/Categoria/RecuperarCategorias").subscribe(data => {
      this.dataSource = new MatTableDataSource<Categoria>();
      this.length = data.length;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }, error => console.error(error));
  }

  excluirCategoria(id: number) {
    this.http.post(this.baseUrl + "api/Categoria/Deletar", id).subscribe(data => {
      this.carregarCategorias();
    }, error => console.error(error));
  }

  pageChangeEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarCategorias();
  }
}

class Categoria {
  id!: number;
  nome!: string;
}
