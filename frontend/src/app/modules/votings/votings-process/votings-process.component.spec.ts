import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingsProcessComponent } from './votings-process.component';

describe('VotingsProcessComponent', () => {
  let component: VotingsProcessComponent;
  let fixture: ComponentFixture<VotingsProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingsProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingsProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
