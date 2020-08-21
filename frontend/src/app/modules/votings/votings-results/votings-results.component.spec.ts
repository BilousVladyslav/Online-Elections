import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingsResultsComponent } from './votings-results.component';

describe('VotingsResultsComponent', () => {
  let component: VotingsResultsComponent;
  let fixture: ComponentFixture<VotingsResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingsResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
