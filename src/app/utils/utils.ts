import { DocumentChangeAction } from '@angular/fire/compat/firestore';

export const getDocumentData  = (document: DocumentChangeAction<any>) => {
  return document.payload.doc.data();
}

export const parseCSV = (result: string | ArrayBuffer | null | undefined) => {
  return result?.toString()
    .split('\n')
    .map(item => item.split(','))
    .filter(item => item[0] !== 'November')
    .filter(item => item[0] !== 'December')
    .filter(item => item[1] !== '')
    .map(array => array.reduce((res: any, item, index) => {
      switch (index) {
        case 0:
          res['date'] = item;
          return res;
        case 1:
          const re = /\s+(?=\d)/;
          const name = item.split(re)[0];
          const weight = item.split(re)[1];
          res['name'] = name;
          if (weight) {
            res['weightInGrams'] = Number(weight.slice(0, -1))
          }
          return res;
        case 2:
          res['price'] = Number(item);
          return res;
        case 3:
          res['number'] = item ? Number(item) : 1;
          return res;
        case 4:
          res['total'] = res.price * res.number;
          return res;
        default:
          return res;
      }
    }, {}))
}

export const parseDates = (data: { date: any }[]) => {
  let tempDate: string = '';

  for (let index = 0; index < data.length; index++) {
    if (data[index].date) {
      tempDate = data[index].date;
    }
    data[index].date = new Date(tempDate).getTime();
  }
  return data;
}
