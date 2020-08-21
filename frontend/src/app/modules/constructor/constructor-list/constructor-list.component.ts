import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { L10N_LOCALE, L10nLocale } from "angular-l10n";

@Component({
  selector: 'app-constructor-list',
  templateUrl: './constructor-list.component.html',
  styleUrls: ['./constructor-list.component.css']
})
export class ConstructorListComponent implements OnInit {
  @Input() list = [];

  constructor(private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
  ) { }

  ngOnInit() {
  }

}
