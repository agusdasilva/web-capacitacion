import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoGuiasComponent } from './listado-guias.component';

describe('ListadoGuiasComponent', () => {
  let component: ListadoGuiasComponent;
  let fixture: ComponentFixture<ListadoGuiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoGuiasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoGuiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
