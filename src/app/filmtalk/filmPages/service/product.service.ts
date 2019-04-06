import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
   product1: Product;
   comment1: Comment[];
  // 初始化商品
    private products: Product [] = [
    new Product(1, '第一个商品', 1.99, 3.5, '这是第一个商品,是我在星期五创建的，很开心啊，god', ['电子产品', '硬件折别']),
    new Product(2, '第二个商品', 1.99, 3.5, '这是第二个商品,是我在星期五创建的，很开心啊，god', ['电子产品', '硬件折别']),
    new Product(3, '第三个商品', 1.99, 3.5, '这是第三个商品,是我在星期五创建的，很开心啊，god', ['电子产品', '硬件折别']),
    new Product(4, '第四个商品', 1.99, 3.5, '这是第四个商品,是我在星期五创建的，很开心啊，god', ['电子产品', '硬件折别']),
    new Product(5, '第五个商品', 1.99, 3.5, '这是第五个商品,是我在星期五创建的，很开心啊，god', ['电子产品', '硬件折别']),
    new Product(6, '第六个商品', 1.99, 3.5, '这是第六个商品,是我在星期五创建的，很开心啊，god', ['电子产品', '硬件折别'])
  ];
    // 初始化评论
    private comments: Comment[] = [
      new Comment(1, 1, '2017-2-02 22:22:22', '张三', 3, '东西不错'),
      new Comment(2, 2, '2017-2-02 22:22:22', '李四', 3, '东西不错'),
      new Comment(3, 1, '2017-2-02 23:22:22', '王五', 3, '东西不错'),
      new Comment(4, 2, '2017-2-02 22:22:22', '赵六', 3, '东西还不错'),
    ];
  constructor() { }

  // 得到商品的方法，声明返回值为Product[]
  getProduct(): Product[] {
    return this.products;
  }

  // 通过Id获取某一个方法，声明返回值类型为Product类
  getproduct(id: number): Product {
      console.log('id值为' + id);

      // return this.products.find((product) => product.id === id);
      this.product1 =  this.products.find((product) => product.id === id);
      console.log('查询的结果为' + this.product1);
      return this.product1;
  }
  // 得到商品的评论信息
  getCommentsForProductId(id: number): Comment[] {
      this.comment1 =  this.comments.filter((comment: Comment) => comment.productId === id);
      console.log('comment结果为' + this.comment1);
      return this.comment1;
  }

}
// 自定义商品类
export class Product {
  constructor(
    public id: number,
    public title: string,
    public price: number,
    public rating: number,
    public desc: string,
    public categories: Array<string>
  ) {

  }
}
// 评论类
export class Comment {
  constructor(public id: number,
              public productId: number,
              public timestamp: string,
              public user: string,
              public rating: number,
              public content: string) {
  }
}
