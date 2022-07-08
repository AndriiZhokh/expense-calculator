import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { getDocumentData } from '../utils/utils';
import { Product } from '../interfaces/product';

@Injectable({providedIn: 'root'})
export class StorageService {
  readonly projectCollection = this.afs.collection('expenseCalculator');

  constructor(private afs: AngularFirestore) { }

  getYearsCollection(userId: string): AngularFirestoreCollection {
    return this.projectCollection.doc(userId).collection('years', ref => ref.orderBy('year', 'asc'));
  }

  getMonthsCollection(yearsDocument: AngularFirestoreDocument): AngularFirestoreCollection {
    return yearsDocument.collection('months', ref => ref.orderBy('month', 'asc'));
  }

  getDatesCollection(monthsDocument: AngularFirestoreDocument): AngularFirestoreCollection {
    return monthsDocument.collection('dates', ref => ref.orderBy('date', 'asc'));
  }

  getYears(): Observable<number[]> {
    return this.getYearsCollection('user_1').snapshotChanges().pipe(
      map(yearsDocs => yearsDocs.map(getDocumentData)),
      map(years => years.map(item => item.year)),
      take(1),
    );
  }

  getMonths(year: number): Observable<any> {
    const yearsDocument = this.getYearsCollection('user_1').doc(`${ year }`);

    return this.getMonthsCollection(yearsDocument).snapshotChanges().pipe(
      map(monthsDocs => monthsDocs.map(getDocumentData)),
      map(months => months.map(item => item.month)),
      take(1),
    );
  }

  getDates(year: number, month: number): Observable<any> {
    const yearsDocument = this.getYearsCollection('user_1').doc(`${ year }`);
    const monthsDocument = this.getMonthsCollection(yearsDocument).doc(`${ month }`);

    return this.getDatesCollection(monthsDocument).snapshotChanges().pipe(
      map(datesDocs => datesDocs.map(getDocumentData)),
      map(dates => dates.map(item => item.date)),
      take(1),
    );
  }

  getProducts(): Observable<Product[]> {
    return this.afs.collection<Product>('expenseCalculator/user_1/products', ref => ref.orderBy('date', 'asc')).stateChanges().pipe(
      map(data => data.map(item => item.payload.doc.data())),
      map(products => products.map((product: Product) => ({...product, date: new Date(product.date)}))),
    );
  }

  getProductListForTheMonth(): Observable<Product[]> {
    return this.projectCollection
      .doc('user_1')
      .collection('years')
      .doc('2022')
      .collection('months')
      .doc('0')
      .collection('dates')
      .snapshotChanges().pipe(
        switchMap(data => {
          const path = `user_1/years/2022/months/0/dates/`;
          const docs = data.map(item => {
            const date = new Date(item.payload.doc.data().date.seconds * 1000).getDate();

            return this.projectCollection.doc(path + date).collection('products').valueChanges().pipe(take(1));
          });

          return combineLatest(docs);
        }),
        map(products => products.reduce((accumulator, product) => ([ ...accumulator, ...product ]), []) as Product[]),
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
        .collection('products')
        .add(product);
    });
  }
  
}
