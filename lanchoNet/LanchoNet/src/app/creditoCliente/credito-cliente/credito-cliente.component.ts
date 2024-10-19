import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { ApiServices } from '../../services/api.services';
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
@Component({
  selector: 'app-credito-cliente',
  standalone: true,
  imports: [
    NgIf,
    CurrencyPipe,
    MatTable,
    MatTab,
    MatTabGroup,
    MatHeaderCell,
    MatCell,
    DatePipe,
    MatPaginator,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatNoDataRow,
    MatSort
  ],
  templateUrl: './credito-cliente.component.html',
  styleUrl: './credito-cliente.component.css'
})
export class CreditoClienteComponent {
  creditoCliente: any;
  movimentosCredito: any[] = [];
  pagamentosCredito: any[] = [];
  dataSourceMovimentos = new MatTableDataSource(this.movimentosCredito);
  dataSourcePagamentos = new MatTableDataSource(this.pagamentosCredito);

  displayedColumnsMovimento: string[] = ['dataMovimento', 'valor', 'tipoPagamento', 'vendaId'];
  displayedColumnsPagamento: string[] = ['dataMovimento', 'valor', 'tipoPagamento'];

  constructor(private http: HttpClient, private service: ApiServices, private router: Router) {}

  ngOnInit(): void {
    this.creditoCliente = this.service.getCredito();
    if (this.creditoCliente.idCliente) {
      this.carregarMovimentosCredito(this.creditoCliente.id);
      this.carregarPagamentosCredito(this.creditoCliente.id);
    }
  }

  carregarMovimentosCredito(id: number) {
    this.http.post<any[]>(`http://localhost:8080/api/CreditoCliente/RetornaMovimentosPorId`, id).subscribe(
      (data) => {
        this.movimentosCredito = data;
        this.dataSourceMovimentos.data = this.movimentosCredito;
      },
      (error) => {
        console.error('Erro ao carregar movimentos de crédito', error);
      }
    );
  }

  carregarPagamentosCredito(id: number) {
    this.http.post<any[]>(`http://localhost:8080/api/CreditoCliente/RetornaPagamentosPorId`, id).subscribe(
      (data) => {
        this.pagamentosCredito = data;
        this.dataSourcePagamentos.data = this.pagamentosCredito;
      },
      (error) => {
        console.error('Erro ao carregar pagamentos de crédito', error);
      }
    );
  }

  fechar() {
    this.router.navigate(['/listaCreditoCliente']);
  }
}
