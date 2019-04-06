import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmTypeHomeComponent } from './film-type-home.component';

describe('FilmTypeHomeComponent', () => {
  let component: FilmTypeHomeComponent;
  let fixture: ComponentFixture<FilmTypeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilmTypeHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmTypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
