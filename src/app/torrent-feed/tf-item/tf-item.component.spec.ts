import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TfItemComponent } from './tf-item.component';

describe('TfItemComponent', () => {
  let component: TfItemComponent;
  let fixture: ComponentFixture<TfItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TfItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TfItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
