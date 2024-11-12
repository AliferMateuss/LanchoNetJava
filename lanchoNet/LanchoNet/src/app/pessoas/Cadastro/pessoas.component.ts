import {HttpClient, HttpParams} from '@angular/common/http';
import {ChangeDetectorRef, Component, Directive, Inject, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS, ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import {GenericValidator} from '../../Validators/validator.component';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import * as $ from 'jquery'
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {NgxMaskDirective, NgxMaskPipe} from 'ngx-mask';
import {NgSelectModule} from "@ng-select/ng-select";
import {ModalComponent} from "../../modal/modal.component";


@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatTableModule, MatPaginatorModule,
    MatSortModule, NgxMaskDirective, NgSelectModule],
  standalone: true,
  animations: [
    trigger('slideLeftToRight', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms ease-out', style({transform: 'translateX(0)'})),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({transform: 'translateX(-100%)'})),
      ])
    ]),
    trigger('slideLeftToRightAndBottomToTop', [
      transition(':enter', [
        style({transform: 'translateX(-100%) translateY(100%)'}),
        animate('300ms ease-out', style({transform: 'translateX(0) translateY(0)'})),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({transform: 'translateX(-100%) translateY(100%)'})),
      ])
    ])
  ]
})
export class PessoasComponent implements OnInit {
  baseUrl: string = 'http://localhost:8080/';
  public pessoa!: Pessoa;
  public formPessoa!: FormGroup;
  public formEndereco!: FormGroup;
  public Endereco: Endereco | null = null;
  public estados: any[] | null = null;
  public cidades: any[] | null = null;
  public ehAlteracao: boolean = false;
  // #region Variáveis de tela
  documentoOK: boolean = true;
  documento: string = '';
  documentoPassou: boolean = false;
  cliente: boolean = false;
  funcionario: boolean = false;
  fornecedor: boolean = false;
  tipoPessoa: boolean = false;
  dataSource: MatTableDataSource<Endereco> =  new MatTableDataSource<Endereco>();
  pageIndex!: number;
  pageSize: number = 10;
  displayedColumns: string[] = ['nome', 'bairro', 'cidade', 'Acoes'];
  idEstado: number | null = null;
  erro: string | null = null;

