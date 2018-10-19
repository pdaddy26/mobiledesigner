import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter, SimpleChange } from '@angular/core';
import * as interact from 'interactjs';
import { v4 as uuid } from 'uuid';
import { Style } from 'src/app/models/style';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit {

  DATA_DATEX_ID : string = "data_datex_id";

  // Reference to the canvas container
  @ViewChild('canvas') canvas : ElementRef;

  // All children of the canvas (only last elements)
  canvasChildren: Array<HTMLElement> = [];

  //style map between element and style
  elementStyleMap: Map<string, Style> = new Map<string, Style>();

  // style for the current selected element
  currentStyle: Style = new Style();

  constructor(private render:Renderer2) { 

  }

  ngOnInit() {
    this.findAllChildren(this.canvas.nativeElement);
    this.addEventListeners();
    this.addIds();
  }

  ngOnDestroy() {
    // need to unlisten
  }

  addIds() {
    this.canvasChildren.forEach(element => {
      let id = element.getAttribute(this.DATA_DATEX_ID);
      if(id === null) {
        id = uuid();
        this.render.setAttribute(element, this.DATA_DATEX_ID, id;
      }
    });
  }

  findAllChildren(element) {
    if(element.children.length == 0) {
      this.canvasChildren.push(element);
    }
    else {
      let children = element.children;
      for(let i=0;i<children.length;i++) {
        this.findAllChildren(children[i]);
      }
    }
  }

  addEventListeners() {
    this.canvasChildren.forEach(element => {
      this.render.listen(element, 'click', this.onClick.bind(this));
      
    });
  }

  onClick(ev) {
    let element = ev.srcElement;
    this.canvasChildren.forEach(element => {
      this.render.removeClass(element, "selected");
    })
    this.render.addClass(ev.srcElement, "selected");


    let elementId = ev.srcElement.attributes[this.DATA_DATEX_ID].nodeValue;
    let style = this.elementStyleMap.get(elementId);
    if(style === undefined) {
      style = new Style();
      this.elementStyleMap.set(elementId, style);
    }

    this.currentStyle = style;
  }

  ngOnChanges(changes) {
    // console.log(changes)
  }
}
