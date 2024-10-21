import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelProdutoComponent } from './rel-produto.component';

describe('RelProdutoComponent', () => {
  let component: RelProdutoComponent;
  let fixture: ComponentFixture<RelProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelProdutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
