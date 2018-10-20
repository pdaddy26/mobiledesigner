import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter, SimpleChange, KeyValueChangeRecord } from '@angular/core';
import * as interact from 'interactjs';
import { v4 as uuid } from 'uuid';
import { Style } from 'src/app/models/style';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.css']
})
export class DesignerComponent {

  // Custom Data id attribute
  // Each control need a unique ID
  DATA_DATEX_ID: string = "data-datex-id";

  // Reference to the canvas container
  @ViewChild('canvas') canvas: ElementRef;

  // All children of the canvas (only last elements)
  canvasChildren: Array<HTMLElement> = [];

  //style map between element and style
  elementStyleMap: Map<string, Style> = new Map<string, Style>();
  // elementStyleMap = {}

  // style for the current selected element
  currentStyle: Style = new Style();
  currentSelectedElement: Element;

  constructor(private render: Renderer2, private http: HttpClient) {

  }

  ngAfterViewInit() {
    // mimic the template coming from server
    this.http.get("./assets/template.json").toPromise().then((template: any)=> {
    //this.http.get("http://localhost:3000/api/app/").toPromise().then((template : any)=> {
      console.log(template);

      // inject the html into the canvas
      //this.render.setProperty(this.canvas.nativeElement, 'innerHTML', template.template);

      // find all children under the canvas
      this.findAllChildren(this.canvas.nativeElement);

      // add behaviour to the children
      this.initChildElements();

      // add drag and reize behaviour
      this.initInteraction();
    })
    .catch(err => {
      console.log(err);
    })
  }

  ngOnDestroy() {
    // need to unlisten
  }

  findAllChildren(element) {
    if (element.children.length == 0) {
      this.canvasChildren.push(element);
    }
    else {
      let children = element.children;
      for (let i = 0; i < children.length; i++) {
        this.findAllChildren(children[i]);
      }
    }
  }

  initChildElements() {
    this.canvasChildren.forEach(element => {

      // Add an ID if missing
      let id = element.getAttribute(this.DATA_DATEX_ID);
      if (id === null) {
        id = uuid();
        this.render.setAttribute(element, this.DATA_DATEX_ID, id);
      }

      // Create a style for that element
      this.elementStyleMap.set(id, new Style());

      // Add click event handler for select
      this.render.listen(element, 'click', this.onClick.bind(this));

      // Add draggable class
      this.render.addClass(element, 'draggable');

    });
  }

  initInteraction() {

    // interact('.draggable')
    //   .draggable({
    //     // enable inertial throwing
    //     inertia: true,
    //     // keep the element within the area of it's parent
    //     restrict: {
    //       restriction: "parent",
    //       endOnly: true,
    //       elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    //     },
    //     // enable autoScroll
    //     autoScroll: true,

    //     // call this function on every dragmove event
    //     onmove: (event) => {
    //       var target = event.target,
    //         // keep the dragged position in the data-x/data-y attributes
    //         x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    //         y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    //       // translate the element
    //       target.style.webkitTransform =
    //         target.style.transform =
    //         'translate(' + x + 'px, ' + y + 'px)';

    //       // update the posiion attributes
    //       target.setAttribute('data-x', x);
    //       target.setAttribute('data-y', y);
    //     },
    //     // call this function on every dragend event
    //     onend: (event) => {
    //     }
    //   })
    //   .resizable({
    //     // resize from all edges and corners
    //     edges: { left: true, right: true, bottom: true, top: true },
    
    //     // keep the edges inside the parent
    //     restrictEdges: {
    //       outer: 'parent',
    //       endOnly: true,
    //     },
    
    //     // minimum size
    //     restrictSize: {
    //       min: { width: 100, height: 50 },
    //     },
    
    //     inertia: true,
    //   })
    //   .on('resizemove', function (event) {
    //     var target = event.target,
    //         x = (parseFloat(target.getAttribute('data-x')) || 0),
    //         y = (parseFloat(target.getAttribute('data-y')) || 0);
    
    //     // update the element's style
    //     target.style.width  = event.rect.width + 'px';
    //     target.style.height = event.rect.height + 'px';
    
    //     // translate when resizing from top or left edges
    //     x += event.deltaRect.left;
    //     y += event.deltaRect.top;
    
    //     target.style.webkitTransform = target.style.transform =
    //         'translate(' + x + 'px,' + y + 'px)';
    
    //     target.setAttribute('data-x', x);
    //     target.setAttribute('data-y', y);
    //   });

  }

  onClick(ev) {
    console.log('click');
    let element = ev.srcElement;
    this.canvasChildren.forEach(element => {
      this.render.removeClass(element, "selected");
    })
    this.render.addClass(ev.srcElement, "selected");


    let elementId = ev.srcElement.attributes[this.DATA_DATEX_ID].nodeValue;
    let style = this.elementStyleMap.get(elementId);

    this.currentStyle = style;
    this.currentSelectedElement = ev.srcElement;
  }

  onStyleChange(styleChangeInfo) {
    console.log(styleChangeInfo);

    this.render.setStyle(this.currentSelectedElement, styleChangeInfo.key, styleChangeInfo.currentValue);
  }


  onBuild() {
    let html = this.canvas.nativeElement.innerHTML;
    console.log(html);

    let body = {
      template: html
    }
    // this.http.post("http://localhost:3000/api/app/build/", body).toPromise()
    // .then((resp) => {
    //   console.log("build resp", resp);
    // })
    // .catch(err => {
    //   console.log("build err", err);
    // })
  }
}
