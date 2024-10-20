import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, ViewChild, OnInit } from '@angular/core';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";
import {ApiServices} from "../../services/api.services";

@Component({
  selector: 'app-lista-caixa',
  standalone: true,
  imports: [CommonModule, FormsModule , ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule ],
  templateUrl: './lista-caixa.component.html',
  styleUrl: './lista-caixa.component.css'
})
export class ListaCaixaComponent {
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  baseUrl: string = 'http://localhost:8080/';
  dataSource!: MatTableDataSource<Caixa>;
  displayedColumns: string[] = ['dataAbertura', 'dataFechamento', 'valorInicial', 'valorTotal', 'status', 'acoes'];

  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private matPaginatorIntl: MatPaginatorIntl,
              private service: ApiServices, private router: Router) {
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
    this.carregarCaixas();
  }

  carregarCaixas() {
    this.http.get<any>(this.baseUrl + "api/Caixa/RecuperarCaixas").subscribe(data => {
      this.dataSource = new MatTableDataSource<Caixa>();
      this.length = data.length;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }, error => console.error(error));
  }

  visualizarCaixa(caixa: Caixa){
    this.service.setCaixa(caixa);
    this.router.navigate(['/../cadastroCaixa'])
  }

  excluirCaixa(id: number) {
    this.http.post(this.baseUrl + "api/Caixa/Deletar", id).subscribe(data => {
      this.carregarCaixas();
    }, error => console.error(error));
  }

  pageChangeEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarCaixas();
  }
}

class Caixa {
  id!: number;
  dataAbertura!: Date;
  dataFechamento!: Date;
  valorTotal!: number;
  valorInicial!: number;
  status!: string;
}
