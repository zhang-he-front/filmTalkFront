import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmRepostComponent } from './film-repost.component';

describe('FilmRepostComponent', () => {
  let component: FilmRepostComponent;
  let fixture: ComponentFixture<FilmRepostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilmRepostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmRepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
