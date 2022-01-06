import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: 'add-product.component.html',
  styleUrls: [ 'add-product.component.scss' ],
})

export class AddProductComponent implements OnInit {
  public formGroup = new FormGroup({
    date: new FormControl(''),
    name: new FormControl(''),
    weightInGrams: new FormControl(null),
    price: new FormControl(null),
    number: new FormControl(null),
  });
  constructor() { }

  ngOnInit() { }

  openForm(): void {}

  submit(): void {
    console.log(this.formGroup.value);
  }
}