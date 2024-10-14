import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCaixaComponent } from './cadastro-caixa.component';

describe('CadastroCaixaComponent', () => {
  let component: CadastroCaixaComponent;
  let fixture: ComponentFixture<CadastroCaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCaixaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
