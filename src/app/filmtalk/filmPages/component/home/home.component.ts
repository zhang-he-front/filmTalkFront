import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Product, ProductService} from "../../service/product.service";
import {FilmpageHomeService} from "../../service/filmpage-home.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // 定义一个数组，接收从服务里面传来的参数
  public  products: Product[];
  public  imgUrl = 'http://placehold.it/320×150';

  array = ["assets/img/film/film1.webp", "assets/img/film/film1.webp", "assets/img/film/film1.webp","assets/img/film/film1.webp"];

  constructor(private http: HttpClient,
              private filmpageHomeService: FilmpageHomeService,
              private productService: ProductService) { }


  ngOnInit() {
    this.products = this.productService.getProduct();

    this.reqData();

    // this.filmpageHomeService.getPageData().subscribe(response => {
    //   console.log(response);
    // });
  }


  reqData() { // 向后台请求数据
    var url = '/filmTalk_war_exploded/filmTalk/film/query';
    // 后面的异步请求中不可直接使用this，在异步中使用的this
    // 和这里的this不同
    var _that = this;
    this.http.post(url,"").subscribe(function (data) {//请求成功的回调函数
      console.log(data);
      // _that.list = JSON.parse(data['_body']);
      // _that.list =_that.list['result'];

    }, function (err) {// 请求失败的回调函数
      console.log(err);
    });
  }

}
