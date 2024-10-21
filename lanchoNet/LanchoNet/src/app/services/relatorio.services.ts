import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ModalComponent} from "../modal/modal.component";
import {MatDialog} from "@angular/material/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Injectable({
  providedIn: 'root'
})
export class RelServices {
  baseUrl = "http://localhost:8080/";

  constructor(private http: HttpClient, private dialog: MatDialog) {
  }

  gerarRelatorioVendas(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelVendas', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioVendas");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  gerarRelCompras(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelCompra', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioCompras");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  gerarRelPedidos(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelPedidos', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioPedidos");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  gerarRelCreditos(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelCreditos', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioCreditos");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  gerarRelPessoas(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelPessoas', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioPessoas");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  gerarRelProdutos(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelProdutos', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioProdutos");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  gerarRelUsuarios(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelUsuarios', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioUsuarios");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  gerarRelContasPagar(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelContasPagar', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioContasPagar");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  gerarRelContasReceber(filtros: objetoFiltro){
    this.postData(this.baseUrl + 'api/Relatorio/GerarRelContasReceber', filtros, { responseType: 'text' }).subscribe({
      next: (resposta) => {
        this.geraPDF(resposta, "RelatorioContasReceber");
      },
      error: (erro) => { this.openDialog("Erro", "Não foi possível gerar o relatório", "OK", true)  },
    });
  }

  postData(url: string, data: any, options?: any): Observable<any> {
    return this.http.post(url, data, options);
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'modalClass',
      hasBackdrop: true,
      data: {titulo: titulo, mensagem: mensagem, botao: botao, erro: erro}
    });
  }

  geraPDF(htmlContent: string, nomeRel: string): void {

    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    html2canvas(element,{
        scale: 2,
    }).then((canvas) => {
      document.body.removeChild(element);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(nomeRel);
    }).catch((error) => {
      console.error('Erro ao gerar PDF', error);
    });
  }
}

export class objetoFiltro {
  dataInicio: Date = new Date();
  dataFim: Date = new Date();
  pessoaId!: number;
  produtoId!: number;
  categoriaId!: number;
  grupoUsuarioId!: number;
  vendaBalcao: boolean = false;
  cliente: boolean = false;
  fornecedor: boolean = false;
  funcionario: boolean = false;
}
