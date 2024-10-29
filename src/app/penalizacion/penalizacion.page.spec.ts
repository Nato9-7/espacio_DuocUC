import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PenalizacionPage } from './penalizacion.page';

describe('PenalizacionPage', () => {
  let component: PenalizacionPage;
  let fixture: ComponentFixture<PenalizacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PenalizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
