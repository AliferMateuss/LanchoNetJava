import {Component, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {CdkDrag} from "@angular/cdk/drag-drop";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";


@Component({
  selector: 'app-comanda',
  standalone: true,
  imports: [
    CdkDrag,
    NgClass,
    NgStyle,
    NgIf,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatNoDataRow,
    MatHeaderCellDef
  ],
  templateUrl: './comanda.component.html',
  styleUrl: './comanda.component.css'
})
export class ComandaComponent {
  @Input() comanda!: Comanda;
  @Output() toggleExpand = new EventEmitter();
  @Output() onDragStart = new EventEmitter();
  @Output() onDragEnd = new EventEmitter();
  dataSource = new MatTableDataSource<ItensComanda>();
  displayedColumns: string[] = ['Produto', 'Quantidade', 'Acoes'];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  toggle() {
    if (this.comanda.expanded) {
      this.limpaItens();
    } else {
      this.carregaItens();
    }
    this.toggleExpand.emit();
  }
  dragStarted($event:any) {
    this.onDragStart.emit($event);
  }

  dragEnded($event:any) {
    this.onDragEnd.emit($event);
  }

  carregaItens() {
    this.http.post<ItensComanda[]>(`http://localhost:8080/api/Pedido/RecuperarItensComanda`, this.comanda.id).subscribe(
      data => {
        this.comanda.itens = data;
        this.dataSource.data = this.comanda.itens;
        this.cdr.detectChanges();
      },
      error => {
        console.error("Erro ao carregar itens da comanda:", error);
      }
    );
  }

  limpaItens() {
    this.comanda.itens = [];
  }

  formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1] || '00';
    return `R$ ${parteInteira},${parteDecimal}`;
  }

}

class Comanda{
  id!: number;
  valorTotal!: number;
  nomeCliente!: string;
  expanded:boolean =  false;
  dragging:boolean =  false;
  itens: ItensComanda[] = [];
}

class ItensComanda{
  id!: number;
  subTotal!: number;
  precoUnitario!: number;
  quantidade!: number;
  produtoNome!: string;
  produtoId!: number;
}


