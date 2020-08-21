import { Component, OnInit, Inject, Input } from '@angular/core';

@Component({
  selector: 'votings-process',
  templateUrl: './votings-process.component.html',
  styleUrls: ['./votings-process.component.css']
})
export class VotingsProcessComponent implements OnInit {
  @Input() question;

  constructor() { }

  ngOnInit() {
  }

}
