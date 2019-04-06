import { Component, OnInit } from '@angular/core';
import {Product, ProductService} from "../../../filmPages/service/product.service";

@Component({
  selector: 'app-film-type-home',
  templateUrl: './film-type-home.component.html',
  styleUrls: ['./film-type-home.component.css']
})
export class FilmTypeHomeComponent implements OnInit {
  // 定义一个数组，接收从服务里面传来的参数
  public  products: Product[];
  public  imgUrl = 'http://placehold.it/320×150';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.products = this.productService.getProduct();
  }

}
