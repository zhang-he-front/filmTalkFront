import { Component, OnInit } from '@angular/core';
import {FilmpageHomeService} from "../../../filmPages/service/filmpage-home.service";
import {Film} from "../../../../shared/model/film";
declare var $: any;

@Component({
  selector: 'app-film-comment-home',
  templateUrl: './film-comment-home.component.html',
  styleUrls: ['./film-comment-home.component.css']
})
export class FilmCommentHomeComponent implements OnInit {
  films: Film[] = [];
  filmsData: Film[] = [];
  messageTopChk: boolean = false;    // 任务转动态checkbox是否选中

  constructor(private filmpageHomeService: FilmpageHomeService) { }

  ngOnInit() {
    this.getPageData();
  }

  //获取数据
  getPageData() {
    this.filmpageHomeService.getPageData().subscribe(res => {
      console.log(res);
      this.dealWithData(res.data);
    });
  }

  //处理数据
  dealWithData(res: any) {
    // 正在上映，最近热门
    this.filmsData = [];
    for (let i = 0; i < res.recentHotArr.length; i++) {
      let f = new Film();
      f.oid = res.recentHotArr[i].oid;
      f.film_name = res.recentHotArr[i].filmName;
      f.filmType = res.recentHotArr[i].filmType;
      f.image_path = res.recentHotArr[i].imagePath;
      f.film_language = res.recentHotArr[i].language;
      f.location = res.recentHotArr[i].location;
      f.show_time = res.recentHotArr[i].showTime;
      f.hour_length = res.recentHotArr[i].hour;
      f.isShowOperate = false;
      f.isCollect = false;
      f.isPraise = false;
      f.isPraiseNumb = true;
      f.praiseNumb = 10;
      f.numberReply = 10;
      f.film_staus = 0;

      if(res.recentHotArr[i].star != "0"){
        f.star = res.recentHotArr[i].star.split(".")[0] + "." + res.recentHotArr[i].star.split(".")[1].substring(0, 1)
      } else {
        f.star = "0";
      }
      this.filmsData.push(f);
    }
    this.films = this.filmsData;
  }

  messageSpecial(film: Film): void {

  }

  /**
   * 判断是否点赞更改图标（点赞）
   */
  messagePraise(film: Film): void {

  }

  /**
   * 是否显示动态评论区
   */
  isShowReply(film: Film): void {


  }

  /**
   * css效果：鼠标移动到某一动态块，隐藏操作按钮
   */
  isNotShowOperate(film: Film): void {
    film.isShowOperate = true;
    $('#commentText-' + film.oid).css('border-left', '2px solid #fff');
  }

  /**
   * css效果：鼠标移动到某一动态块，显示操作按钮
   */
  isShowOperate(film: Film): void {
    if (!this.messageTopChk) {
      film.isShowOperate = false;
      $('#commentText-' + film.oid).css('border-left', '2px solid #329cc6');
    }
  }

  /**
   * css效果：鼠标移动到某一动态块，显示操作按钮
   */
  // isShowOperate(message: Message): void {
  //   if (!this.messageTopChk) {
  //     message.isShowOperate = false;
  //     $('#commentText-' + message.OID).css('border-left', '2px solid #329cc6');
  //   }
  // }

}
