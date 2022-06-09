import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: 'add-product.component.html',
  styleUrls: [ 'add-product.component.scss' ],
})

export class AddProductComponent implements OnInit {
  public formGroup = new UntypedFormGroup({
    date: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    weightInGrams: new UntypedFormControl(null),
    price: new UntypedFormControl(null),
    number: new UntypedFormControl(null),
  });
  constructor() { }

  ngOnInit() { }

  openForm(): void {}

  submit(): void {
    console.log(this.formGroup.value);
  }
}