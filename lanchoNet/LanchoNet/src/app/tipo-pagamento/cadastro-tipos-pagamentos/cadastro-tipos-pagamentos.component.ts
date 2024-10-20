import { HttpClient, HttpParams } from '@angular/common/http';
import {ChangeDetectorRef, Component, Inject, RendererFactory2, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../../modal/modal.component';
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-cadastro-tipos-pagamentos',
  templateUrl: './cadastro-tipos-pagamentos.component.html',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
        MatSortModule, MatCheckbox],
  standalone: true,
  styleUrls: ['./cadastro-tipos-pagamentos.component.css']
})
export class CadastroTiposPagamentosComponent {
  baseUrl: string = 'http://localhost:8080/';
  tipoPagamento: TipoPagamento = new TipoPagamento();
  formTipoPagamento?: FormGroup;
  ehAlteracao: boolean = false;

  @ViewChild('modalResposta') modalResposta!: TemplateRef<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute,
    private dialog: MatDialog, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    var id =  Number(this.route.snapshot.paramMap.get('id?'));
    if (id) {
      this.http.post<TipoPagamento>(this.baseUrl + 'api/TipoPagamento/RertornaPorId', id).subscribe(data => {
        this.tipoPagamento = data;
        this.ehAlteracao = true;
      }, error => this.openDialog("Erro ao recuperar tipo de pagamento", error, "Voltar", true));
    }

    this.formTipoPagamento = new FormGroup({
      nome: new FormControl(this.tipoPagamento.nome, [Validators.required]),
      juros: new FormControl(this.tipoPagamento.juros),
      aVista: new FormControl(this.tipoPagamento.avista),
      parcelas: new FormControl(this.tipoPagamento.parcelas)
    });
  }

  changeAVista(){
    if(this.tipoPagamento.avista){
      this.formTipoPagamento?.get('juros')?.reset();
      this.formTipoPagamento?.get('juros')?.disable();
      this.formTipoPagamento?.get('juros')?.setValue('');
      this.formTipoPagamento?.get('parcelas')?.reset();
      this.formTipoPagamento?.get('parcelas')?.disable();
      this.formTipoPagamento?.get('parcelas')?.setValue('');
    } else {
      this.formTipoPagamento?.get('juros')?.reset();
      this.formTipoPagamento?.get('juros')?.enable();
      this.formTipoPagamento?.get('parcelas')?.reset();
      this.formTipoPagamento?.get('parcelas')?.enable();
    }
    this.cdr.detectChanges();
  }

  openDialog(titulo: string, mensagem: string, botao: string, erro: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      panelClass: 'top10ClassesFodas',
      hasBackdrop: true,
      data: { titulo: titulo, mensagem: mensagem, botao: botao, erro: erro }
    });
    if (!erro) {
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/../listaTiposPagamento']);
      });
    }
  }

  salvarTipoPagamento() {
    if (this.formTipoPagamento?.invalid) {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');
      return;
    } else {
      if(this.formTipoPagamento)
        this.tipoPagamento.avista = this.formTipoPagamento.get('aVista')?.value;

      this.http.post<any>(this.baseUrl + 'api/TipoPagamento/Salvar', this.tipoPagamento).subscribe(data => {
        this.openDialog(this.ehAlteracao ? "Alteração realizada com sucesso" : "Cadastro realizado com sucesso", "", "Continuar", false);
      }, error => this.openDialog(this.ehAlteracao ? "Erro ao salvar alterações" : "Erro ao cadastrar", error, "Voltar", true));
    }
  }
}

export class TipoPagamento {
  id: number | null = null;
  nome: string | null = null;
  juros: number = 0;
  parcelas: number = 0;
  avista: boolean = false;
}
