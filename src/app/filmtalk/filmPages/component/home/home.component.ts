import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product, ProductService} from "../../service/product.service";
import {FilmpageHomeService} from "../../service/filmpage-home.service";
import {Film} from "../../model/film";

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // 定义一个数组，接收从服务里面传来的参数
  public products: Product[];
  public imgUrl = 'http://placehold.it/320×150';
  futureArr: any[] = []; //即将上映
  likeArr: any[] = []; //猜你喜欢
  nowArr: any[] = []; //正在热播
  recentHotArr: any[] = []; //最近热门

  array = ["assets/img/film/film1.webp", "assets/img/film/film1.webp", "assets/img/film/film1.webp", "assets/img/film/film1.webp"];

  constructor(private http: HttpClient,
              private filmpageHomeService: FilmpageHomeService,
              private productService: ProductService) {
  }


  ngOnInit() {
    this.products = this.productService.getProduct();
    this.getPageData();
  }

  //获取首页数据
  getPageData() {
    this.filmpageHomeService.getPageData().subscribe(res => {
      console.log(res);
      this.dealWithData(res);
    });
  }

  //处理数据
  dealWithData(res: any) {
    this.futureArr = [];
    this.likeArr = [];
    this.recentHotArr = [];
    this.nowArr = [];
    let arr = [];
    //即将上映
    for (let i = 0; i < res.futureArr.length; i++) {
      if (i < 7) {
        this.futureArr.push({
          "film_name": res.futureArr[i].filmName,
          "show_time": res.futureArr[i].showTime
        });
      }
    }
    //猜你喜欢
    for (let i = 0; i < res.likeArr.length; i++) {
      if (i < 7) {
        this.likeArr.push({
          "film_name": res.likeArr[i].filmName,
          "star": res.likeArr[i].star.split(".")[0] + "." + res.likeArr[i].star.split(".")[1].substring(0, 1)
        });
      }
    }

    // 正在上映，最近热门
    for (let i = 0; i < res.recentHotArr.length; i++) {
      if (i < 4) {
        let path = "";
        let str = res.recentHotArr[i].imagePath.split("/");
        if (str[3] == "now" || str[3] == "future") {
          path = "assets/img/film/long/" + str[4];
        }
        this.nowArr.push({
          "oid": res.recentHotArr[i].oid,
          "film_name": res.recentHotArr[i].filmName,
          "filmType": res.recentHotArr[i].filmType,
          "image_path": path,  // assets/img/film/film1.webp
          "film_language": res.recentHotArr[i].language,
          "location": res.recentHotArr[i].location,
          "show_time": res.recentHotArr[i].showTime,
          "star": res.recentHotArr[i].star.split(".")[0] + "." + res.recentHotArr[i].star.split(".")[1].substring(0, 1)
        });
      } else if (i >= 4 && i < 10) {
        this.recentHotArr.push({
          "oid": res.recentHotArr[i].oid,
          "film_name": res.recentHotArr[i].filmName,
          "filmType": res.recentHotArr[i].filmType,
          "image_path": res.recentHotArr[i].imagePath,
          "film_language": res.recentHotArr[i].language,
          "location": res.recentHotArr[i].location,
          "show_time": res.recentHotArr[i].showTime,
          "star": res.recentHotArr[i].star.split(".")[0] + "." + res.recentHotArr[i].star.split(".")[1].substring(0, 1)
        });
      }
    }
  }


  //连接后端测试demo
  reqData() { // 向后台请求数据
    var url = '/filmTalk/film/query';
    // 后面的异步请求中不可直接使用this，在异步中使用的this
    // 和这里的this不同
    var _that = this;
    this.http.post(url, "").subscribe(function (data) {//请求成功的回调函数
      console.log(data);
    }, function (err) {// 请求失败的回调函数
      console.log(err);
    });
  }

}
