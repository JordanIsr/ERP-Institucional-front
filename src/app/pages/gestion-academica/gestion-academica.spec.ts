import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAcademica } from './gestion-academica';

describe('GestionAcademica', () => {
  let component: GestionAcademica;
  let fixture: ComponentFixture<GestionAcademica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAcademica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAcademica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
