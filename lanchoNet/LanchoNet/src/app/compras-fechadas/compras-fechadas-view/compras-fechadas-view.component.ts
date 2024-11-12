import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  selector: 'app-compras-fechadas-view',
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
    RouterLink,
    NgIf
  ],
  templateUrl: './compras-fechadas-view.component.html',
  styleUrl: './compras-fechadas-view.component.css'
})
export class ComprasFechadasViewComponent {
  compra: any;
  itensCompra: any[] = [];
  dataSource = new MatTableDataSource(this.itensCompra);
  displayedColumns: string[] = ['produtoNome', 'precoUnitario', 'quantidade', 'subTotal'];

  constructor(private http: HttpClient, private service: ApiServices, private router: Router, private apiServices : ApiServices) {}

  ngOnInit(): void {
    this.compra = this.service.getCompra();
    console.log(this.compra)
    if (this.compra.id) {
      this.carregarItensCompra(this.compra.id);
    }
  }

  carregarItensCompra(idCompra: number) {
    this.http.post<any[]>(`http://localhost:8080/api/Compra/RecuperarItensCompra`, this.compra.id).subscribe(
      (data) => {
        this.itensCompra = data;
        this.dataSource.data = this.itensCompra;
      },
      (error) => {
        console.error('Erro ao carregar itens da compra', error);
      }
    );
  }

  fechar() {
    this.router.navigate(['/compras']);
  }

  calculaSubTotal(): string {
    let total = this.itensCompra.reduce((total, item) => total + item.subTotal, 0);
    return this.formatarValorParaExibicao(total);
  }

formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    let parteDecimal = partes[1] || '00';


    if (parteDecimal.length === 1) {
        parteDecimal += '0';
    }

    return `R$ ${parteInteira},${parteDecimal}`;
}
}
