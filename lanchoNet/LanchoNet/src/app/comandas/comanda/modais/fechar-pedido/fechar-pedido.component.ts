import {ChangeDetectorRef, Component, Inject, NgZone} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatLabel} from "@angular/material/form-field";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {NgOptionComponent, NgSelectComponent} from "@ng-select/ng-select";
import {HttpClient} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {ModalComponent} from "../../../../modal/modal.component";
import {ItemPedido} from "../editar-item-pedido/editar-item-pedido.component";

@Component({
  selector: 'app-fechar-pedido',
  standalone: true,
  imports: [
    MatDialogContent,
    CurrencyPipe,
    FormsModule,
    MatButton,
    MatCheckbox,
    MatLabel,
    MatStep,
    MatStepLabel,
    MatStepper,
    MatStepperNext,
    MatStepperPrevious,
    NgForOf,
    NgIf,
    NgOptionComponent,
    NgSelectComponent,
    ReactiveFormsModule,
    MatDialogTitle
  ],
  templateUrl: './fechar-pedido.component.html',
  styleUrl: './fechar-pedido.component.css'
})
export class FecharPedidoComponent {
  baseUrl: string = 'http://localhost:8080/';
  primeiroStep!: FormGroup;
  segundoStep!: FormGroup;
  comanda!: Comanda;
  parcelar: boolean = false;
  public TiposPagamentos!: TipoPagamento[] | null;
  public tipoPagamentoSelecionado: TipoPagamento | null | undefined;

  constructor(private http: HttpClient, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog, private cdr: ChangeDetectorRef, private dialogRef: MatDialogRef<FecharPedidoComponent>) {

    this.comanda = new Comanda();
    this.comanda.id = data.id;
    this.comanda.idPessoa = data.idPessoa;
    this.comanda.idMesa = data.idMesa;
    this.comanda.idUsuario = data.idUsuario;
    this.comanda.valorTotal = data.valorTotal;
    this.comanda.nomeCliente = data.nomeCliente;

    this.primeiroStep = fb.group({
      tipoPagamento: new FormControl(this.tipoPagamentoSelecionado, [Validators.required]),
      parcelas: new FormControl(this.comanda.parcelas),
      pedidoFiado: new FormControl(this.comanda.pedidoFiado, [Validators.required]),
    });
    this.segundoStep = fb.group({});
    this.carregarTiposPagamentos();
  }

  carregarTiposPagamentos() {
    this.http.get<TipoPagamento[]>(this.baseUrl + 'api/TipoPagamento/RecuperarTipoPagamentos').subscribe(data => {
      this.TiposPagamentos = data;
      console.log(this.TiposPagamentos)
    }, error => this.openDialog("Erro: ", error.error.message, "Voltar", true));
  }

  changeParcelas() {
    if (this.tipoPagamentoSelecionado) {
      this.tipoPagamentoSelecionado.parcelaEscolhida = this.primeiroStep.get('parcelas')?.value;
    }
  }

  selecionaPedidoFiado(): void {
    this.comanda.pedidoFiado = this.primeiroStep.get('pedidoFiado')?.value;
    if (this.primeiroStep.get('pedidoFiado')?.value) {
      this.primeiroStep.get('tipoPagamento')?.clearValidators();
      this.primeiroStep.get('tipoPagamento')?.reset();
      this.primeiroStep.get('tipoPagamento')?.updateValueAndValidity();
    } else {
      this.primeiroStep.get('tipoPagamento')?.reset();
      this.primeiroStep.get('tipoPagamento')?.setValidators([Validators.required]);
      this.primeiroStep.get('tipoPagamento')?.updateValueAndValidity();
    }
    this.cdr.detectChanges();
  }

  changeFormaPagamento() {
    this.tipoPagamentoSelecionado = this.primeiroStep.get('tipoPagamento')?.value;
    if (!this.tipoPagamentoSelecionado) {
      this.openDialog("Erro: ", "Erro ao selecionar tipo pagamento", "Ok", true);
      console.log(this.primeiroStep.get('tipoPagamento')?.value);
      return;
    }

    this.parcelar = this.tipoPagamentoSelecionado?.parcelas > 0;
  }

  avancaStep() {
    if (this.tipoPagamentoSelecionado)
      this.calcularParcelas(this.calcularValorPedidoJuros(), this.tipoPagamentoSelecionado.parcelaEscolhida);
    this.cdr.detectChanges();
  }

  calcularValorPedidoJuros(): number {
    let total = this.comanda.valorTotal;
    if (this.tipoPagamentoSelecionado?.juros) {
      total = total + ((total * this.tipoPagamentoSelecionado?.juros) / 100);
    }
    return total;
  }

  calcularPedidoVenda(): number {
    return this.comanda.valorTotal;
  }

  calcularParcelas(valorTotal: number, parcelas: number) {
    valorTotal = parseFloat(valorTotal.toFixed(2));
    const valorParcela = Math.trunc((valorTotal / parcelas) * Math.pow(10, 2)) / Math.pow(10, 2);
    const total = parseFloat((valorParcela * parcelas).toFixed(2));
    const resto = parseFloat((valorTotal - total).toFixed(2));
    const temResto = resto > 0
    const ultimaParcela = parseFloat((valorParcela + resto).toFixed(2));

    if(this.tipoPagamentoSelecionado){
      this.tipoPagamentoSelecionado.valorParcela = valorParcela;
      this.tipoPagamentoSelecionado.ultimaParcelas = ultimaParcela;
      this.tipoPagamentoSelecionado.temResto = temResto;
    }
  }

  finalizarPedido(){
    if(this.comanda){
      if(this.tipoPagamentoSelecionado){
        this.comanda.idTipoPagamento = this.tipoPagamentoSelecionado?.id;
        this.comanda.parcelas = this.primeiroStep.get('parcelas')?.value;
      }
      this.comanda.pedidoFiado = this.primeiroStep.get('pedidoFiado')?.value;
    }
    this.http.post(this.baseUrl + "api/Pedido/FecharPedido", this.comanda).subscribe(data => {
      this.openDialog("Sucesso!", "Pedido fechado com sucesso!", "Voltar", true)
      this.dialogRef.close();
    }, error => this.openDialog("Erro: ", error.error.message, "Voltar", true));
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: {titulo: titulo, mensagem: mensagem, botao: botao, erro: erro}
    });

    if(!erro){
      dialogRef.afterClosed().subscribe(() => {
        this.dialogRef.close();
      })
    }
  }
}

interface TipoPagamento {
  id: number;
  nome: string;
  juros: number;
  parcelas: number;
  parcelaEscolhida: number;
  avista: boolean;
  valorParcela: number;
  temResto: boolean;
  ultimaParcelas: number;
}

class Comanda {
  id!: number;
  idPessoa!: number;
  idMesa!: number;
  idUsuario!: number;
  idTipoPagamento!: number;
  valorTotal!: number;
  nomeCliente!: string;
  expanded:boolean = false;
  dragging:boolean =  false;
  itens: any[] = [];
  parcelas!: number;
  pedidoFiado: boolean = false;
}
