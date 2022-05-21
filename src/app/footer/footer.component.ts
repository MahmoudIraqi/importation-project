import {Component, HostListener, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {distinctUntilChanged, filter} from "rxjs/operators";
import {InputService} from "../services/input.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  screenWidth;
  socialMediaList = [
    'fab fa-facebook-f',
    'fab fa-twitter',
    'fab fa-youtube',
    'fab fa-instagram'
  ];
  currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';

  constructor(private inputService: InputService,
              public translateService: TranslateService) {
    this.onResize();
  }

  ngOnInit(): void {
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'currentLang'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.currentLang = res.payload;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

}
