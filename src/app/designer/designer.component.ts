import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as interact from 'interactjs';

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent implements OnInit {

  @ViewChild('canvas') canvas : ElementRef;
  canvasChildren: Array<HTMLElement> = [];

  constructor(private render:Renderer2) { }

  ngOnInit() {
    this.findAllChildren(this.canvas.nativeElement);
    this.addEventListeners();
  }

  ngOnDestroy() {
    // need to unlisten
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
    console.log(ev);

    let element = ev.srcElement;
    this.canvasChildren.forEach(element => {
      this.render.removeClass(element, 'selected');
    })
    this.render.addClass(ev.srcElement, "selected");
  }
}
