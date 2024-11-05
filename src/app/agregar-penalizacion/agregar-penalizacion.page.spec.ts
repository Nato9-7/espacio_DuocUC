import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarPenalizacionPage } from './agregar-penalizacion.page';

describe('AgregarPenalizacionPage', () => {
  let component: AgregarPenalizacionPage;
  let fixture: ComponentFixture<AgregarPenalizacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPenalizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
