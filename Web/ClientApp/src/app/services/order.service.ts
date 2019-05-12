import { Injectable, OnInit } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";
import { Observable, of } from "rxjs";
import { filter } from "rxjs/operators";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from "../models/order.model";
import { AuthService } from "./auth.service";

const ordersUrl = "/api/orders";

@Injectable()//{ providedIn: 'root' })
export class OrderService
{
  public order: Order;// current session order
  public orders: Observable<Order[]>;

  errorMsg: string = null;

  constructor(private http: HttpClient, router: Router, authServ: AuthService) {
    router.events.pipe(
      filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        if (router.url.startsWith("/checkout") && this.order.name != null && this.order.address != null) {
          authServ.storeSessionData("checkout", {
            name: this.order.name,
            address: this.order.address,
            cardNumber: this.order.payment.cardNumber,
            cardExpiry: this.order.payment.cardExpiry,
            cardSecurityCode: this.order.payment.cardSecurityCode
          });
        }
      });

    /*
    authServ.getSessionData("checkout").subscribe(data => {
      if (data != null) {
        console.log("checkout data : " + data);
        this.order = new Order(); //TODO: default init
        this.order.name = data.name;
        this.order.address = data.address;
        this.order.payment.cardNumber = data.cardNumber;
        this.order.payment.cardExpiry = data.cardExpiry;
        this.order.payment.cardSecurityCode = data.cardSecurityCode;
      }
    });*/

    if (this.order == null) {
      this.order = new Order();
    }

    //Load all orders info. TODO: paging
    this.orders = this.getOrders();
  }

  /*
  getOrder(id: number): Observable<IOrderDetail> {
    //let url = this.ordersUrl + '/api/v1/o/orders/' + id;

    return this.http.get(ordersUrl).map((response: Response) => {
      return response.json();
    });
  }*/

  getOrders(): Observable<Order[]>
  {
    let result = this.http.get<Order[]>(ordersUrl);
    return result;
  }

  createOrder(order : Order = this.order)
  {
    console.log('Order price' + order.payment.total);
    this.errorMsg = order.selectedProducts.length == 0 ? "There must be at least one product selected": null;
    //if (this.errorMsg)
    //  return;

    let cpHeaders = new HttpHeaders().set('Accept', 'application/json').set('observe', 'body');//let cpHeaders = new Headers({ 'Content-Type': 'application/json' });

    let options = { headers: cpHeaders };
    let result = this.http.post<Order>(ordersUrl + "/create", order, options)
      .subscribe(
        data => {
          // If order created successfully -> REFRESH its id
          //order.id = data.id;
          //REFRESH the list of orders
          //this.orders = this.getOrders(); //Triggering refresh all  list cach
        },
        err => {
          this.errorMsg = err ? err.Error : null;
        });
    return result;
  }

  updateOrder(order: Order) {
    let cpHeaders = new HttpHeaders().set('Accept', 'application/json').set('observe', 'body');//let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
    let options = { headers: cpHeaders };
    var result = this.http.put<Order>(ordersUrl + "/update", order, options)
      .subscribe(
        data => {
          // product updated  successfully -> REFRESH the list of products
          this.orders = this.getOrders(); //Triggering refresh all products list cach
        },
        err => {
          this.errorMsg = err ? err.Error : null;
        });
    return result;
  }

  //Assign supplier, delivery manager for the order, send notification to client, etc.
  shipOrder(order: Order) {
    order.shipped = true;
    this.updateOrder(order); //TODO: send notification 'email' to user
    /*
    this.orders.subscribe(res => {
      let o = res.find(o => o.orderId == order.orderId);
      o.shipped = true;
     });*/
  }

  submit()
  {
    this.createOrder();
  }

  clear() {
    this.order.clear();
  }
}
