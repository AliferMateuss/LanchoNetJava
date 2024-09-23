import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroTiposPagamentosComponent } from './cadastro-tipos-pagamentos.component';

describe('CadastroTiposPagamentosComponent', () => {
  let component: CadastroTiposPagamentosComponent;
  let fixture: ComponentFixture<CadastroTiposPagamentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroTiposPagamentosComponent]
    });
    fixture = TestBed.createComponent(CadastroTiposPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
