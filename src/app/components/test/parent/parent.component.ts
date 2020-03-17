import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  parentMessage = 'A message from the parent';
  form: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      form1: new FormControl(null, {
        validators: [Validators.required]
      }),
      form2: new FormControl(null)
    });

    this.form.valueChanges.subscribe(res => {

      if (this.form.controls.form1.value === 'test') {
        this.form.controls.form2.setValue('Working', {emitEvent: false});
      } else {
        this.form.controls.form2.setValue('', {emitEvent: false});
      }
    });
  }

  greet(name: string) {
    alert(`Hi ${name}. Greeting from parent.`);
  }

}
