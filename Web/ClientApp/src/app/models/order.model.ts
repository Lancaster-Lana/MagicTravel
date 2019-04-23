import { Address } from "./address.model";

export class Order
{
  id: number = 0;
  name: string = ""; //addresser FIO
  email: string; //email for notification with order\delivery time etc.
  address: Address = new Address(); //set default empty address
  payment: Payment = new Payment();
  selectedProducts: CartLine[];

  submitted: boolean = false;
  shipped: boolean = false;
  orderConfirmation: OrderConfirmation;// = new OrderConfirmation();

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
