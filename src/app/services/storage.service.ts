import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { getDocumentData } from '../utils/utils';
import { Product } from '../interfaces/product';

@Injectable({providedIn: 'root'})
export class StorageService {
  readonly projectCollection = this.afs.collection('expenseCalculator');
  readonly datesCollection = this.projectCollection.doc('user_1').collection('dates');

  constructor(private afs: AngularFirestore) { }

  getYears(): Observable<number[]> {
    return this.projectCollection.doc('user_1').collection('years').snapshotChanges().pipe(
      map(yearsDocs => yearsDocs.map(doc => doc.payload.doc.data().year)),
      tap(console.log),
      take(1),
    );
  }

  getProducts(): Observable<Product[]> {
    return this.afs.collection<Product>('expenseCalculator/user_1/products', ref => ref.orderBy('date', 'asc')).stateChanges().pipe(
      map(data => data.map(item => item.payload.doc.data())),
      map(products => products.map((product: Product) => ({...product, date: new Date(product.date)}))),
    );
  }

  addSortProductsByMonthsAndDays(products: Product[]) {
    products.forEach(product => {
      const date = new Date(product.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      this.projectCollection
        .doc('user_1')
        .collection('years')
        .doc(`${year}`)
        .collection('months')
        .doc(`${month}`)
        .collection('dates')
        .doc(`${day}`)
        .set(product);
    });
  }
  
}