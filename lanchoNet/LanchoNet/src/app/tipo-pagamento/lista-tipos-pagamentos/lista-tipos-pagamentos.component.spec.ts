import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTiposPagamentosComponent } from './lista-tipos-pagamentos.component';

describe('ListaTiposPagamentosComponent', () => {
  let component: ListaTiposPagamentosComponent;
  let fixture: ComponentFixture<ListaTiposPagamentosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTiposPagamentosComponent]
    });
    fixture = TestBed.createComponent(ListaTiposPagamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
