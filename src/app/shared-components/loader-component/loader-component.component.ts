import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loader-component',
  templateUrl: './loader-component.component.html',
  styleUrls: ['./loader-component.component.scss']
})
export class LoaderComponentComponent implements OnInit {

  @Input() loadingStatus;
  @Input() forWhat;

  constructor() { }

  ngOnInit(): void {
  }

}
