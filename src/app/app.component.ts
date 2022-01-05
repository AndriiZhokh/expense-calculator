import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from './services/storage.service';
import { parseCSV, parseDates } from './utils/utils';
import { Product } from './interfaces/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'expense-calculator';
  public products$: Observable<Product[]> = this.storageService.getProducts();

  constructor(
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    const input = document.getElementById('csvFile') as HTMLInputElement;
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      const resultObj = parseDates(parseCSV(result) as { date: any }[]);
      
      this.storageService.addProducts(resultObj);
      console.log(resultObj);
    }

    if (input.files?.length) {
      console.log(input.files[0]);
      const file = input.files[0];
      reader.readAsText(file);
    }
  }
}
