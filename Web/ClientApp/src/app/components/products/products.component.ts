import { Component, Input, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProductService } from 'src/app/services/product.service';
import { AlertService, DialogType } from 'src/app/services/alert.service';
import { AppTranslationService } from 'src/app/services/app-translation.service';
import { fadeInOut } from '../../services/animations';
import { Utilities } from 'src/app/services/utilities';

@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css'],
    animations: [fadeInOut]
})
export class ProductsListComponent implements OnInit, OnDestroy {
  columns = [];//displayed columns

  products = [];
  productsCache = [];
  productCount: number = 0;
  selectedCount: { [prodId: number]: number } = {}; //dictionary with selected numbers of products

  editing = {}; //table edit
  productEdit = {};

  isDataLoaded: boolean = false;
  loadingIndicator: boolean = true;
  formResetToggle: boolean = true;

  errorReceived: boolean = false;
  errorMsg: string;

  @Input()
  verticalScrollbar: boolean = false;

  @ViewChild('statusHeaderTemplate')
  statusHeaderTemplate: TemplateRef<any>;

  @ViewChild('statusTemplate')
  statusTemplate: TemplateRef<any>;

  @ViewChild('nameTemplate')
  nameTemplate: TemplateRef<any>;

  @ViewChild('priceTemplate')
  priceTemplate: TemplateRef<any>;

  @ViewChild('descriptionTemplate')
  descriptionTemplate: TemplateRef<any>;

  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;

  @ViewChild('editorModal')
  editorModal: ModalDirective;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: ProductService,
    private alertService: AlertService,
    private translationService: AppTranslationService
    //, private cartServ: CartService//temp cart for ngModel
  )
  {
  }

  ngOnInit() {
   
    this.loadProducts();

    let gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      { prop: "completed", name: '', width: 30, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
      { prop: 'name', name: gT('product.management.Name'), cellTemplate: this.nameTemplate, width: 200 },
      { prop: 'buyingPrice', name: gT('product.management.Price'), cellTemplate: this.priceTemplate, width: 200 },

      { prop: 'description', name: gT('product.management.Description'), cellTemplate: this.descriptionTemplate, width: 500 },
      { name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
    ];
  }

  ngOnDestroy() {
    this.saveToDisk();
  }

  loadProducts() {

    this.errorReceived = false;
    this.loadingIndicator = true;

    let gT = (key: string) => this.translationService.getTranslation(key);

      //return this.prodServ.productsFiltered; //get products filtered by category (prodServ = Mediator)
      this.service.getProducts()
        .subscribe(products => {
          this.refreshDataIndexes(products);
          this.products = products;
          this.productsCache = [...products];
          this.isDataLoaded = true;
          setTimeout(() => { this.loadingIndicator = false; }, 1500);
        },
          err => {
            //this.errorMsg = err ? err.Error : null;
            this.errorReceived = true;
            this.errorMsg = err ? err.Error : null;
          });
    }

  refreshDataIndexes(data) {
    let index = 0;

    for (let i of data) {
      i.$$index = index++;
    }
  }

  onSearchChanged(value: string) {
    this.products = this.productsCache.filter(r => Utilities.searchArray(value, false, r.name, r.description) || value == 'important' && r.important || value == 'not important' && !r.important);
  }

  //showErrorAlert(caption: string, message: string) {
  //  this.alertService.showMessage(caption, message, MessageSeverity.error);
  //}

  addProduct() {
    //this.formResetToggle = true;

    setTimeout(() => {
      this.formResetToggle = true;

      this.productEdit = {};
      this.editorModal.show();
    });
  }

  save() {
    this.productsCache.splice(0, 0, this.productEdit);
    this.products.splice(0, 0, this.productEdit);
    this.refreshDataIndexes(this.productsCache);
    this.products = [...this.products];

    this.saveToDisk();
    this.editorModal.hide();
  }

  updateValue(event, cell, cellValue, row) {
    this.editing[row.$$index + '-' + cell] = false;
    this.products[row.$$index][cell] = event.target.value;
    this.products = [...this.products];

    this.saveToDisk();
  }

  delete(row) {
    this.alertService.showDialog('Are you sure you want to delete the product?',
      DialogType.confirm, () => this.deleteConfirm(row));
  }

  deleteConfirm(row) {
    //this.service.deleteProduct(row);
    this.productsCache = this.productsCache.filter(item => item !== row);
    this.products = this.products.filter(item => item !== row);

    this.saveToDisk();
  }

  getFromDisk() {
    //return this.localStorage.getDataObject(`${ProductsListComponent.DBKeyTodoDemo}:${this.currentUserId}`);
  }

  saveToDisk() {
    //if (this.isDataLoaded)
      //this.localStorage.saveSyncedSessionData(this.productsCache, `${ProductsListComponent.DBKeyTodoDemo}:${this.currentUserId}`);
  }

  /*
  public addToCart(product: Product) {
    this.cartServ.addProduct(product);
    let prodCount = this.cartServ.selections.find(function (ps) {
      return ps.productId == product.productId;
    }).quantity;

    //to display number of units of sertain product
    this.selectedCount[product.productId] = prodCount; //update real amount ordered product
  }*/
}
