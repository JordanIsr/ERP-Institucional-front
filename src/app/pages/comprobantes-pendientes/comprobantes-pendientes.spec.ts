import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobantesPendientes } from './comprobantes-pendientes';

describe('ComprobantesPendientes', () => {
  let component: ComprobantesPendientes;
  let fixture: ComponentFixture<ComprobantesPendientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprobantesPendientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprobantesPendientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
