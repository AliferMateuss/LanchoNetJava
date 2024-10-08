import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatCell, MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {DatePipe, NgIf} from "@angular/common";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-contas-areceber',
  templateUrl: './contas-areceber.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyMaskModule,
    DatePipe,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    MatHeaderCellDef,
    MatCellDef,
    NgIf,
    MatColumnDef,
    MatPaginator,
    MatSort,
    MatSortHeader,
    RouterLink
  ],
  styleUrls: ['./contas-areceber.component.css']
})
export class ContasAReceberComponent {
  public contaAReceber!: any;
  public contasAReceber: ContasAReceber[] = [];
  dataSource = new MatTableDataSource<ContasAReceber>(this.contasAReceber);
  displayedColumns: string[] = ['VendaId', 'Cliente', 'DataCompetencia', 'DataVencimento', 'DataConta', 'Parcela', 'Valor', 'Botoes'];
  clienteSelececionado: string = "";
  produtoSelecionado: string = "";
  valorAbate!: number;
  baseUrl: string = 'http://localhost:8080/';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("modalBaixa") modalBaixa!: any;

  constructor(private http: HttpClient, private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.buscaTodasContas();
  }

  buscaTodasContas() {
    this.http.get<ContasAReceber[]>(this.baseUrl + 'api/Contas/RecuperarContasReceber').subscribe(data => {
      this.contasAReceber = data;
      this.dataSource = new MatTableDataSource<ContasAReceber>(this.contasAReceber);
    }, error => console.error(error));
  }

  baixaParcial(conta: ContasAReceber) {
    this.contaAReceber = {} as ContasAReceber;
    this.contaAReceber = conta;

    this.modalService.open(this.modalBaixa, { centered: true });
  }

  baixaTotal(conta: ContasAReceber) {
    this.contaAReceber = {} as ContasAReceber;
    this.contaAReceber = conta;
    this.valorAbate = this.contaAReceber.valor;
    this.modalService.open(this.modalBaixa, { centered: true });
  }

  baixa() {
    this.http.post<any[]>(this.baseUrl + 'api/Contas/BaixarContasAReceber', this.contaAReceber).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  excluir(id: number) {
    this.http.post<any[]>(this.baseUrl + 'api/Contas/DeletarContaReceber', id).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  abaterValor() {
    if (this.contaAReceber.valor < this.valorAbate) {
      console.log("valor baixo")
    } else {
      this.contaAReceber.valor -= Number(this.valorAbate);
    }
  }

  formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1] || '00';
    return `R$ ${parteInteira},${parteDecimal}`;
  }

  reload() {
    this.modalService.dismissAll();
    this.buscaTodasContas();
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
  }
}

interface ContasAReceber {
  id: number;
  vendaId: number;
  dataCompetencia: Date;
  dataVencimento: Date;
  dataConta: Date;
  parcela: number;
  valor: number;
  status: string;
  clienteNome: string;
  clienteId: number;
}
