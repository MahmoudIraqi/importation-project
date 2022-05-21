import {Component, Input, OnInit} from '@angular/core';
import {distinctUntilChanged, filter} from "rxjs/operators";
import {InputService} from "../../services/input.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input() title;
  @Input() bigTitle;
  @Input() smallTitle;
  @Input() havingComment;
  @Input() theCommentMessage;
  currentLang = this.translateService.currentLang ? this.translateService.currentLang : 'en';

  constructor(private inputService: InputService,
              public translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.inputService.getInput$().pipe(
      filter(x => x.type === 'currentLang'),
      distinctUntilChanged()
    ).subscribe(res => {
      this.currentLang = res.payload;
    });
  }

}
