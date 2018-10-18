import { Component, OnInit, Input } from '@angular/core';
import { Style } from '../../models/style';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})

export class PropertiesComponent implements OnInit {

  @Input() style : Style;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    console.log(changes)
  }

}
