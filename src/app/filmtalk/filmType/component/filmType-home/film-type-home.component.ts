import { Component, OnInit } from '@angular/core';
import {Product, ProductService} from "../../../filmPages/service/product.service";
declare var $: any;

@Component({
  selector: 'app-film-type-home',
  templateUrl: './film-type-home.component.html',
  styleUrls: ['./film-type-home.component.css']
})
export class FilmTypeHomeComponent implements OnInit {
  // 定义一个数组，接收从服务里面传来的参数
  public  products: Product[];
  public  imgUrl = 'http://placehold.it/320×150';
  setInput: any = {'opacity': 0};     // 搜索框样式绑定
  content: string = null;            // 根据动态标题/负责人查询

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.products = this.productService.getProduct();
  }

  hideInput(): void {
    if ($('#searchTitle002').val() === '') {
      this.setInput = {
        'opacity': 0
      };
    }
  }

  /**
   * 通过任务标题/负责人搜索
   */
  searchTitle(): void {
    if ($('#searchTitle002').css('opacity') === 0) {
      this.setInput = {
        'width': '150px',
        'opacity': 1
      };
      $('#searchTitle002').focus();
    } else {
      if (this.content.replace(/^\s+|\s+$/g, '') === '') {
        this.content = null;
      }
      // this.getMessageData();
    }
  }

  showTab(){

  }

}
