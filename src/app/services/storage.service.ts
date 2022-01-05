import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { getDocumentData } from '../utils/utils';
import { Product } from '../interfaces/product';

@Injectable({providedIn: 'root'})
export class StorageService {
  readonly projectCollection = this.afs.collection('expenseCalculator');
  readonly datesCollection = this.projectCollection.doc('user_1').collection('dates');

  constructor(private afs: AngularFirestore) { }

  getProducts(): Observable<Product[]> {
    return this.afs.collection<Product>('expenseCalculator/user_1/products', ref => ref.orderBy('date', 'asc')).stateChanges().pipe(
      map(data => data.map(item => item.payload.doc.data())),
      map(products => products.map((product: Product) => ({...product, date: new Date(product.date)}))),
    );
  }

  addProducts(productList: any[]) {
    productList.forEach(product => this.afs.collection('expenseCalculator/user_1/products').add(product));
  }

  addSortProductsByMonthsAndDays() {

  }
  
}