import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaGrupoUsuariosComponent } from './lista-grupo-usuarios.component';

describe('ListaGrupoUsuariosComponent', () => {
  let component: ListaGrupoUsuariosComponent;
  let fixture: ComponentFixture<ListaGrupoUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaGrupoUsuariosComponent]
    });
    fixture = TestBed.createComponent(ListaGrupoUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
