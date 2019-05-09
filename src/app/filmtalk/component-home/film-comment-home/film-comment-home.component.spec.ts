import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmCommentHomeComponent } from './film-comment-home.component';

describe('FilmCommentHomeComponent', () => {
  let component: FilmCommentHomeComponent;
  let fixture: ComponentFixture<FilmCommentHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilmCommentHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilmCommentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
