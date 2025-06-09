import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoNotificacionesComponent } from './listado-notificaciones.component';

describe('ListadoNotificacionesComponent', () => {
  let component: ListadoNotificacionesComponent;
  let fixture: ComponentFixture<ListadoNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoNotificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
