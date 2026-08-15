import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParalelosHorarios } from './paralelos-horarios';

describe('ParalelosHorarios', () => {
  let component: ParalelosHorarios;
  let fixture: ComponentFixture<ParalelosHorarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParalelosHorarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParalelosHorarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
