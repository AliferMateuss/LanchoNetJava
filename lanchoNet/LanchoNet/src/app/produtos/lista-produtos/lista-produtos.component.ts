import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  imports: [CommonModule, FormsModule , ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule ],
  standalone: true,
  styleUrls: ['./lista-produtos.component.css']
})
export class ListaProdutosComponent {
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  baseUrl: string = 'http://localhost:8080/';
  dataSource!: MatTableDataSource<Produtos>;
  displayedColumns: string[] = ['nome', 'quantidade', 'preco', 'precoCompra', 'Acoes'];

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
    this.carregarProdutos();
  }

  carregarProdutos() {

    this.http.get<any>(this.baseUrl + "api/Produto/RecuperarProdutos").subscribe(data => {
      this.dataSource = new MatTableDataSource<Produtos>();
      this.length = data.length;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }, error => console.error(error));
  }

  excluirProduto(id: number) {
    this.http.post(this.baseUrl + "api/Produto/Deletar", id).subscribe(data => {
      this.carregarProdutos();

    }, error => console.error(error));
  }

  formatReal(value: number): string {
    if (isNaN(value)) {
      return '';
    }

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  pageChangeEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarProdutos();
  }

}


class Produtos {
  id: number | null = null;
  nome: string | null = null;
  quantidade: number | null = null;
  preco: number | null = null;
  precoCompra: number | null = null;
  imagem: string | null = null;
}
