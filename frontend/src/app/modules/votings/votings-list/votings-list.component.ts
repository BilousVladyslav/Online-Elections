import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from "rxjs";
import { VotingService } from "src/app/core/services/voting.service";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { L10N_LOCALE, L10nLocale } from "angular-l10n";

@Component({
  selector: 'app-votings-list',
  templateUrl: './votings-list.component.html',
  styleUrls: ['./votings-list.component.css']
})
export class VotingsListComponent implements OnInit {
  @Input() list = [];

  constructor(private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
  ) { }

  ngOnInit() {
  }

}
