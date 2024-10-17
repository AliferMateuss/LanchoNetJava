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
import {EditarItemPedidoComponent} from './modais/editar-item-pedido/editar-item-pedido.component';
import {ModalComponent} from "../../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import {AdicionarItemPedidoComponent} from "./modais/adicionar-item-pedido/adicionar-item-pedido.component";
import {FecharPedidoComponent} from "./modais/fechar-pedido/fechar-pedido.component";


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
  @Output() carregaComandas = new EventEmitter<void>();
  dataSource = new MatTableDataSource<ItensComanda>();
  displayedColumns: string[] = ['Produto', 'Quantidade', 'Acoes'];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private dialog: MatDialog) {
  }

  toggle() {
    if (this.comanda.expanded) {
      this.limpaItens();
    } else {
      this.carregaItens();
    }
    this.toggleExpand.emit();
  }

  dragStarted($event: any) {
    this.onDragStart.emit($event);
  }

  dragEnded($event: any) {
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

  fecharComanda(){
    const dialogRef = this.dialog.open(FecharPedidoComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: this.comanda
    });
  }

  excluirComanda() {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: {titulo: "Atenção!", mensagem: "Deseja prosseguir com a exclusão?", botao: "Sim", erro: false}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.http.post(`http://localhost:8080/api/Pedido/Excluir`, this.comanda.id).subscribe(
        data => {
          this.carregaComandas.emit();
        },
        error => {
          console.error("Erro ao excluir comanda", error.message);
        }
      );
    })
  }

  editarItem(item: ItensComanda): void {
    item.idPedido = this.comanda.id;
    const dialogRef = this.dialog.open(EditarItemPedidoComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(() => {
      this.carregaItens();
    })
  }


  excluirItem(item: ItensComanda): void {
    item.idPedido = this.comanda.id;
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: {titulo: "Atenção!", mensagem: "Deseja prosseguir com a exclusão?", botao: "Sim", erro: false}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.http.post('http://localhost:8080/api/Pedido/ExcluiItemPedido', {
        id: item.id,
        idPedido: item.idPedido
      }).subscribe(
        data => {
          this.carregaItens();
        },
        error => {
          console.error("Erro ao excluir item:", error.message);
        }
      );
    })
  }

  adicionarItem(): void {
    const dialogRef = this.dialog.open(AdicionarItemPedidoComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: this.comanda.id
    });

    dialogRef.afterClosed().subscribe(() => {
      this.carregaItens();
    })

  }
}

class Comanda {
  id!: number;
  idPessoa!: number;
  idMesa!: number;
  idUsuario!: number;
  valorTotal!: number;
  nomeCliente!: string;
  expanded: boolean = false;
  dragging: boolean = false;
  itens: ItensComanda[] = [];
}

class ItensComanda {
  id!: number;
  subTotal!: number;
  precoUnitario!: number;
  quantidade!: number;
  produtoNome!: string;
  produtoId!: number;
  idPedido!: number;
}


