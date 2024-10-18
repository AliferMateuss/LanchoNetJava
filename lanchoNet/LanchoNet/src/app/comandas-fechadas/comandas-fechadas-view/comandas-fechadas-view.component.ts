import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatNoDataRow,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {CurrencyPipe, NgIf} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ApiServices} from "../../services/api.services";
import {MatFabButton} from "@angular/material/button";

@Component({
  selector: 'app-comandas-fechadas-view',
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
  templateUrl: './comandas-fechadas-view.component.html',
  styleUrl: './comandas-fechadas-view.component.css'
})
export class ComandasFechadasViewComponent implements OnInit {
  pedido: any;
  itensPedido: any[] = [];
  dataSource = new MatTableDataSource(this.itensPedido);
  displayedColumns: string[] = ['produtoNome', 'precoUnitario', 'quantidade', 'subTotal'];
  constructor(private http: HttpClient, private service: ApiServices, private router: Router, private apiServices : ApiServices) {}

  ngOnInit(): void {
    this.pedido = this.service.getPedido();
    console.log(this.pedido)
    if (this.pedido.id) {
      this.carregarItensPedido(this.pedido.id);
    }
  }

  carregarItensPedido(idPedido: number) {
    this.http.post<any[]>(`http://localhost:8080/api/Pedido/RecuperarItensComanda`, this.pedido.id).subscribe(
      (data) => {
        this.itensPedido = data;
        this.dataSource.data = this.itensPedido;
      },
      (error) => {
        console.error('Erro ao carregar itens do pedido', error);
      }
    );
  }

  fechar(){
    this.apiServices.setAba(true);
    this.router.navigate(['/comandas']);
  }


  calculaSubTotal(): string{
    let total = this.itensPedido.reduce((total, item) => total + item.subTotal, 0);
    return this.formatarValorParaExibicao(total);
  }

  formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1] || '00';
    return `R$ ${parteInteira},${parteDecimal}`;
  }

}
