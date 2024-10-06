import {ChangeDetectorRef, Component, Inject, ViewChild, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {DatePipe} from "@angular/common";
import {MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTable, MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {HttpClient} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-contas-pagar',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyMaskModule,
    DatePipe,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow
  ],
  templateUrl: './contas-pagar.component.html',
  styleUrl: './contas-pagar.component.css'
})
export class ContasPagarComponent implements OnInit {
  public contaAPagar!: any;
  public contasAPagar: ContasAReceber[] = [];
  dataSource = new MatTableDataSource<ContasAReceber>(this.contasAPagar);
  displayedColumns: string[] = ['VendaId', 'Cliente', 'DataCompetencia', 'DataVencimento', 'DataConta', 'Parcela', 'Valor', 'Botoes'];
  clienteSelececionado: string = "";
  produtoSelecionado: string = "";
  valorAbate!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("modalBaixa") modalBaixa!: any;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.buscaTodasContas();
  }

  buscaTodasContas() {
    this.http.get<ContasAReceber[]>(this.baseUrl + 'api/Contas/RecuperarContasPagar').subscribe(data => {
      this.contasAPagar = data;
      this.dataSource = new MatTableDataSource<ContasAReceber>(this.contasAPagar);
    }, error => console.error(error));
  }

  baixaParcial(conta: ContasAReceber) {
    this.contaAPagar = {} as ContasAReceber;
    this.contaAPagar = conta;

    this.modalService.open(this.modalBaixa, { centered: true });
  }

  baixaTotal(conta: ContasAReceber) {
    this.contaAPagar = {} as ContasAReceber;
    this.contaAPagar = conta;
    this.valorAbate = this.contaAPagar.valor;
    this.modalService.open(this.modalBaixa, { centered: true });
  }
  baixa() {
    this.http.post<any[]>(this.baseUrl + 'api/Contas/BaixarContasAPagar', this.contaAPagar).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  excluir(id: number) {
    this.http.post<any[]>(this.baseUrl + 'api/Contas/DeletarContaAPagar', id).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  abaterValor() {
    if (this.contaAPagar.valor < this.valorAbate) {
      console.log("valor baixo")
    } else {
      this.contaAPagar.valor -= Number(this.valorAbate);
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
