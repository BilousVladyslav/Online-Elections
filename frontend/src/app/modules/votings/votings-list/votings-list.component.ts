import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { L10N_LOCALE, L10nLocale } from "angular-l10n";

@Component({
  selector: 'app-votings-list',
  templateUrl: './votings-list.component.html',
  styleUrls: ['./votings-list.component.css']
})
export class VotingsListComponent implements OnInit {
  @Input() list = [];
  @Input() postfix: string = "";

  constructor(private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
  ) { }

  ngOnInit() {
  }

}
