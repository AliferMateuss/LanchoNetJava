import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCaixaComponent } from './lista-caixa.component';

describe('ListaCaixaComponent', () => {
  let component: ListaCaixaComponent;
  let fixture: ComponentFixture<ListaCaixaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCaixaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCaixaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
