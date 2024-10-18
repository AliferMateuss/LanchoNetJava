import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComandasFechadasComponent } from './comandas-fechadas.component';

describe('ComandasFechadasComponent', () => {
  let component: ComandasFechadasComponent;
  let fixture: ComponentFixture<ComandasFechadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComandasFechadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComandasFechadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
