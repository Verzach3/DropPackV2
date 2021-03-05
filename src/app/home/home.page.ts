import { Component } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

interface ProductData {
  Name: string;
  Price: number;
  AliexpressLink: string;
  LinkImagen: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  productList = [];
  productData: ProductData;
  productForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder
  ) {
    this.productData = {} as ProductData;
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      Name: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      AliexpressLink: ['', [Validators.required]],
      LinkImage: ['', [Validators.required]],
    });

    this.firebaseService.read_products().subscribe((data) => {
      this.productList = data.map((e) => {
        return {
          id: e.payload.doc['id'],
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Price: e.payload.doc.data()['Price'],
          AliexpressLink: e.payload.doc.data()['AliexpressLink'],
          LinkImage: e.payload.doc.data()['LinkImage']
        };
      });
    });
  }

  CreateRecord() {
    this.firebaseService.create_product(this.productForm.value)
      .then(resp => {
        //Reset form
        this.productForm.reset();
      })
      .catch(error => {
        console.log(error);
      })
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_product(rowID);
  }

  EditRecord(record){
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditPrice = record.Price;
    record.EditAliexpressLink = record.AliexpressLink;
    record.EditLinkImage = record.LinkImage;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Name'] = recordRow.EditName;
    record['Price'] = recordRow.EditPrice;
    record['AliexpressLink'] = recordRow.EditAliexpressLink;
    record['LinkImage'] = recordRow.EditLinkImage;
    this.firebaseService.update_product(recordRow.id, record);
    recordRow.isEdit = false;
  }
}
