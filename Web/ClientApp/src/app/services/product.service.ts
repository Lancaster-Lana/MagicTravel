import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Product } from "../models/product.model";

const productsUrl = "/api/products";
const categoryUrl = "/api/products/categories";

@Injectable()//{ providedIn: 'root' })
export class ProductService {

  productsAll: Observable<Product[]>; //singleton instance
  productsFiltered: Observable<Product[]>; //singleton instance

  errorMsg: string = null;

  public categories: Observable<string[]>;
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(categoryUrl);//.subscribe(response => cats = response);
  }

  //private filterObject = new Filter();
  //get filter(): Filter {
  //  return this.filterObject;
  //}

  //private paginationObject = new Pagination();
  //get pagination(): Pagination {
  //  return this.paginationObject;
  //}

  constructor(private http: HttpClient) {
    //this.filter.category = ""; //to be removed
    //this.filter.related = true;

    //Fill all categories list for the first time
    this.categories = this.getCategories();//init once

    //Fill all products, non-cached for the first time
    this.productsAll = this.getAllProducts();
  }

   getAllProducts(): Observable<Product[]> {
    let result = this.http.get<Product[]>(productsUrl);
    return result;
  }

  //Get filtered products list
  //1. filtered by category if 'category' != null 
  //2. cached list if 'cached = true'
  //3. refreshed list, if 'cached = false'
  getProducts(category: string = null, getAll: boolean = false, useCach: boolean = true) //: Observable<Product[]>
  {
    //Set filtration category. NOTE: to be moved to categoryFilter.component only
    if (typeof category != 'undefined' && category != "")
      //this.filter.category = category;

    //filter "all cached" products by category
    if (useCach) {
      if (category) //&& this.productsAll
      {
        //this.productsAll.lift(filter((r) => { }));
        this.productsFiltered = this.productsAll.pipe(
          map(arr =>
           arr.filter(prod => prod.category != null && prod.category.trim().toLowerCase().startsWith(category.toLowerCase()))
        ));
      }
      else {
        //return all products if category "ALL" (category=null)
        this.productsFiltered = this.productsAll;
      }
    }
    else {
      //Retrieve filtered products just from the "server" (by filtration url)
      let url = productsUrl;

      //Use filtration of 'categories component'
      //url += "?related=" + this.filter.related;

      if (!getAll) {
        //if (this.filter.category) {
        //  url += "&category=" + category;
        //}
        //if (this.filter.search) {
        //  url += "&search=" + this.filter.search;
        //}
        //products.filter(prod => {
        //  return prod.name.toLowerCase().includes(searchText);
        //});
      }
      this.productsFiltered = this.http.get<Product[]>(url);
    }
    return this.productsFiltered;
  }

  getProduct(id) {
    return this.http.get<Product>(productsUrl + "/" + id);
  }

  createProduct(prod: Product) //File
  {
    this.errorMsg = null;

    let data = {
      name: prod.name,
      category: prod.category,
      description: prod.description,
      imageName: prod.imageName,
      imageFileString: prod.imageFileString,//imageBlob: prod.imageBlob, //File
      price: prod.price,
      //supplier: prod.supplier ? prod.supplier.supplierId : 0
    }

    //Note: image file in formData
    //const formdata: FormData = new FormData();
    //if(image != null)
    //  formdata.append('file', image);

    let cpHeaders = new HttpHeaders().set('Accept', 'application/json').set('observe', 'body');////new Headers({ 'Content-Type': 'application/json' });
    let options = { headers: cpHeaders };
    let result = this.http.post<Product>(productsUrl + "/create", data, options)
      .subscribe(
        data => {
          // If product created successfully -> REFRESH its id
          prod.productId = data.productId;
          //REFRESH the list of products
          this.productsAll = this.getAllProducts(); //Triggering refresh all products list cach
        },
        err => {
          this.errorMsg = err ? err.Error : null;
        });

    return result;
  }

  updateProduct(prod: Product) {
    this.errorMsg = null;

    let data = {
      productId: prod.productId,
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      imageName: prod.imageName,
      imageFileString: prod.imageFileString,//imageBlob: prod.imageBlob, //File
      //supplier: prod.supplier ? prod.supplier.supplierId : 0
    };

    let cpHeaders = new HttpHeaders().set('Accept', 'application/json').set('observe', 'body');//{ 'Content-Type': 'application/json' }
    let options = { headers: cpHeaders };
    var result = this.http.put<Product>(productsUrl + "/update", data, options)
      .subscribe(
        data => {
          // product updated  successfully -> REFRESH the list of products
          this.productsAll = this.getAllProducts(); //Triggering refresh all products list cach
        },
        err => {
          this.errorMsg = err ? err.Error : null;
        });
    return result;
  }

  deleteProduct(id: number): Observable<boolean> {
    //let result = false;

    //Triggering refresh all products list cach
    this.http.delete(productsUrl + "/" + id)
      .subscribe((isDeleted: boolean) => {
        //! if ok - REFRESH the list of products
        //result = isDeleted;
        //if (isDeleted)
        this.productsAll = this.getAllProducts();

        return of(isDeleted);
      });

    return of(false);
  }
}
