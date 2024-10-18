import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServices {
  private pedidoSelecionado: any;
  private abaFechado: boolean = false;

  setPedido(pedido: any) {
    this.pedidoSelecionado = pedido;
  }

  getPedido() {
    return this.pedidoSelecionado;
  }

  setAba(abaFechado: boolean) {
    this.abaFechado = abaFechado;
  }

  getAba() {
    return this.abaFechado;
  }
}
