import { DocumentChangeAction } from '@angular/fire/compat/firestore';

export const getDocData = (docChangeAction: DocumentChangeAction<any>) => {
  return docChangeAction.payload.doc.data();
}
