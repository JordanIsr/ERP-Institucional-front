import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearMallaRapida } from './crear-malla-rapida';

describe('CrearMallaRapida', () => {
  let component: CrearMallaRapida;
  let fixture: ComponentFixture<CrearMallaRapida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearMallaRapida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearMallaRapida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
