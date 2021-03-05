import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = "Products";

  constructor(
    private firestore: AngularFirestore
  ) { }

  create_product(record){
    console.log(record);

    return this.firestore.collection(this.collectionName).add(record);
  }

  read_products(){
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  update_product(recordID, record){
    this.firestore.doc(this.collectionName + "/" + recordID).update(record);
  }

  delete_product(record_id){
    this.firestore.doc(this.collectionName + "/" + record_id).delete();
  }
}
