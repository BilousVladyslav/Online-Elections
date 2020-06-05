import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorRedactorComponent } from './constructor-redactor.component';

describe('ConstructorRedactorComponent', () => {
  let component: ConstructorRedactorComponent;
  let fixture: ComponentFixture<ConstructorRedactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructorRedactorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorRedactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
