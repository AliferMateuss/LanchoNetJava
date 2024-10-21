import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelCompraComponent } from './rel-compra.component';

describe('RelCompraComponent', () => {
  let component: RelCompraComponent;
  let fixture: ComponentFixture<RelCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
