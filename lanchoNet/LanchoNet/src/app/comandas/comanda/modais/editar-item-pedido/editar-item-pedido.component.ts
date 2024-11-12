import { HttpClient } from '@angular/common/http';
import {Component, Inject, Input, TemplateRef, ViewChild} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule, ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../../../modal/modal.component';
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import {MatDialogContent} from "@angular/material/dialog";

@Component({
  selector: 'app-editar-item-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogContent],
  templateUrl: './editar-item-pedido.component.html',
  styleUrl: './editar-item-pedido.component.css'
})
export class EditarItemPedidoComponent {
  baseUrl: string = 'http://localhost:8080/';
  formItemPedido?: FormGroup;
  ehAlteracao: boolean = false;
  itemPedido!: ItemPedido;

  @ViewChild('modalResposta') modalResposta!: TemplateRef<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private router: Router,
              @Inject(MAT_DIALOG_DATA) public data: ItemPedido, private dialogRef: MatDialogRef<EditarItemPedidoComponent>) {
    this.itemPedido = data;
  }

  ngOnInit() {
    this.formItemPedido = new FormGroup({
      produtoNome: new FormControl({ value: this.itemPedido.produtoNome, disabled: true }, [Validators.required]), // ReadOnly
      precoUnitario: new FormControl({value: this.itemPedido.precoUnitario, disabled: true}, [Validators.required]),
      quantidade: new FormControl(this.itemPedido.quantidade, [Validators.required]),
      subTotal: new FormControl({ value: this.itemPedido.subTotal, disabled: true }, [Validators.required]) // ReadOnly
    });
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
  }

  calculaSubTotal(): string{
    const valor = (this.itemPedido.precoUnitario * this.itemPedido.quantidade).toFixed(2)
    return this.formatarValorParaExibicao(Number.parseFloat(valor));
  }

formatarValorParaExibicao(valor: number): string {
    const partes = valor.toString().split('.');
    const parteInteira = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    let parteDecimal = partes[1] || '00';

    if (parteDecimal.length === 1) {
        parteDecimal += '0';
    }

    return `R$ ${parteInteira},${parteDecimal}`;
}

  salvarItemPedido() {
    if (this.formItemPedido?.invalid) {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');
      return;
    } else {
      this.itemPedido.subTotal = this.itemPedido.precoUnitario * this.itemPedido.quantidade;
      this.http.post<ItemPedido>(this.baseUrl + 'api/Pedido/SalvaItemPedido', this.itemPedido).subscribe(data => {
        this.dialogRef.close();
      }, error => this.openDialog("Erro ao salvar alterações", error, "Voltar", true));
    }
  }

  fecharModal(){
    this.dialogRef.close();
  }
}

export class ItemPedido {
  id!: number;
  subTotal!: number;
  precoUnitario!: number;
  quantidade!: number;
  produtoNome!: string;
  produtoId!: number;
  idPedido!: number;
}
