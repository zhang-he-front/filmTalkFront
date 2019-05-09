import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPartHomeComponent } from './my-part-home.component';

describe('MyPartHomeComponent', () => {
  let component: MyPartHomeComponent;
  let fixture: ComponentFixture<MyPartHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPartHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPartHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
