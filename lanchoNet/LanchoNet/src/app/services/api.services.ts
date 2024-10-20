import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServices {
  private pedidoSelecionado: any;
  private caixaSelecionado: any;
  private creditoSelecionado: any;
  private vendaSelecionada: any;
  private compraSelecionada: any;
  private abaFechado: boolean = false;

  setCaixa(caixa: any) {
    this.caixaSelecionado = caixa;
  }

  getCaixa() {
    return this.caixaSelecionado;
  }

  setPedido(pedido: any) {
    this.pedidoSelecionado = pedido;
  }

  getPedido() {
    return this.pedidoSelecionado;
  }

  setVenda(venda: any) {
    this.vendaSelecionada = venda;
  }

  getVenda() {
    return this.vendaSelecionada;
  }

  setCompra(compra: any) {
    this.compraSelecionada = compra;
  }

  getCompra() {
    return this.compraSelecionada;
  }

  setCredito(credito: any) {
    this.creditoSelecionado = credito;
  }

  getCredito() {
    return this.creditoSelecionado;
  }

  setAba(abaFechado: boolean) {
    this.abaFechado = abaFechado;
  }

  getAba() {
    return this.abaFechado;
  }
}
