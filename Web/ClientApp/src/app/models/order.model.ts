import { Address } from "./address.model";
import { Customer } from "./customer.model";

export class Order
{
  constructor(
    public id: number = 0,
    public comments: string = "",
    public discount: number = 0,
    public name: string = "", //addresser сustomer FIO
    public email: string ="", //email for notification with order\delivery time etc.
    public address: Address = null, //set default empty address
    public payment: Payment = null,
    //CustomerId: number = 0,
    public customer: Customer = null,
    public selectedProducts: CartLine[] = null,

    public submitted: boolean = false,
    public shipped: boolean = false,
    public orderConfirmation: OrderConfirmation = null) {
  }
  // = new OrderConfirmation();

  clear() {
    this.name = null;
    this.address = null;
    this.payment = new Payment();
    this.selectedProducts = null;
    this.submitted = false;
    //this.cart.clear();
  }
}

export class OrderConfirmation {

  constructor(
    public orderId: number,
    public authCode: string,
    public amount: number) { }
}

export class CartLine
{
  constructor(
    private productId: number,
    private quantity: number)
  {
  }
}

export class Payment
{
  paymentId: number;
  cardholder: string;
  cardNumber: string;
  cardExpiry: string;
  cardSecurityCode: number;
  authCode: string;

  total: number; //common price
}
