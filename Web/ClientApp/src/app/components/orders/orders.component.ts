import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStoreManager } from 'src/app/services/local-store-manager.service';
import { AlertService } from 'src/app/services/alert.service';
import { AppTranslationService } from 'src/app/services/app-translation.service';
import { fadeInOut } from '../../services/animations';

@Component({
    selector: 'orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css'],
    animations: [fadeInOut]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  errorReceived: boolean;
  errorMsg: string;

  columns = [];
  orders: Order[];

  editing = {};

  @Input()
  verticalScrollbar: boolean = false;

  @ViewChild('statusHeaderTemplate')
  statusHeaderTemplate: TemplateRef<any>;

  @ViewChild('statusTemplate')
  statusTemplate: TemplateRef<any>;

  @ViewChild('customerTemplate')
  customerTemplate: TemplateRef<any>;

  @ViewChild('commentsTemplate')
  commentsTemplate: TemplateRef<any>;

  @ViewChild('actionsTemplate')
  actionsTemplate: TemplateRef<any>;

  @ViewChild('editorModal')
  editorModal: ModalDirective;

  constructor(
    private service: OrderService,
    private translationService: AppTranslationService,
    private localStorage: LocalStoreManager) 
   // private configurationService: ConfigurationService,
   // private signalrService: SignalrService
  { }

  ngOnInit() {
    //if (this.configurationService.isReady) 
    this.fillOrders();

    //this.signalrService.msgReceived$
    //  .subscribe(x => this.getOrders());

    let gT = (key: string) => this.translationService.getTranslation(key);

    this.columns = [
      //{ prop: "completed", name: '', width: 30, headerTemplate: this.statusHeaderTemplate, cellTemplate: this.statusTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false },
      { prop: 'customerId', name: 'customerId', cellTemplate: this.customerTemplate, width: 200 },
      { prop: 'discount', name: 'discount', cellTemplate: null, width: 500 },
      { prop: 'comments', name: 'comments', cellTemplate: this.commentsTemplate, width: 500 },
      { name: '', width: 80, cellTemplate: this.actionsTemplate, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
    ];
  }

  fillOrders() {
    this.errorReceived = false;

    this.service.getOrders()
      .subscribe(orders =>
      {
        this.orders = orders;
        //this.oldOrders = this.orders;
        //console.log('orders items retrieved: ' + orders.length);
      },
      err => {
        this.errorReceived = true;
        this.errorMsg = err ? err.Error : null;
      });
  }

  ngOnDestroy() {
    //this.saveToDisk();
  }
}
