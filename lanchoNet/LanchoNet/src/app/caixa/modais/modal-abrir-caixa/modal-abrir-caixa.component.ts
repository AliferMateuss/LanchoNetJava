import {Component, EventEmitter, Output, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule, NgIf} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select2Module} from "ng-select2-component";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ModalComponent} from "../../../modal/modal.component";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'app-modal-abrir-caixa',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxMaskDirective, NgSelectModule, RouterLink],
  templateUrl: './modal-abrir-caixa.component.html',
  styleUrl: './modal-abrir-caixa.component.css'
})
export class ModalAbrirCaixaComponent {
  baseUrl: string = 'http://localhost:8080/';
  caixa: Caixa = new Caixa();
  formCaixa?: FormGroup;
  ehAlteracao: boolean = false;
  @Output() carregaMovimentos = new EventEmitter<void>();

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.formCaixa = new FormGroup({
      dataAbertura: new FormControl(this.caixa.dataAbertura, [Validators.required]),
      valorInicial: new FormControl(this.caixa.valorInicial, [Validators.required])
    });
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'modalClass',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
  }

  salvarCaixa() {
    if (this.formCaixa?.invalid) {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');
      return;
    }

    const salvarBtn = document.querySelector('#salvarBtn') as HTMLButtonElement;
    salvarBtn.disabled = true;

    this.http.post<any>(this.baseUrl + 'api/Caixa/AbreCaixa', this.caixa).subscribe(data => {
      this.carregaMovimentos.emit();
    }, error => {
      this.openDialog("Erro ao abrir caixa", error, "Voltar", true);
      salvarBtn.disabled = false;
    });
  }
}

class Caixa {
  id: number | null = null;
  dataAbertura: string | null = null;
  dataFechamento: string | null = null;
  valorInicial: number | null = null;
  valorTotal: number | null = null;
  status: string | null = "ABERTO";
}
