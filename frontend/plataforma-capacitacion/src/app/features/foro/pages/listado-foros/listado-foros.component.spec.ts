import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoForosComponent } from './listado-foros.component';

describe('ListadoForosComponent', () => {
  let component: ListadoForosComponent;
  let fixture: ComponentFixture<ListadoForosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoForosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoForosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
