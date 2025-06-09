import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenFinalComponent } from './resumen-final.component';

describe('ResumenFinalComponent', () => {
  let component: ResumenFinalComponent;
  let fixture: ComponentFixture<ResumenFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenFinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
