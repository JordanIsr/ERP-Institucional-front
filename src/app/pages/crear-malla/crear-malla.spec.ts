import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMalla } from './crear-malla';

describe('CrearMalla', () => {
  let component: CrearMalla;
  let fixture: ComponentFixture<CrearMalla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMalla]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMalla);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
