import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  parentMessage = 'A message from the parent';
  constructor() { }

  ngOnInit(): void {
  }

  greet(name: string) {
    alert(`Hi ${name}. Greeting from parent.`);
  }

}
