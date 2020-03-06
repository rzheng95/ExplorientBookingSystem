import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {

  @Input() message: string;

  // @Input('message') messageAlias: string; // You can have alias
  // @Input() message: string = 'A default message';


  @Output() greetEvent = new EventEmitter();
  name = 'Richard';
  constructor() { }

  ngOnInit(): void {
  }

  callParentGreet() {
    // notify parent to greet this.name
    this.greetEvent.emit(this.name);
  }
}
