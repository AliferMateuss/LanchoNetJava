import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelVendaComponent } from './rel-venda.component';

describe('RelVendaComponent', () => {
  let component: RelVendaComponent;
  let fixture: ComponentFixture<RelVendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelVendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelVendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
