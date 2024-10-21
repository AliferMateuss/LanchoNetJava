import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, ViewChild, OnInit } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";
import {NgxMaskDirective} from "ngx-mask";
import {NgSelectModule} from "@ng-select/ng-select";
@Component({
  selector: 'app-lista-pessoas',
  templateUrl: './lista-pessoas.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule, NgxMaskDirective, NgSelectModule],
  standalone: true,
  styleUrls: ['./lista-pessoas.component.css']
})
export class ListaPessoasComponent {
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  baseUrl: string = 'http://localhost:8080/';
  pessoa = new Pessoa();
  dataSource!: MatTableDataSource<Pessoa>;
  displayedColumns: string[] = ['nome', 'documento', 'tipoPessoa', 'Acoes'];
  tipos = new FormControl('');
  tiposPessoas: string[] = ['Cliente', 'Funcionário', 'Fornecedor'];
  ehFiltro = false;
  pagina = 1;


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
    return "";
  }

  ngOnInit() {
    this.carregarPessoas();
  }

  carregarPessoas() {

    this.http.get<any>(this.baseUrl + "api/Pessoas/RecuperarPessoas").subscribe(data => {
      this.dataSource = new MatTableDataSource<Pessoa>();
      this.length = data.length;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.paginator.page.subscribe(($event) => {
        this.carregarMaisPessoas($event);
      });
      this.dataSource.paginator = this.paginator;
    }, error => console.error(error));
  }

  formatarCpfCnpj(valor: string): string {
    const valorLimpo = valor.replace(/\D/g, '');
    if (valorLimpo.length === 11) {
      return valorLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valorLimpo.length === 14) {
      return valorLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
      return valor;
    }
  }

  montatipoPessoa(pessoa: Pessoa): string {
    var tipo: string[] = [];

    if (pessoa.cliente)
      tipo.push('Cliente');
    if (pessoa.fornecedor)
      tipo.push('Fornecedor');
    if (pessoa.funcionario)
      tipo.push('Funcionario');

    return tipo.join(' | ');
  }


  ngAfterViewInit() {
  }

  filtrar() {
    this.pagina = 1;
    this.ehFiltro = this.verificaFiltro();
    this.http.post<Pessoa[]>(this.baseUrl + "api/Pessoas/RecuperarPessoas", { dto: this.pessoa, pagina: 1, tamanhoPagina: 10 }).subscribe(data => {
      this.dataSource.data = data;
    }, error => console.error(error));
  }

  carregarMaisPessoas(event: PageEvent) {
    let request;
    const pagina = event.pageIndex + 1;
    if (this.ehFiltro) {
      request = this.http.post<Pessoa[]>(this.baseUrl + "api/Pessoas/RecuperaPessoaPorFiltro", { dto: this.pessoa, pagina, tamanhoPagina: 10 });
    } else {
      const params = new HttpParams()
        .set('pagina', pagina.toString())
        .set('tamanhoPagina', '10');
      request = this.http.get<Pessoa[]>(this.baseUrl + "api/Pessoas/RecuperarPessoas", { params });
    }

    request.subscribe(
      data => {
        this.dataSource.data.push(...data);
      },
      error => {
        console.error(error);
      }
    );
  }

  excluirPessoa(id: number) {
    this.http.post(this.baseUrl + "api/Pessoas/Deletar", id).subscribe(data => {
      this.carregarPessoas();

    }, error => console.error(error));
  }

  verificaFiltro(): boolean {
    if (this.pessoa.nome !== null || this.pessoa.nome !== '')
      return false;

    if (this.pessoa.documento !== null || this.pessoa.documento !== '')
      return false;

    if (this.pessoa.cliente)
      return false;

    if (this.pessoa.funcionario)
      return false;

    if (this.pessoa.fornecedor)
      return false;

    return true;
  }



  pageChangeEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarPessoas();
  }

}


class Pessoa {
  id?: number;
  nome?: string;
  documento?: string;
  cliente?: boolean;
  fornecedor?: boolean;
  funcionario?: boolean;
}

