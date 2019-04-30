import { Component, OnInit } from '@angular/core';
import {Film} from "../../model/film";
import {FilmpageHomeService} from "../../../filmtalk/filmPages/service/filmpage-home.service";
import {FilmcommentServiceService} from "../../../filmtalk/filmComment/service/filmcomment.service";
import {isUndefined} from "util";
import {ActivatedRoute} from "@angular/router";
declare var $: any;

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent implements OnInit {
  films: Film[] = [];
  filmsData: Film[] = [];
  messageTopChk: boolean = false;    // 任务转动态checkbox是否选中
  replyDataSet = [];      // 全部评论合集
  replyChildrenDataSet = [];      // 全部评论的回复合集
  isExistFilm: boolean = false;    // 是否存在电影
  filmOid: any;

  constructor(private filmpageHomeService: FilmpageHomeService,
              private filmcommentService: FilmcommentServiceService,
              private routeInfo: ActivatedRoute) { }

  ngOnInit() {
    this.filmOid = this.routeInfo.snapshot.params['filmOid'];
    this.getFilmDataByFilmOid();
  }

  //获取数据
  getFilmDataByFilmOid() {
    this.filmcommentService.getFilmDataByFilmOid(this.filmOid).subscribe(res => {
      console.log(res);
      this.dealWithData(res.data);
    });
  }


  //处理数据
  dealWithData(res: any) {
    if(!isUndefined(res)){
      // if(res.length < 1){
        // this.isExistFilm = true;
        // this.filmsData = [];
      // } else{
        // this.isExistFilm = false;
        // this.filmsData = [];
        // for (let i = 0; i < res.length; i++) {
          this.filmcommentService.getCommentDataByFlmOid(res.oid).subscribe(str => {
            this.replyDataSet = [];
            this.replyChildrenDataSet = [];
            let a = new Date(res.showTime);
            let f = new Film();
            f.oid = res.oid;
            f.film_name = res.filmName;
            f.filmType = res.filmType;
            f.image_path = res.imagePath;
            f.film_language = res.filmLanguage;
            f.location = res.location;
            f.show_time = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate();
            f.hour_length = res.hour;
            f.film_detail = res.filmDetail;
            f.producer = res.producer;
            f.director = res.director;
            f.film_staus = res.filmStatus;
            f.numberReply = res.commentTotal;
            f.isShowCommentFrame = true;
            f.isShowReply = true;
            f.isShowOperate = true;
            f.isCollect = false;
            f.isPraise = false;
            f.isPraiseNumb = true;
            f.isMore = 0;
            // f.praiseNumb = 10;
            if (res.star != "0") {
              f.star = res.star.split(".")[0] + "." + res.star.split(".")[1].substring(0, 1)
            } else {
              f.star = "0";
            }
            // 点赞数初始化
            // if (replyData[j].PRAISENUM > 0) {   // 点赞数大于0
            //   replyData[j].isShowPraise = true;
            // } else {                       // 没有点赞
            //   replyData[j].isShowPraise = false;
            // }

            // console.log(str.data);
            if (f.numberReply > 0 && str.data == null) {
              f.numberReply = 0;
            }
            if (f.numberReply > 0 && str.data != null) {
              for (let x = 0; x < str.data.commentParentVOList.length; x++) {
                let replyData = str.data.commentParentVOList[x];  //一级评论
                this.replyDataSet.push({
                  commentCreateTime: this.timeFormat(replyData.commentCreateTime),
                  commentDetail: replyData.commentDetail,
                  commentatorId: replyData.commentatorId,
                  commentatorName: replyData.commentatorName,
                  num: replyData.num,
                  oid: replyData.oid,
                  filmOid: f.oid,
                  isShowDelete: true,
                  isShowReplyFrame: true,
                  PRAISENUMflag: true
                });
                let child = str.data.commentParentVOList[x].childCommentVOList;  //一级评论的回复
                if (child != null && child.length > 0) {
                  for (let j = 0; j < child.length; j++) {
                    this.replyChildrenDataSet.push({
                      commentDetail: child[j].commentDetail,
                      commentatorName: child[j].commentatorName,
                      nodeParentId: child[j].nodeParentId,
                      commentatorId: child[j].commentatorId,
                      oid: child[j].oid,
                      parentId: child[j].parentId,
                      filmOid: f.oid,
                      replyCreateTime: this.timeFormat(child[j].replyCreateTime),
                      replyPersonName: child[j].replyPersonName,
                      isShowReplyFrame: true,
                      isShowDelete: true,
                      PRAISENUMflag: true
                    });
                  }
                }
              }
            }
            // f.numberReply = this.replyDataSet.length + this.replyChildrenDataSet.length;
            f.numberReply = this.replyDataSet.length;
            let threeReply = this.getThreeReply(res, this.replyDataSet);
            f.threeReply = threeReply;
            f.replyDataSet = this.replyDataSet;
            f.replyChildrenDataSet = this.replyChildrenDataSet;
            this.filmsData.push(f);
          });
        // }
        this.films = this.filmsData;
      // }
    } else{
      this.films = [];
      this.isExistFilm = true;
    }
  }

  /**
   * 获取三条评论的值
   */
  getThreeReply(film: Film, replyData: any): any {
    film.threeReply = [];
    if (replyData.length > 0) {
      let replynumb = 0;
      if (replyData.length > 3) {
        film.isMoreBtn = true;
        replynumb = 3;
      } else {
        film.isMoreBtn = false;
        replynumb = replyData.length;
      }
      for (let i = 0; i < replynumb; i++) {
        let isShowPraise = true;
        // if (replyData[i].PRAISENUM < 1) {
        //   isShowPraise = false;
        // }
        film.threeReply.push({
          commentCreateTime: this.timeFormat(replyData[i].commentCreateTime),
          commentDetail: replyData[i].commentDetail,
          commentatorId: replyData[i].commentatorId,
          commentatorName: replyData[i].commentatorName,
          num: replyData[i].num,
          oid: replyData[i].oid,
          filmOid: replyData[i].filmOid,
          isShowDelete: true,
          isShowReplyFrame: true,
          PRAISENUMflag: true
        });
      }
    }
    return film.threeReply;
  }

  /**
   * 时间格式化（将日期 xxxx-xx-xx xx:xx:xx 格式化为 xxxx-xx-xx xx:xx）
   */
  timeFormat(createtime: string): string {
    if (createtime != null) {
      const date = createtime.split(' ');
      return date[0] + ' ' + date[1].substring(0, 5);
    } else {
      return null;
    }
  }

  /**
   * 动态一级回复框显示和隐藏
   */
  replyMessageIsShow(mreply, film: Film): void {
    film.isShowCommentFrame = true;            // 关闭评论框
    film.replyChildrenDataSet.forEach(      // 所有回复的回复框（二级）
      (x) => x.isShowReplyFrame = true
    );
    const threereply = film.threeReply;
    for (let i = 0; i < threereply.length; i++) {
      if (mreply.oid !== threereply[i].oid) {
        threereply[i].isShowReplyFrame = true;
      }
    }
    const data = film.replyDataSet;
    for (let i = 0; i < data.length; i++) {
      if (mreply.oid !== data[i].oid) {
        data[i].isShowReplyFrame = true;
      }
    }
    if (mreply.isShowReplyFrame) {  // 关闭状态需要打开
      mreply.isShowReplyFrame = false;
    } else {                     // 打开状态关闭
      mreply.isShowReplyFrame = true;
      film.isShowCommentFrame = false;   // 评论框打开
    }
  }


  /**
   * 动态二级回复框显示和隐藏
   */
  secondReplyMessageIsShow(replyc: any, film: Film): void {
    film.isShowCommentFrame = true;            // 关闭评论框
    film.threeReply.forEach(                  // 关闭一级回复框
      (x) => x.isShowReplyFrame = true
    );
    film.replyDataSet.forEach(                  // 关闭一级回复框
      (x) => x.isShowReplyFrame = true
    );
    const data = film.replyChildrenDataSet;
    for (let i = 0; i < data.length; i++) {
      if (replyc.oid !== data[i].oid) {
        data[i].isShowReplyFrame = true;
      }
    }
    if (replyc.isShowReplyFrame) {  // 关闭状态需要打开
      replyc.isShowReplyFrame = false;
    } else {                     // 打开状态关闭
      replyc.isShowReplyFrame = true;
      film.isShowCommentFrame = false;            // 打开评论框
    }
  }


  /**
   * css效果：档焦点在评论框中显示评论发送按钮
   */
  isShowSend(oid: any): void {
    $('#s1-' + oid).show();
    $('#comment-' + oid)[0].style.border = '1px solid #3c92dc';
  }

  /**
   * css效果：档焦点在评论框中隐藏评论发送按钮
   */
  isNotShowSend(oid: any): void {
    const content = $('#i1-' + oid).val();
    if (content === '') {
      $('#s1-' + oid).hide();
      $('#comment-' + oid)[0].style.border = '1px solid #e4e4e4';
    }
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
   * css效果：鼠标移动到某一评论操作区，显示删除按钮
   */
  isShowDelete(mreply: any): void {
    mreply.isShowDelete = false;
  }

  /**
   * css效果：鼠标移动到某一评论操作区，显示删除按钮
   */
  isNotShowDelete(mreply: any): void {
    mreply.isShowDelete = true;
  }

  /**
   * css效果：当焦点在回复框中边框变蓝
   */
  isShowBorder(oid: any): void {
    $('#reply1-' + oid)[0].style.border = '1px solid #3c92dc';
  }

  /**
   * css效果：当焦点移出回复框隐藏评论发送按钮
   */
  isNotShowBorder(oid: any): void {
    $('#reply1-' + oid)[0].style.border = '1px solid #e4e4e4';
  }

  /**
   * css效果：当焦点在二级回复框中边框变蓝
   */
  isShowSecondBorder(oid: any): void {
    $('#reply2-' + oid)[0].style.border = '1px solid #3c92dc';
  }

  /**
   * css效果：当焦点移出二级回复框隐藏评论发送按钮
   */
  isNotShowSecondBorder(oid: any): void {
    $('#reply2-' + oid)[0].style.border = '1px solid #e4e4e4';
  }

  /**
   * 动态评论收缩
   */
  changeIsMore(film: Film): void {
    if (film.isMore === 0) {
      film.isMore = 1;
    } else {
      film.isMore = 0;
    }
  }

}
