import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentosCaixaComponent } from './movimentos-caixa.component';

describe('MovimentosCaixaComponent', () => {
  let component: MovimentosCaixaComponent;
  let fixture: ComponentFixture<MovimentosCaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentosCaixaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentosCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
