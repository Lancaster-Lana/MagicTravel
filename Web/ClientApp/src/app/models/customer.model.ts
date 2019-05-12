import { Address } from "./address.model";

export class Customer {

  constructor(
    public id: number = 0,
    public name: string = "",
    public email: string = "",
    public phoneNumber: string = "", //regexpr
    public address: Address,
    //City { get; set; }
    public gender: boolean = false,//male =0 , female = 1;
    public dateCreated: Date,
    public dateModified: Date
    //Orders { get; set; }
  ) { }
}
