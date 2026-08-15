import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructuraCurricular } from './estructura-curricular';

describe('EstructuraCurricular', () => {
  let component: EstructuraCurricular;
  let fixture: ComponentFixture<EstructuraCurricular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstructuraCurricular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstructuraCurricular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
