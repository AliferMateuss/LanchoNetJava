import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";

@Component({
  selector: 'app-lista-mesas',
  templateUrl: './lista-mesas.component.html',
  imports: [CommonModule, FormsModule , ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule ],
  standalone: true,
  styleUrls: ['./lista-mesas.component.css']
})
export class ListaMesasComponent {
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  baseUrl: string = 'http://localhost:8080/';
  dataSource!: MatTableDataSource<Mesa>;
  displayedColumns: string[] = ['numero', 'capacidade', 'acoes'];

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
    this.carregarMesas();
  }

  carregarMesas() {
    this.http.get<any>(this.baseUrl + "api/Mesa/RecuperarMesas").subscribe(data => {
      this.dataSource = new MatTableDataSource<Mesa>();
      this.length = data.length;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }, error => console.error(error));
  }

  excluirMesa(id: number) {
    this.http.post(this.baseUrl + "api/Mesa/Deletar", id).subscribe(data => {
      this.carregarMesas();
    }, error => console.error(error));
  }

  pageChangeEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarMesas();
  }
};

class Mesa {
  id!: number;
  numero!: number;
  capacidade!: number
}
