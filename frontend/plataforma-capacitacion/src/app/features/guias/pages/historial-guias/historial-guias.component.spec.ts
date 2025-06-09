import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialGuiasComponent } from './historial-guias.component';

describe('HistorialGuiasComponent', () => {
  let component: HistorialGuiasComponent;
  let fixture: ComponentFixture<HistorialGuiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialGuiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialGuiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
