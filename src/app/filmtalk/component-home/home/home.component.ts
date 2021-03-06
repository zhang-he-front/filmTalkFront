import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FilmpageHomeService} from '../../service-home/filmpage-home.service';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../../shared/model/user';
import {UserHomeService} from '../../../shared/service/user-home.service';
import {FilmInfoComponent} from "../../../shared/component/film-info/film-info.component";
import {Film} from "../../../shared/model/film";

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('filmInfo') filmInfo: FilmInfoComponent;  // 电影信息子组件
  futureArr: any[] = []; //即将上映
  likeArr: any[] = []; //猜你喜欢
  nowArr: any[] = []; //正在热播
  recentHotArr: any[] = []; //最近热门
  isExistFutureArr: boolean = false;    // 即将上映是否存在电影
  isExistLikeArr: boolean = false;    // 猜你喜欢是否存在电影
  currentUser: User = new User(); //当前登陆者
  isVisible: boolean = false;  //电影详情打开标志

  constructor(private http: HttpClient,
              private filmpageHomeService: FilmpageHomeService,
              private routeInfo: ActivatedRoute,
              private userHomeService: UserHomeService) {
  }

  ngOnInit() {
    this.getPageData();

    this.filmpageHomeService.refreshPageHome.subscribe(val => {
      this.getPageData();
    });

    let userOid = this.routeInfo.snapshot.params['userOid'];
    if(userOid){
      this.getUserByOid(userOid);
    }

  }

  //根据oid获取人员信息
  getUserByOid(userOid: number){
    this.userHomeService.getUserByOid(userOid).subscribe(res => {
      this.currentUser = res.data;
    });
  }

  //获取首页数据
  getPageData() {
    this.filmpageHomeService.getPageData().subscribe(res => {
      // console.log(res);
      this.dealWithData(res.data);
    });
  }

  //处理数据
  dealWithData(res: any) {
    this.futureArr = [];
    this.likeArr = [];
    this.recentHotArr = [];
    this.nowArr = [];

    //即将上映
    if (res.futureArr.length < 1) {
      this.isExistFutureArr = true;
    } else {
      this.isExistFutureArr = false;
      for (let i = 0; i < res.futureArr.length; i++) {
        let a1 = new Date(res.futureArr[i].showTime);
        if (i < 7) {
          this.futureArr.push({
            'oid': res.futureArr[i].oid,
            'film_name': res.futureArr[i].filmName,
            'show_time': a1.getFullYear() + '-' + (a1.getMonth() + 1) + '-' + a1.getDate()
          });
        }
      }
    }


    //猜你喜欢
    if (res.likeArr.length < 1) {
      this.isExistLikeArr = true;
    } else {
      this.isExistLikeArr = false;
      for (let i = 0; i < res.likeArr.length; i++) {
        if (i < 7) {
          this.likeArr.push({
            'oid': res.likeArr[i].oid,
            'film_name': res.likeArr[i].filmName,
            'star': res.likeArr[i].star * 2
          });
        }
      }
    }

    // 正在上映，最近热门
    for (let i = 0; i < res.recentHotArr.length; i++) {
      let a2 = new Date(res.recentHotArr[i].showTime);
      if (i < 4) {
        let path = '';
        let str = res.recentHotArr[i].imagePath.split('/');
        if (str[3] == 'now' || str[3] == 'future') {
          path = 'assets/img/film/long/' + str[4];
        }
        this.nowArr.push({
          'oid': res.recentHotArr[i].oid,
          'film_name': res.recentHotArr[i].filmName,
          'filmType': res.recentHotArr[i].filmType,
          'image_path': path,  // assets/img/film/film1.webp
          'film_language': res.recentHotArr[i].language,
          'location': res.recentHotArr[i].location,
          'show_time': a2.getFullYear() + '-' + (a2.getMonth() + 1) + '-' + a2.getDate(),
          'hour': res.recentHotArr[i].hour,
          'star': res.recentHotArr[i].star * 2
        });
      } else if (i >= 4 && i < 10) {
        this.recentHotArr.push({
          'oid': res.recentHotArr[i].oid,
          'film_name': res.recentHotArr[i].filmName,
          'filmType': res.recentHotArr[i].filmType,
          'image_path': res.recentHotArr[i].imagePath,
          'film_language': res.recentHotArr[i].language,
          'location': res.recentHotArr[i].location,
          'show_time': a2.getFullYear() + '-' + (a2.getMonth() + 1) + '-' + a2.getDate(),
          'hour': res.recentHotArr[i].hour,
          'star': res.recentHotArr[i].star * 2
        });
      }
    }
  }

  //打开电影信息模态框
  showFilmInfo(filmOid){
    this.isVisible = true;
    this.filmInfo.currentUser = this.currentUser;
    this.filmInfo.getFilmInfo(filmOid);
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.isVisible = false;
  }

  //关闭模态框
  closeModel(str: any) {
    this.handleCancel();
    if(str == 'closeAndRefresh'){
      this.getPageData();
    }
  }

  // 跳转到详情页
  // hrefDetail(film: Film){
  //   this.router.navigate(['/commentDetail',film.oid]);
  // }


  //连接后端测试demo
  reqData() { // 向后台请求数据
    var url = '/filmTalk/film/query';
    // 后面的异步请求中不可直接使用this，在异步中使用的this
    // 和这里的this不同
    var _that = this;
    this.http.post(url, '').subscribe(function (data) {//请求成功的回调函数
      console.log(data);
    }, function (err) {// 请求失败的回调函数
      console.log(err);
    });
  }

}