  // #endregion
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private fb: FormBuilder,
              private cdr: ChangeDetectorRef, private validator: GenericValidator, private route: ActivatedRoute, private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    var id = Number(this.route.snapshot.paramMap.get('id?'));
    if (id) {
      this.http.post<Pessoa>(this.baseUrl + 'api/Pessoas/RetornaPessoaPorId', id).subscribe(data => {

        console.log(data);
        this.pessoa = data;
        this.pessoa.dataNascimento
        this.pessoa.enderecos = data.enderecos ? data.enderecos : [];
        this.documento = data.cpf ?? data.cnpj ?? "";
        this.cliente = data.cliente ?? false;
        this.fornecedor = data.fornecedor ?? false;
        this.funcionario = data.funcionario ?? false;
        this.documentoOK = true;
        this.documentoPassou = true;
        this.tipoPessoa = true;
        this.ehAlteracao = true;
        this.formPessoa = new FormGroup({
          nome: new FormControl(this.pessoa.nome),
          dataNascimento: new FormControl(this.pessoa.dataNascimento),
          telefone1: new FormControl(this.pessoa.telefone1),
          telefone2: new FormControl(this.pessoa.telefone2),
          email: new FormControl(this.pessoa.email),
          ie: new FormControl(this.pessoa.ie),
          cpf: new FormControl({
            value: this.pessoa.cpf,
            disabled: this.documento.length === 11
          }),
          cnpj: new FormControl({
            value: this.pessoa.cnpj,
            disabled: this.documento.length === 14
          }),
          rg: new FormControl(this.pessoa.rg),
          razaoSocial: new FormControl(this.pessoa.razaoSocial),
          salario: new FormControl(this.pessoa.salario),
          cargo: new FormControl(this.pessoa.cargo),
          pis: new FormControl(this.pessoa.pis),
          cliente: new FormControl(false),
          fornecedor: new FormControl(false),
          funcionario: new FormControl(false),
        });
        this.dataSource.data = this.pessoa.enderecos;
        this.cdr.detectChanges();
        this.setValidators();
      }, error =>  this.openDialog("Erro ao recuperar Pessoa", error.error.message, "Voltar", true));
    }
  }

  validarDocumento() {

    this.documentoPassou = false;
    this.cliente = false;
    this.fornecedor = false;
    this.funcionario = false;
    const documentoLimpo = this.documento.replace(/[^\d]+/g, '');

    let validatorFn;
    if (documentoLimpo.length === 11) {
      validatorFn = GenericValidator.isValidCpf();
    } else if (documentoLimpo.length === 14) {
      validatorFn = GenericValidator.isValidCnpj();
    } else {
      return;
    }

    if (validatorFn) {
      const error = validatorFn({value: this.documento} as AbstractControl);
      this.documentoOK = !error;
      if (error) {
      } else {
        this.documentoPassou = true;
        if (this.pessoa != null || this.pessoa != undefined)
          this.limpaPessoaSemDocumento();
        this.pessoa = new Pessoa();
        this.pessoa.cpf = documentoLimpo.length === 11 ? documentoLimpo : null;
        this.pessoa.cnpj = documentoLimpo.length === 14 ? documentoLimpo : null;

        if (this.formPessoa === undefined || this.formPessoa === null)
          this.formPessoa = new FormGroup({
            nome: new FormControl(this.pessoa.nome),
            dataNascimento: new FormControl(this.pessoa.dataNascimento),
            telefone1: new FormControl(this.pessoa.telefone1),
            telefone2: new FormControl(this.pessoa.telefone2),
            email: new FormControl(this.pessoa.email),
            ie: new FormControl(this.pessoa.ie),
            cpf: new FormControl({
              value: this.pessoa.cpf,
              disabled: this.documento.length === 11
            }),
            cnpj: new FormControl({
              value: this.pessoa.cnpj,
              disabled: this.documento.length === 14
            }),
            rg: new FormControl(this.pessoa.rg),
            razaoSocial: new FormControl(this.pessoa.razaoSocial),
            salario: new FormControl(this.pessoa.salario),
            cargo: new FormControl(this.pessoa.cargo),
            pis: new FormControl(this.pessoa.pis),
            cliente: new FormControl(false),
            fornecedor: new FormControl(false),
            funcionario: new FormControl(false),
          });

        this.cdr.detectChanges();
      }
    }
  }

  selecionarTipoDocumento(tipo: string) {

    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    form.classList.remove('was-validated');

    if (this.fornecedor || this.cliente || this.funcionario) {
      this.tipoPessoa = true;
      const formControls = this.formPessoa.controls;
      Object.keys(formControls).forEach(controlName => {
        formControls[controlName].clearValidators();
        formControls[controlName].updateValueAndValidity();
      });

      this.setValidators();
    } else {
      this.tipoPessoa = false;
    }
  }

  setValidators(): void {
    const formControls = this.formPessoa.controls;
    Object.keys(formControls).forEach(controlName => {
      formControls[controlName].clearValidators();
      formControls[controlName].updateValueAndValidity();
    });
    if (this.cliente && (this.fornecedor || this.documento.length === 14)) {
      formControls['razaoSocial'] = this.fb.control('', Validators.required);
      formControls['telefone1'] = this.fb.control('', [Validators.required, GenericValidator.telefoneValidator()]);
      formControls['telefone1'].setValue(this.pessoa.telefone1);
      formControls['cnpj'] = this.fb.control('', Validators.required);
      formControls['cnpj'].setValue(this.pessoa.cnpj);
      formControls['cnpj'].disable();
      formControls['cpf'] = this.fb.control('', GenericValidator.isValidCpfOrNull());
      formControls['cpf'].setValue(this.pessoa.cpf);
      formControls['rg'] = this.fb.control('', GenericValidator.rgValidator());
      formControls['rg'].setValue(this.pessoa.rg);
      formControls['email'] = this.fb.control('', GenericValidator.emailValidator());
      formControls['email'].setValue(this.pessoa.email);
      formControls['telefone2'] = this.fb.control('', GenericValidator.telefoneValidator());
      formControls['telefone2'].setValue(this.pessoa.telefone2);
      formControls['ie'] = this.fb.control('', GenericValidator.inscricaoEstadualValidator());
      formControls['ie'].setValue(this.pessoa.ie);
    } else if (this.cliente && this.funcionario) {
      formControls['nome'] = this.fb.control('', Validators.required);
      formControls['nome'].setValue(this.pessoa.nome);
      formControls['cpf'] = this.fb.control('', Validators.required);
      formControls['cpf'].setValue(this.pessoa.cpf);
      formControls['cpf'].disable();
      formControls['rg'] = this.fb.control('', GenericValidator.rgValidator());
      formControls['rg'].setValue(this.pessoa.rg);
      formControls['dataNascimento'] = this.fb.control('', [Validators.required, GenericValidator.lessThan18Years()]);
      formControls['dataNascimento'].setValue(this.pessoa.dataNascimento);
      formControls['pis'] = this.fb.control('', [Validators.required, GenericValidator.isValidPis()]);
      formControls['pis'].setValue(this.pessoa.pis);
      formControls['salario'] = this.fb.control('', Validators.required);
      formControls['salario'].setValue(this.pessoa.salario);
      formControls['cargo'] = this.fb.control('', Validators.required);
      formControls['cargo'].setValue(this.pessoa.cargo);
      formControls['email'] = this.fb.control('', GenericValidator.emailValidator());
      formControls['email'].setValue(this.pessoa.email);
      formControls['telefone2'] = this.fb.control('', GenericValidator.telefoneValidator());
      formControls['telefone2'].setValue(this.pessoa.telefone2);
      formControls['telefone1'] = this.fb.control('', GenericValidator.telefoneValidator());
      formControls['telefone1'].setValue(this.pessoa.telefone1);
    } else if (this.cliente && this.documento.length === 11) {
      formControls['nome'] = this.fb.control('', Validators.required);
      formControls['nome'].setValue(this.pessoa.nome);
      formControls['cpf'] = this.fb.control('', Validators.required);
      formControls['cpf'].setValue(this.pessoa.cpf);
      formControls['cpf'].disable();
      formControls['rg'] = this.fb.control('', GenericValidator.rgValidator());
      formControls['rg'].setValue(this.pessoa.rg);
      formControls['dataNascimento'] = this.fb.control('', [Validators.required, GenericValidator.lessThan18Years()]);
      formControls['dataNascimento'].setValue(this.pessoa.dataNascimento);
      formControls['email'] = this.fb.control('', GenericValidator.emailValidator());
      formControls['email'].setValue(this.pessoa.email);
      formControls['telefone2'] = this.fb.control('', GenericValidator.telefoneValidator());
      formControls['telefone2'].setValue(this.pessoa.telefone2);
      formControls['telefone1'] = this.fb.control('', GenericValidator.telefoneValidator());
      formControls['telefone1'].setValue(this.pessoa.telefone1);
    } else if (this.fornecedor) {
      formControls['razaoSocial'] = this.fb.control('', Validators.required);
      formControls['razaoSocial'].setValue(this.pessoa.razaoSocial);
      formControls['telefone1'] = this.fb.control('', Validators.required);
      formControls['telefone1'].setValue(this.pessoa.telefone1);
      formControls['cnpj'] = this.fb.control('', Validators.required);
      formControls['cnpj'].setValue(this.pessoa.cnpj);
      formControls['cnpj'].disable();
      formControls['email'] = this.fb.control('', GenericValidator.emailValidator());
      formControls['email'].setValue(this.pessoa.email);
      formControls['telefone2'] = this.fb.control('', GenericValidator.telefoneValidator());
      formControls['telefone2'].setValue(this.pessoa.telefone2);
      formControls['ie'] = this.fb.control('', GenericValidator.inscricaoEstadualValidator());
      formControls['ie'].setValue(this.pessoa.ie);
    } else if (this.funcionario) {
      formControls['nome'] = this.fb.control('', Validators.required);
      formControls['nome'].setValue(this.pessoa.nome);
      formControls['cpf'] = this.fb.control('', Validators.required);
      formControls['cpf'].setValue(this.pessoa.cpf);
      formControls['cpf'].disable();
      formControls['rg'] = this.fb.control('', GenericValidator.rgValidator());
      formControls['rg'].setValue(this.pessoa.rg);
      formControls['dataNascimento'] = this.fb.control('', [Validators.required, GenericValidator.lessThan18Years()]);
      formControls['dataNascimento'].setValue(this.pessoa.dataNascimento);
      formControls['pis'] = this.fb.control('', Validators.required);
      formControls['pis'].setValue(this.pessoa.pis);
      formControls['salario'] = this.fb.control('', Validators.required);
      formControls['salario'].setValue(this.pessoa.salario);
      formControls['cargo'] = this.fb.control('', Validators.required);
      formControls['cargo'].setValue(this.pessoa.cargo);
      formControls['email'] = this.fb.control('', GenericValidator.emailValidator());
      formControls['email'].setValue(this.pessoa.email);
      formControls['telefone2'] = this.fb.control('', GenericValidator.telefoneValidator());
      formControls['telefone2'].setValue(this.pessoa.telefone2);
      formControls['telefone1'] = this.fb.control('', GenericValidator.telefoneValidator());
      formControls['telefone1'].setValue(this.pessoa.telefone1);
    }

    this.formPessoa = this.fb.group(formControls);
  }

  salvarPessoa() {

    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    form.classList.remove('was-validated');

    Object.keys(this.formPessoa.controls).forEach((campo) => {
      this.formPessoa.get(campo)?.markAsTouched();
      this.formPessoa.get(campo)?.markAsDirty();
    });


    this.RevalidaPessoa();
    if (this.formPessoa.valid) {
      this.pessoa.cliente = this.cliente;
      this.pessoa.fornecedor = this.fornecedor;
      this.pessoa.funcionario = this.funcionario;
      this.http.post(this.baseUrl + 'api/Pessoas/SalvarPessoa', this.pessoa).subscribe(data => {
        this.limpaPessoa();
        this.openDialog(this.ehAlteracao ? "Alteração realizada com sucesso" : "Cadastro realizado com sucesso", "", "Continuar", false);
      }, error => this.openDialog(this.ehAlteracao ? "Erro ao salvar alterações" : "Erro ao cadastrar", error, "Voltar", true));
    } else {
      const form = document.querySelector('.needs-validation') as HTMLFormElement;
      form.classList.add('was-validated');
    }
    this.validaCampos();
  }

  validaCampos(): boolean {
    const campos = [];

    if (this.cliente || this.funcionario)
      if (this.dataNascimento.errors?.['lessThan18Years'] && !this.dataNascimento.errors?.['required']) {
        var data = document.querySelector('#dataNascimento') as HTMLFormElement;
        if (data)
          data.style.borderColor = 'var(--bs-form-invalid-color)';
        var input = document.querySelector('.invalid-feedback.menorIdade') as HTMLFormElement;
        if (input)
          input.style.display = 'block';
        campos.push(1);
      } else if (!this.dataNascimento.errors?.['required']) {
        var data = document.querySelector('#dataNascimento') as HTMLFormElement;
        if (data)
          data.style.borderColor = 'var(--bs-border-color)';
        var input = document.querySelector('.invalid-feedback.menorIdade') as HTMLFormElement;
        if (input)
          input.style.display = 'none';
      }

    if (this.cpf.errors?.['cpfNotValid']) {
      if (this.cliente && this.documento.length == 14) {
        var cpf = document.querySelector('#cpfRepresentante') as HTMLFormElement;
        cpf.style.borderColor = 'var(--bs-form-invalid-color)';
        var input = document.querySelector('.invalid-feedback.cpf') as HTMLFormElement;
        input.style.display = 'block';
        campos.push(1);
      }
    } else {
      if (this.cliente && this.documento.length == 14) {
        var data = document.querySelector('#cpfRepresentante') as HTMLFormElement;
        data.style.borderColor = 'var(--bs-border-color)';
        var input = document.querySelector('.invalid-feedback.cpf') as HTMLFormElement;
        if (input)
          input.style.display = 'none';
      }
    }

    if (this.telefone1.errors?.['telefoneInvalido']) {
      var data = document.querySelector('#telefone1') as HTMLFormElement;
      data.style.borderColor = 'var(--bs-form-invalid-color)';
      var input = document.querySelector('.invalid-feedback.telefone1') as HTMLFormElement;
      input.style.display = 'block';
      campos.push(1);
    } else {
      var data = document.querySelector('#telefone1') as HTMLFormElement;
      data.style.borderColor = 'var(--bs-border-color)';
      var input = document.querySelector('.invalid-feedback.telefone1') as HTMLFormElement;
      if (input)
        input.style.display = 'none';
    }

    if (this.telefone2.errors?.['telefoneInvalido']) {
      var data = document.querySelector('#telefone2') as HTMLFormElement;
      data.style.borderColor = 'var(--bs-form-invalid-color)';
      var input = document.querySelector('.invalid-feedback.telefone2') as HTMLFormElement;
      input.style.display = 'block';
      campos.push(1);
    } else {
      var data = document.querySelector('#telefone2') as HTMLFormElement;
      data.style.borderColor = 'var(--bs-border-color)';
      var input = document.querySelector('.invalid-feedback.telefone2') as HTMLFormElement;
      if (input)
        input.style.display = 'none';
    }

    if (this.documento.length == 14) {
      if (this.ie.errors?.['IEInvalida']) {
        var data = document.querySelector('#ie') as HTMLFormElement;
        data.style.borderColor = 'var(--bs-form-invalid-color)';
        var input = document.querySelector('.invalid-feedback.ie') as HTMLFormElement;
        input.style.display = 'block';
        campos.push(1);
      } else {
        var data = document.querySelector('#ie') as HTMLFormElement;
        data.style.borderColor = 'var(--bs-border-color)';
        var input = document.querySelector('.invalid-feedback.ie') as HTMLFormElement;
        if (input)
          input.style.display = 'none';
      }
    }

    if (this.email.errors?.['emailInvalido']) {
      var data = document.querySelector('#email') as HTMLFormElement;
      data.style.borderColor = 'var(--bs-form-invalid-color)';
      var input = document.querySelector('.invalid-feedback.email') as HTMLFormElement;
      input.style.display = 'block';
      campos.push(1);
    } else {
      var data = document.querySelector('#email') as HTMLFormElement;
      data.style.borderColor = 'var(--bs-border-color)';
      var input = document.querySelector('.invalid-feedback.email') as HTMLFormElement;
      if (input)
        input.style.display = 'none';
    }

    if (this.rg.errors?.['rgInvalid']) {
      var data = document.querySelector('#rg') as HTMLFormElement;
      data.style.borderColor = 'var(--bs-form-invalid-color)';
      var input = document.querySelector('.invalid-feedback.rg') as HTMLFormElement;
      input.style.display = 'block';
      campos.push(1);
    } else {
      var data = document.querySelector('#rg') as HTMLFormElement;
      data.style.borderColor = 'var(--bs-border-color)';
      var input = document.querySelector('.invalid-feedback.rg') as HTMLFormElement;
      if (input)
        input.style.display = 'none';
    }

    if (this.funcionario) {
      if (this.pis.errors?.['pisNotValid']) {
        var data = document.querySelector('#pis') as HTMLFormElement;
        data.style.borderColor = 'var(--bs-form-invalid-color)';
        var input = document.querySelector('.invalid-feedback.pis') as HTMLFormElement;
        input.style.display = 'block';
        campos.push(1);
      } else {
        var data = document.querySelector('#pis') as HTMLFormElement;
        data.style.borderColor = 'var(--bs-border-color)';
        var input = document.querySelector('.invalid-feedback.pis') as HTMLFormElement;
        if (input)
          input.style.display = 'none';
      }
    }


    return campos.length > 0;
  }

  selecionarEstado($event: any) {
    if ($event) {
      this.formEndereco.get('idCidade')?.clearValidators()
      this.formEndereco.get('idCidade')?.updateValueAndValidity();
      this.formEndereco.get('idCidade')?.enable();
      this.formEndereco.get('idCidade')?.setValidators(Validators.required);
      this.formEndereco.get('idCidade')?.updateValueAndValidity();
      this.cdr.detectChanges();
    } else {
      this.formEndereco.get('idCidade')?.clearValidators()
      this.formEndereco.get('idCidade')?.updateValueAndValidity();
      this.formEndereco.get('idCidade')?.disable();
      this.formEndereco.get('idCidade')?.updateValueAndValidity();
      this.cdr.detectChanges();
    }

  }

  adicionarEndereco() {
    this.Endereco = new Endereco();
    this.formEndereco = new FormGroup({
      idCidade: new FormControl({value: this.Endereco.idCidade, disabled: true}, [Validators.required]),
      cep: new FormControl(this.Endereco.cep, [Validators.required]),
      rua: new FormControl(this.Endereco.rua, [Validators.required]),
      numero: new FormControl(this.Endereco.numero, [Validators.required]),
      complemento: new FormControl(this.Endereco.complemento),
      bairro: new FormControl(this.Endereco.bairro, [Validators.required]),
      estado: new FormControl(this.idEstado, [Validators.required]),
    });
    this.pageIndex = 1;
    this.estados = null;
    this.idEstado = null;
    this.carregarEstados();
  }


  carregarEstados() {
    this.http.get<any[]>(this.baseUrl + 'api/Estado/RecuperaEstados').subscribe(data => {
      if (this.estados == null || this.estados == undefined)
        this.estados = data;

      this.cdr.detectChanges();
    }, error => console.error(error));
  }

  pesquisarCidades($event: any) {
    if ($event.term.length <= 3)
      return;

    this.http.get<any[]>(this.baseUrl + 'api/Cidade/BuscaCidadesPorEstadoETermo?estadoId=' + this.idEstado?.toString() + "&termo=" + $event.term.toString()).subscribe(data => {
      this.cidades = data;
      this.cdr.detectChanges();
    }, error => console.error(error));

  }

  alterarEndereco(endereco: Endereco) {
    this.carregarEstados();
    this.Endereco = endereco;
    this.formEndereco = new FormGroup({
      idCidade: new FormControl(this.Endereco.idCidade, [Validators.required]),
      cep: new FormControl(this.Endereco.cep, [Validators.required]),
      rua: new FormControl(this.Endereco.rua, [Validators.required]),
      numero: new FormControl(this.Endereco.numero, [Validators.required]),
      complemento: new FormControl(this.Endereco.complemento),
      bairro: new FormControl(this.Endereco.bairro, [Validators.required]),
      estado: new FormControl(this.idEstado, [Validators.required]),
    });

    if (this.ehAlteracao) {

      if (endereco.idEstado != null)
        this.idEstado = endereco.idEstado;


      if (endereco.idCidade != null) {
        this.http.post<any>(this.baseUrl + 'api/Cidade/RecuperaCidadePorId', endereco.idCidade).subscribe(data => {
          var array = [];
          array.push(data);
          this.cidades = array;
          this.cdr.detectChanges();
        }, error => console.error(error));
      }
    }
  }

  removerEndereco(endereco: Endereco) {
    const index = this.pessoa.enderecos.indexOf(endereco);
    if (index !== -1) {
      this.pessoa.enderecos.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource<Endereco>(this.pessoa.enderecos);
    this.cdr.detectChanges();
  }

  selecionarCidade($event: any) {
    const cidade = this.cidades?.find(c => c.id === $event);

    if (this.Endereco != null || this.Endereco != undefined)
      this.Endereco.cidadeNome = cidade.nome;
  }

  salvarEndereco(novo: boolean) {

    Object.keys(this.formEndereco.controls).forEach((campo) => {
      this.formPessoa.get(campo)?.markAsTouched();
      this.formPessoa.get(campo)?.markAsDirty();
    });

    if (this.formEndereco.valid) {

      if (this.Endereco != null) {
        const index = this.pessoa.enderecos.indexOf(this.Endereco);
        if (index !== -1) {
          this.pessoa.enderecos.splice(index, 1);
        }
        this.pessoa.enderecos.push(this.Endereco);
      }
      if (novo) {
        this.Endereco = new Endereco();
      } else {
        var botao = document.querySelector('#cancelarModal') as HTMLFormElement;
        botao.click();
      }
      this.cidades = null;
    } else {
      const form = document.querySelector('.needs-validation.endereco') as HTMLFormElement;
      form.classList.add('was-validated');

      if (this.idEstado == null) {
        var estado = document.querySelector('#estado') as HTMLFormElement;
        estado.classList.add('is-invalid');
        var selectEstado = document.querySelector('.customEstado.ng-select.is-invalid.ng-select-single .ng-select-container') as HTMLFormElement;
        selectEstado.style.borderColor = 'var(--bs-form-invalid-color)';
      } else {
        var cidade = document.querySelector('#estado') as HTMLFormElement;
        cidade.classList.remove('is-invalid');
        var select = document.querySelector('.customEstado.ng-select.ng-select-single .ng-select-container') as HTMLFormElement;
        select.style.borderColor = '#ccc';
      }

      if (this.Endereco?.idCidade == null) {
        const form = document.querySelector('#cidade') as HTMLFormElement;
        form.classList.add('is-invalid');
        const select = document.querySelector('.customCidade.ng-select.is-invalid.ng-select-single .ng-select-container') as HTMLFormElement;
        select.style.borderColor = 'var(--bs-form-invalid-color)';
      } else {
        const form = document.querySelector('#cidade') as HTMLFormElement;
        form.classList.remove('is-invalid');
        const select = document.querySelector('.customCidade.ng-select.ng-select-single .ng-select-container') as HTMLFormElement;
        select.style.borderColor = '#ccc';
      }
    }

    this.dataSource = new MatTableDataSource<Endereco>(this.pessoa.enderecos);
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
        this.router.navigate(['/../listaPessoas']);
      });
    }
  }

  fecharModal() {
    this.Endereco = null;
    this.cidades = null;
    this.estados = null;
  }

  RevalidaPessoa() {
    this.pessoa.nome = ((this.cliente || this.funcionario) && this.documento.length === 11) || (this.cliente && this.documento.length === 14) ? this.pessoa.nome : null;
    this.pessoa.cpf = ((this.cliente || this.funcionario) && this.documento.length === 11) || (this.cliente && this.documento.length === 14) ? this.pessoa.cpf : null;
    this.pessoa.rg = ((this.cliente || this.funcionario) && this.documento.length === 11) || (this.cliente && this.documento.length === 14) ? this.pessoa.rg : null;
    this.pessoa.ie = this.documento.length === 14 ? this.pessoa.ie : null;
    this.pessoa.razaoSocial = this.documento.length === 14 ? this.pessoa.razaoSocial : null;
    this.pessoa.dataNascimento = (this.cliente || this.funcionario) && this.documento.length === 11 ? this.pessoa.dataNascimento : null;
    this.pessoa.cargo = this.funcionario ? this.pessoa.cargo : null;
    this.pessoa.pis = this.funcionario ? this.pessoa.pis : null;
    this.pessoa.salario = this.funcionario ? this.pessoa.salario : null;
  }

  limpaPessoa() {
    this.formPessoa.reset();
    this.documento = "";
    this.documentoPassou = false;
    this.tipoPessoa = false;
    this.cliente = false;
    this.fornecedor = false;
    this.funcionario = false;
    this.pessoa.id = null;
    this.pessoa.nome = null;
    this.pessoa.dataNascimento = null;
    this.pessoa.telefone1 = null;
    this.pessoa.telefone2 = null;
    this.pessoa.email = null;
    this.pessoa.cpf = null;
    this.pessoa.cnpj = null;
    this.pessoa.ie = null;
    this.pessoa.rg = null;
    this.pessoa.razaoSocial = null;
    this.pessoa.ativo = null;
    this.pessoa.salario = null;
    this.pessoa.cargo = null;
    this.pessoa.pis = null;
    this.pessoa.enderecos = [];
  }

  limpaPessoaSemDocumento() {
    this.formPessoa.reset();
    this.cliente = false;
    this.tipoPessoa = false;
    this.fornecedor = false;
    this.funcionario = false;
    this.pessoa.id = null;
    this.pessoa.nome = null;
    this.pessoa.dataNascimento = null;
    this.pessoa.telefone1 = null;
    this.pessoa.telefone2 = null;
    this.pessoa.email = null;
    this.pessoa.cpf = null;
    this.pessoa.cnpj = null;
    this.pessoa.ie = null;
    this.pessoa.rg = null;
    this.pessoa.razaoSocial = null;
    this.pessoa.ativo = null;
    this.pessoa.salario = null;
    this.pessoa.cargo = null;
    this.pessoa.pis = null;
    this.pessoa.enderecos = [];
  }

  calculaIdade(idade: Date): number {
    const hoje = new Date()
    const timeDiff = Math.abs(hoje.getTime() - new Date(idade).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
  }

  // #region Gettes Forms
  get nome() {
    return this.formPessoa.get('nome')!;
  }

  get dataNascimento() {
    return this.formPessoa.get('dataNascimento')!;
  }

  get telefone1() {
    return this.formPessoa.get('telefone1')!;
  }

  get telefone2() {
    return this.formPessoa.get('telefone2')!;
  }

  get email() {
    return this.formPessoa.get('email')!;
  }

  get ie() {
    return this.formPessoa.get('ie')!;
  }

  get rg() {
    return this.formPessoa.get('rg')!;
  }

  get cpf() {
    return this.formPessoa.get('cpf')!;
  }

  get razaoSocial() {
    return this.formPessoa.get('razaoSocial')!;
  }

  get salario() {
    return this.formPessoa.get('salario')!;
  }

  get cargo() {
    return this.formPessoa.get('cargo')!;
  }

  get pis() {
    return this.formPessoa.get('pis')!;
  }

  get idPessoa() {
    return this.formEndereco.get('idPessoa')!;
  }

  get idCidade() {
    return this.formEndereco.get('idCidade')!;
  }

  get cep() {
    return this.formEndereco.get('cep')!;
  }

  get rua() {
    return this.formEndereco.get('rua')!;
  }

  get numero() {
    return this.formEndereco.get('numero')!;
  }

  get complemento() {
    return this.formEndereco.get('complemento')!;
  }

  get bairro() {
    return this.formEndereco.get('bairro')!;
  }

  // #endregion
}

class Pessoa {
  public id: number | null = null;
  public nome: string | null = null;
  public dataNascimento: string | null = null;
  public telefone1: string | null = null
  public telefone2: string | null = null;
  public email: string | null = null;
  public cpf: string | null = null;
  public cnpj: string | null = null;
  public ie: string | null = null;
  public rg: string | null = null;
  public razaoSocial: string | null = null;
  public ativo: boolean | null = null;
  public salario: number | null = null;
  public cargo: string | null = null;
  public pis: string | null = null;
  public cliente: boolean | null = null;
  public funcionario: boolean | null = null;
  public fornecedor: boolean | null = null;
  public enderecos: Endereco[] = [];
}

class Endereco {
  public id: number | null = null;
  public idPessoa: number | null = null;
  public idCidade: number | null = null;
  public cep: string | null = null;
  public rua: string | null = null;
  public numero: string | null = null;
  public complemento: string | null = null;
  public bairro: string | null = null;
  public cidadeNome: string | null = null;
  public idEstado: number | null = null;
}
