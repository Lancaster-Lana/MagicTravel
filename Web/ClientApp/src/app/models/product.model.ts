
export class Product {
  constructor(
    public productId?: number,
    public name?: string,
    public category?: string,
    public description?: string,
    public price?: number,
    public imageName?: string,
    public imageFileString?: string, //| Uint8Array 

    //public supplier: Supplier = new Supplier() //TODO: to be assigned after order submitted
    //public ratings?: Rating[]
  ) { }
}

export class ProductSelection {

  constructor(//public cart: CartService,
    public productId?: number,
    public name?: string,
    public price?: number,
    private quantityValue?: number) { }

  get quantity() {
    return this.quantityValue;
  }

  set quantity(newQuantity: number) {
    this.quantityValue = newQuantity;
    //this.cart.update();
  }
}
