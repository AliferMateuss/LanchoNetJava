import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatNoDataRow,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { CurrencyPipe, NgIf } from "@angular/common";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ApiServices } from "../../services/api.services";
import { MatFabButton } from "@angular/material/button";

@Component({
  selector: 'app-vendas-fechadas-view',
  standalone: true,
  imports: [
    MatTable,
    CurrencyPipe,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatNoDataRow,
    MatPaginator,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatSort,
    MatFabButton,
    NgIf
  ],
  templateUrl: './vendas-fechadas-view.component.html',
  styleUrl: './vendas-fechadas-view.component.css'
})
export class VendasFechadasViewComponent {
  venda: any;
  itensVenda: any[] = [];
  dataSource = new MatTableDataSource(this.itensVenda);
  displayedColumns: string[] = ['produtoNome', 'precoUnitario', 'quantidade', 'subTotal'];

  constructor(private http: HttpClient, private service: ApiServices, private router: Router) {}

  ngOnInit(): void {
    this.venda = this.service.getVenda();
    console.log(this.venda);
    if (this.venda.id) {
      this.carregarItensVenda(this.venda.id);
    }
  }

  carregarItensVenda(idVenda: number) {
    this.http.post<any[]>(`http://localhost:8080/api/Venda/RecuperarItensVenda`, this.venda.id).subscribe(
      (data) => {
        this.itensVenda = data;
        this.dataSource.data = this.itensVenda;
      },
      (error) => {
        console.error('Erro ao carregar itens da venda', error);
      }
    );
  }

  fechar() {
    this.router.navigate(['/vendas']);
  }

  calculaSubTotal(): string {
    let total = this.itensVenda.reduce((total, item) => total + item.subTotal, 0);
    return this.formatarValorParaExibicao(total);
  }

  formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1] || '00';
    return `R$ ${parteInteira},${parteDecimal}`;
  }
}
