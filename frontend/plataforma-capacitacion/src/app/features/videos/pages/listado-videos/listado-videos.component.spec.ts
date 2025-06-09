import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoVideosComponent } from './listado-videos.component';

describe('ListadoVideosComponent', () => {
  let component: ListadoVideosComponent;
  let fixture: ComponentFixture<ListadoVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoVideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
