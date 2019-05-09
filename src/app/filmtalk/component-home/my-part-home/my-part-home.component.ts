import {Component, OnInit, ViewChild} from '@angular/core';
import {Film} from "../../../shared/model/film";
import {FilmRepostComponent} from "../../../shared/component/film-repost/film-repost.component";
import {User} from "../../../shared/model/user";
import {FilmcommentServiceService} from "../../service-home/filmcomment.service";
import {ActivatedRoute} from "@angular/router";
import {UserHomeService} from "../../../shared/service/user-home.service";
import {isUndefined} from "util";
import {MypartHomeService} from "../../service-home/mypart-home.service";
declare var $: any;

@Component({
  selector: 'app-my-part-home',
  templateUrl: './my-part-home.component.html',
  styleUrls: ['./my-part-home.component.css']
})
export class MyPartHomeComponent implements OnInit {

  @ViewChild('filmRePost') filmRePost: FilmRepostComponent;  // 转发子组件
  films: Film[] = [];
  filmsData: Film[] = [];
  messageTopChk: boolean = false;    // 任务转动态checkbox是否选中
  replyDataSet = [];      // 全部评论合集
  replyChildrenDataSet = [];      // 全部评论的回复合集
  isExistFilm: boolean = false;    // 是否存在电影
  currentUser: User = new User(); //当前登陆者
  filmRePostIsVisible: boolean = false;  //个人信息模态框展示

  constructor(private filmcommentService: FilmcommentServiceService,
              private routeInfo: ActivatedRoute,
              private userHomeService: UserHomeService,
              private myPartHomeService: MypartHomeService) { }

  ngOnInit() {
    // this.getFilmData();
    this.getMyPartData();
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


  //获取数据
  getFilmData() {
    this.filmcommentService.getFilmData(this.currentUser.oid, null).subscribe(res => {
      this.dealWithData(res.data);
    });
  }

  //
  getMyPartData() {
    this.myPartHomeService.getMyPartData().subscribe(res => {
      console.log(res.data);
      let a = res;
      this.dealWithData(res.data);
      // this.dealWithData(res.data);
    });
  }

  //处理数据
  dealWithData(res: any) {
    if(!isUndefined(res)){
      if(res.length < 1){
        this.isExistFilm = true;
        this.filmsData = [];
      } else{
        this.isExistFilm = false;
        this.filmsData = [];
        for (let i = 0; i < res.length; i++) {
          let filmDetail = res[i].filmDetail;
          let commentDetail = res[i].commentDetail;
          // this.filmcommentService.getCommentDataByFlmOid(res[i].oid, this.currentUser.oid,"repost").subscribe(str => {
            this.replyDataSet = [];
            this.replyChildrenDataSet = [];
            let f = new Film();
            f.rePostTime = this.timeFormat2(filmDetail.rePostTime);
            f.reason = filmDetail.reason;
            f.oid = filmDetail.oid;
            f.film_name = filmDetail.filmName;
            f.filmType = filmDetail.filmType;
            f.image_path = filmDetail.imagePath;
            f.film_language = filmDetail.filmLanguage;
            f.location = filmDetail.location;
            f.show_time = new Date(filmDetail.showTime).getFullYear() + "-" + (new Date(filmDetail.showTime).getMonth() + 1) + "-" + new Date(filmDetail.showTime).getDate();
            f.hour_length = filmDetail.hour;
            f.film_detail = filmDetail.filmDetail;
            f.producer = filmDetail.producer;
            f.director = filmDetail.director;
            f.film_staus = filmDetail.filmStatus;
            f.numberReply = filmDetail.commentTotal;
            f.isShowCommentFrame = true;
            f.isShowReply = true;
            f.isShowOperate = true;
            f.isCollect = false;
            f.isPraise = false;
            f.isPraiseNumb = true;
            f.isMore = 0;
            //电影点赞
            f.filmSubCount = filmDetail.filmSubCount;
            if(f.filmSubCount == 0){
              f.filmSubCountFlag = false;
            } else{
              f.filmSubCountFlag = true;
            }
            f.currentUserIsSub = filmDetail.currentUserIsSub;
            if (filmDetail.star != 0) {
              f.star = filmDetail.star * 2 + "";
              f.nzStar = filmDetail.star;
              if(filmDetail.star.split(".")[1] == "0"){
                f.nzStar = parseInt(filmDetail.star.split(".")[0]);
              }
            } else {
              f.star = '暂无评分';
              f.nzStar = 0;
            }
            if (f.numberReply > 0 && commentDetail == null) {
              f.numberReply = 0;
            }
            if (f.numberReply > 0 && commentDetail != null) {
              for (let x = 0; x < commentDetail.commentParentVOList.length; x++) {
                let replyData = commentDetail.commentParentVOList[x];  //一级评论

                // 点赞数初始化
                if (replyData.parentSubCount > 0) {   // 点赞数大于0
                  replyData.isShowPraise = true;
                } else {                       // 没有点赞
                  replyData.isShowPraise = false;
                }
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
                  PRAISENUMflag: replyData.currentUserSub,
                  PRAISENUM: replyData.parentSubCount,
                  isShowPraise: replyData.isShowPraise
                });
                let child = commentDetail.commentParentVOList[x].childCommentVOList;  //一级评论的回复
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
                      PRAISENUMflag: child[j].currentUserSub,
                      PRAISENUM: child[j].childSubCount,
                      isShowPraise: child[j].childSubCount > 0 ? true : false
                    });
                  }
                }
              }
            }
            // f.numberReply = this.replyDataSet.length + this.replyChildrenDataSet.length;
            f.numberReply = this.replyDataSet.length;
            let threeReply = this.getThreeReply(filmDetail, this.replyDataSet);
            f.threeReply = threeReply;
            f.replyDataSet = this.replyDataSet;
            f.replyChildrenDataSet = this.replyChildrenDataSet;
            this.filmsData.push(f);
          // });
        }
        this.films = this.filmsData;
      }
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
          PRAISENUMflag: replyData[i].PRAISENUMflag,
          PRAISENUM: replyData[i].PRAISENUM,
          isShowPraise: replyData[i].isShowPraise
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
   * 时间格式化（将日期 xxxx-xx-xx xx:xx:xx 格式化为 xxxx-xx-xx xx:xx）
   */
  timeFormat2(rePostTime: Date): string {
    let d = new Date(rePostTime);
    return d.getFullYear() + "-"
          + ((d.getMonth() + 1) > 10 ? (d.getMonth() + 1) : ("0" + (d.getMonth() + 1))) + "-"
          + (d.getDate() > 10 ? d.getDate() : ("0" + d.getDate())) + " "
          + (d.getHours() > 10 ? d.getHours() : ("0" + d.getHours())) + ":"
          + (d.getMinutes() > 10 ? d.getMinutes() : ("0" + d.getMinutes()));
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

  //取消按钮：关闭转发模态框
  filmRePostCancel(){
    this.filmRePostIsVisible = false;
  }

  //确定按钮：关闭转发模态框
  filmRePostOk(){
    this.filmRePostCancel();
  }

  //关闭转发模态框
  closeRePostModel(event: any){
    this.filmRePostCancel();
  }
}
