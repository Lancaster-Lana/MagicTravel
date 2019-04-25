import { Component, Input, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProductService } from 'src/app/services/product.service';
import { AlertService } from 'src/app/services/alert.service';
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

  productCount: number = 0;
  selectedCount: { [prodId: number]: number } = {}; //dictionary with selected numbers of products

  columns = [];
  products = [];
  editing = {}; //table edit

  productEdit = {};

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

  loadProducts() {
      this.errorReceived = false;

      //return this.prodServ.productsFiltered; //get products filtered by category (prodServ = Mediator)
      this.service.getProducts()
        .subscribe(products => {
          this.products = products;
          //this.oldOrders = this.orders;
          console.log('products items retrieved: ' + products.length);
        },
          err => {
            //this.errorMsg = err ? err.Error : null;
            this.errorReceived = true;
            this.errorMsg = err ? err.Error : null;
          });
    }

  ngOnDestroy() {
    //this.saveToDisk();
  }

  onSearchChanged(value: string) {
    //this.products = this.rowsCache.filter(r => Utilities.searchArray(value, false, r.name, r.description) || value == 'important' && r.important || value == 'not important' && !r.important);
  }

  //showErrorAlert(caption: string, message: string) {
  //  this.alertService.showMessage(caption, message, MessageSeverity.error);
  //}

  addProduct() {
    //this.formResetToggle = false;

    setTimeout(() => {
      //this.formResetToggle = true;

      this.productEdit = {};
      this.editorModal.show();
    });
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
