import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {CardsList, ServicesPerAdminAfterIntegrating} from "../../../utils/common-models";

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnChanges {
  @Input() data: ServicesPerAdminAfterIntegrating[];
  @Input() serviceTypeId: number;

  constructor() {
  }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
  }

}
