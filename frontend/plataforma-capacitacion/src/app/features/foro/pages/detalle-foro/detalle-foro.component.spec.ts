import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleForoComponent } from './detalle-foro.component';

describe('DetalleForoComponent', () => {
  let component: DetalleForoComponent;
  let fixture: ComponentFixture<DetalleForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleForoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
