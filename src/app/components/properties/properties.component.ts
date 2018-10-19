import { Component, OnInit, Input, KeyValueDiffers } from '@angular/core';
import { Style } from '../../models/style';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})

export class PropertiesComponent implements OnInit {

  @Input() style : Style;
  differ: any;

  constructor(differs:  KeyValueDiffers) { 
    this.differ = differs.find([]).create();
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    // console.log(changes)
  }

  ngDoCheck() {
    var changes = this.differ.diff(this.style);

    if (changes) {
      changes.forEachChangedItem((elt) => {
        console.log(elt);
      });
    }
  }
}
