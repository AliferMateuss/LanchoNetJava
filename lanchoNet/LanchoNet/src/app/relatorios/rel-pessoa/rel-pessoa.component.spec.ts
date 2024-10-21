import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelPessoaComponent } from './rel-pessoa.component';

describe('RelPessoaComponent', () => {
  let component: RelPessoaComponent;
  let fixture: ComponentFixture<RelPessoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelPessoaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelPessoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
