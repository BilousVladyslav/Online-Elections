import { Component, OnInit, Inject } from "@angular/core";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  Year = new Date().getFullYear();

  constructor() { }

  ngOnInit() {}

}