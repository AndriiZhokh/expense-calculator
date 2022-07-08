import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { StorageService } from './services/storage.service';
import { parseCSV, parseDates } from './utils/utils';
import { Product } from './interfaces/product';
import { Months } from './enums/month';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'expense-calculator';
  private currentMoment = new Date();
  private currentYear: number = this.currentMoment.getFullYear();
  private currentMonth: number = this.currentMoment.getMonth();

  public products$: Observable<Product[]> = this.storageService.getProducts();
  public years$: Observable<number[]> = this.storageService.getYears();
  public months$: Observable<string[]> = this.storageService.getMonths(this.currentYear).pipe(
    map((months: number[]) => months.map(month => Months[ month ]))
  );
  public dates$: Observable<number> = this.storageService.getDates(this.currentYear, this.currentMonth);

  constructor(
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.storageService.getProductListForTheMonth().subscribe();
    this.storageService.getMonths(this.currentYear).subscribe();
  }

  onSubmit(): void {
    const input = document.getElementById('csvFile') as HTMLInputElement;
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      const resultObj = parseDates(parseCSV(result) as { date: any }[]);
      
      console.log(resultObj);
      this.storageService.addSortProductsByMonthsAndDays(resultObj as Product[]);
    }

    if (input.files?.length) {
      console.log(input.files[0]);
      const file = input.files[0];
      reader.readAsText(file);
    }
  }

  onYearClick(year: number): void {
    this.currentYear = year;

    this.months$ = this.storageService.getMonths(year).pipe(
      map((months: number[]) => months.map(month => Months[ month ]))
    );
  }

  // TODO: Method doesn't work
  onMonthClick(month: string): void {
    this.currentMonth = Object.values(Months).indexOf(month);

    this.dates$ = this.storageService.getDates(this.currentYear, this.currentMonth);
  }
}
