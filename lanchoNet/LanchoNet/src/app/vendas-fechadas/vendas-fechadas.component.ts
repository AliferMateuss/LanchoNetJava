import { HttpClient } from '@angular/common/http';
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import { MatSortModule } from '@angular/material/sort';
import { ApiServices } from "../services/api.services";
@Component({
  selector: 'app-vendas-fechadas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './vendas-fechadas.component.html',
  styleUrl: './vendas-fechadas.component.css'
})
export class VendasFechadasComponent {
  dataSource!: MatTableDataSource<Venda>;
  baseUrl: string = 'http://localhost:8080/';
  displayedColumns: string[] = ['nomeCliente', 'valorTotal', 'Acoes'];

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef, private apiServices: ApiServices) {}

  ngOnInit() {
    this.carregarVendas();
  }

  carregarVendas() {
    this.http.get<Venda[]>(this.baseUrl + "api/Venda/RecuperarVendasFechadas").subscribe(data => {
      this.dataSource = new MatTableDataSource<Venda>();
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }, error => console.error(error));
  }

  visualizarVenda(venda : Venda) {
    this.apiServices.setVenda(venda);
    this.router.navigate(['/vendaFechada']);
  }
}

class Venda {
  id!: number;
  idPessoa!: number;
  idUsuario!: number;
  nomeCliente!: string;
  valorTotal!: number;
}
