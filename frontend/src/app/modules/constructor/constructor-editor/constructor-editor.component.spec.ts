import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorEditorComponent } from './constructor-editor.component';

describe('ConstructorEditorComponent', () => {
  let component: ConstructorEditorComponent;
  let fixture: ComponentFixture<ConstructorEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructorEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
