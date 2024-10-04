import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contas-areceber',
  templateUrl: './contas-areceber.component.html',
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("modalBaixa") modalBaixa!: any;

  ngOnInit() {
    this.BuscaTodasContas();
  }

  BuscaTodasContas() {
    this.http.get<ContasAReceber[]>(this.baseUrl + 'api/ContasAReceber/BuscaTodos').subscribe(data => {
      this.contasAReceber = data;
      this.dataSource = new MatTableDataSource<ContasAReceber>(this.contasAReceber);
    }, error => console.error(error));
  }

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private modalService: NgbModal, private cdr: ChangeDetectorRef) { }

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
    this.http.post<any[]>(this.baseUrl + 'api/ContasAReceber/Baixa', this.contaAReceber).subscribe(data => {
      this.reload();
    }, error => console.error(error));
  }

  excluir(id: number) {
    this.http.get<any[]>(this.baseUrl + 'api/ContasAReceber/Excluir?id=' + id).subscribe(data => {
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
    this.BuscaTodasContas();
    this.cdr.detectChanges();
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    //this.sort.sortChange.subscribe(() => {
    //  this.cdr.detectChanges();
    //});
  }
}

interface ContasAReceber {
  Id: number;
  VendaId: number;
  DataCompetencia: Date;
  DataVencimento: Date;
  DataConta: Date;
  Parcela: number;
  Valor: number;
  ClienteNome: string;
  ClienteId: number;
}
