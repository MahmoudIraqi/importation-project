import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  onInitStatus = false;
  contentObject = {
    title: 'welcomeTitle',
  };

  constructor() {
  }

  ngOnInit(): void {
    this.onInitStatus = true;
  }

}
