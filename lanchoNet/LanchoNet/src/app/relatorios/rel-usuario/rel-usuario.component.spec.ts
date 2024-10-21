import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelUsuarioComponent } from './rel-usuario.component';

describe('RelUsuarioComponent', () => {
  let component: RelUsuarioComponent;
  let fixture: ComponentFixture<RelUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
