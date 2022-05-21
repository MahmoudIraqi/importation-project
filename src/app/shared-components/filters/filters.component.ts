import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FormService} from '../../services/form.service';
import {distinctUntilChanged, filter} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {InputService} from "../../services/input.service";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnChanges {

  @Input() filterData;
  @Input() removeFilterKey;
  filterRow = [];
  keyForFilter;
  keyWordsForFilter;
  keysForTrackType;
  keysForTrackTypeList;
  @Output() selectedFilteredData = new EventEmitter();

  constructor(private getService: FormService,
              private inputService: InputService,) {
  }

  ngOnChanges() {
    if (this.removeFilterKey) {
      this.keyWordsForFilter = '';
    }
  }

  ngOnInit(): void {
  }

  setTheFilteredData() {
    this.selectedFilteredData.emit({
      keyForFilter: this.keyForFilter,
      keyWordsForFilter: this.keyWordsForFilter,
      filterRow: this.filterRow
    });
  }

  addFilteredRow() {
    this.filterRow.push({columnName: this.keyForFilter.name, keyword: this.keyWordsForFilter});
    this.keyForFilter = '';
    this.keyWordsForFilter = '';

    this.setTheFilteredData();
  }

  removeKeywordFromFilter(i) {
    this.filterRow.splice(i);

    this.setTheFilteredData();
  }

}
