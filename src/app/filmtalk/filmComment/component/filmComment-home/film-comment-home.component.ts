import {Component, OnInit} from '@angular/core';
import {FilmpageHomeService} from "../../../filmPages/service/filmpage-home.service";
import {Film} from "../../../../shared/model/film";
import {FilmcommentServiceService} from "../../service/filmcomment.service";
import {isUndefined} from "util";
import {FilmReply} from "../../../../shared/model/filmreply";
import {Filmoperate} from "../../../../shared/model/filmoperate";
import {ActivatedRoute} from "@angular/router";
import {UserHomeService} from "../../../../shared/service/user-home.service";
import {User} from "../../../../shared/model/user";

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
  replyDataSet = [];      // 全部评论合集
  replyChildrenDataSet = [];      // 全部评论的回复合集
  isExistFilm: boolean = false;    // 是否存在电影
  // userName: string = 'admin';
  // userOid: number = 2;
  currentUser: User = new User(); //当前登陆者

  constructor(private filmcommentService: FilmcommentServiceService,
              private routeInfo: ActivatedRoute,
              private userHomeService: UserHomeService) {
  }

  ngOnInit() {
    this.getFilmData();

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
    this.filmcommentService.getFilmData().subscribe(res => {
      // console.log(res);
      this.dealWithData(res.data);
      console.log(this.films)
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
          this.filmcommentService.getCommentDataByFlmOid(res[i].oid).subscribe(str => {
            this.replyDataSet = [];
            this.replyChildrenDataSet = [];
            let a = new Date(res[i].showTime);
            let f = new Film();
            f.oid = res[i].oid;
            f.film_name = res[i].filmName;
            f.filmType = res[i].filmType;
            f.image_path = res[i].imagePath;
            f.film_language = res[i].filmLanguage;
            f.location = res[i].location;
            f.show_time = a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate();
            f.hour_length = res[i].hour;
            f.film_detail = res[i].filmDetail;
            f.producer = res[i].producer;
            f.director = res[i].director;
            f.film_staus = res[i].filmStatus;
            f.numberReply = res[i].commentTotal;
            f.isShowCommentFrame = true;
            f.isShowReply = true;
            f.isShowOperate = true;
            f.isCollect = false;
            f.isPraise = false;
            f.isPraiseNumb = true;
            f.isMore = 0;
            // f.praiseNumb = 10;
            if (res[i].star != 0) {
              f.star = res[i].star * 2 + "";
              f.nzStar = res[i].star;
              if(res[i].star.split(".")[1] == "0"){
                f.nzStar = parseInt(res[i].star.split(".")[0]);
              }
            } else {
              f.star = '暂无评分';
              f.nzStar = 0;
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
            let threeReply = this.getThreeReply(res[i], this.replyDataSet);
            f.threeReply = threeReply;
            f.replyDataSet = this.replyDataSet;
            f.replyChildrenDataSet = this.replyChildrenDataSet;
            this.filmsData.push(f);
          });
        }
        this.films = this.filmsData;
      }
    } else{
      this.films = [];
      this.isExistFilm = true;
    }
  }

  // replyPraise(mreply): void {
  //
  // }

  /**
   * 判断评论区是否点赞更改图标
   */
  replyPraise(mreply: any, film: Film): void {
    const filmOperate = new Filmoperate();
    // 点赞
    if (mreply.PRAISENUMflag === false) {
      mreply.PRAISENUMflag = true;
      filmOperate.parise = 0;
    } else {
      // 否则修改为none进行隐藏
      mreply.PRAISENUMflag = false;
      filmOperate.parise = 1;
    }
    this.filmcommentService.queryFilmOperate(film.oid, mreply.oid, 2).subscribe(res => {
      if (res.data != null) {
        const newOperate = res.data;
        filmOperate.oid = newOperate.oid;
        filmOperate.parise_user_oid = 3;
        filmOperate.parise_user_oid = this.currentUser.oid;
        filmOperate.film_oid = mreply.filmOid;
        filmOperate.comment_oid = mreply.oid;
        filmOperate.pariser_user = this.currentUser.username;

        this.filmcommentService.updateFilmOperate(filmOperate).subscribe(str => {
          if (str.msg === '成功') {
            this.getReplyByOid(film);
            // let flag = '';
            // if (filmOperate.parise === 1) {   // 点赞
            //   flag = 'add';
            //   mreply.PRAISENUM++;
            //   mreply.isShowPraise = true;
            // } else {                          // 取消赞
            //   flag = 'sub';
            //   mreply.PRAISENUM--;
            //   if (mreply.PRAISENUM <= 0) {
            //     mreply.isShowPraise = false;
            //   } else {
            //     mreply.isShowPraise = true;
            //   }
            // }
          }
        });
      } else {
        filmOperate.parise_user_oid = 3;
        filmOperate.parise_user_oid = this.currentUser.oid;
        filmOperate.film_oid = mreply.filmOid;
        filmOperate.comment_oid = mreply.oid;
        filmOperate.pariser_user = this.currentUser.username;
        filmOperate.parise_time = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : ('0') + (new Date().getMonth() + 1))
          + '-' + ((new Date().getDate() > 10) ? (new Date().getDate()) : ('0' + new Date().getDate()));
        this.filmcommentService.addFilmOperate(filmOperate).subscribe(data => {
          if (data.msg == '成功') {
            this.getReplyByOid(film);
            // let flag = '';
            // if (filmOperate.parise === 1) {   // 点赞
            //   flag = 'add';
            //   mreply.PRAISENUM++;
            //   mreply.isShowPraise = true;
            // } else {                          // 取消赞
            //   flag = 'sub';
            //   mreply.PRAISENUM--;
            //   if (mreply.PRAISENUM <= 0) {
            //     mreply.isShowPraise = false;
            //   } else {
            //     mreply.isShowPraise = true;
            //   }
            // }
            // this.messagesOperationService.updateMessageoperation(mreply.OID, flag).subscribe(response => {
            //   if (response.success === false) {
            //     alert('点赞数修改失败\n');
            //   }
            // });

          } else {
            alert('点赞失败\n');
          }
        });
      }

    });
  }

  messageSpecial(film: Film): void {

  }

  /**
   * 判断是否点赞更改图标（点赞）
   */
  messagePraise(film: Film): void {

  }

  /**
   * 是否显示评论区
   */
  isShowReply(film: Film): void {
    this.isShowReplyFrames();  // 关闭所有回复输入框
    if (film.isShowReply) {  // 关闭状态需要打开
      film.isShowReply = false;
      film.isShowCommentFrame = false;
      // if (this.currentMessage.OID !== '' && this.currentMessage.OID !== message.OID) {      // 关闭上一个评论区打开新的评论区
      //   this.currentMessage.isShowReply = true;
      // }
    } else {                     // 打开状态关闭
      film.isShowReply = true;
      film.isShowCommentFrame = true;
    }
    // this.currentMessage = message;
  }

  /**
   * 关闭所有一级回复框和二级回复框
   */
  isShowReplyFrames(): void {
    // 所有评论的回复框（一级）
    this.replyDataSet.forEach(
      (x) => x.isShowReplyFrame = true
    );

    // 所有回复的回复框（二级）
    this.replyChildrenDataSet.forEach(
      (x) => x.isShowReplyFrame = true
    );
  }

  /**
   * 新增一级评论
   */
  addParentMessageReply(film: Film): void {
    let filmReply = new FilmReply();
    const oid = film.oid;
    if ($(`#i1-${oid}`).val().replace(/^\s+|\s+$/g, '') !== '') {
      filmReply.film_oid = oid;
      filmReply.commentator_oid = 1;
      filmReply.commentator_name = 'admin';
      filmReply.commentator_detail = $(`#i1-${oid}`).val();
      filmReply.node_parent_oid = null;
      filmReply.parent_oid = null;
      filmReply.replyperson_oid = null;
      filmReply.replyperson_name =null;
      this.filmcommentService.addParentMessageReply(filmReply).subscribe(res => {
        if(res.msg == '成功'){
          $(`#i1-${oid}`).val('');
          $(`#s1-${oid}`).hide();
          film.numberReply += 1;
          this.filmcommentService.getCommentDataByFlmOid(film.oid).subscribe(str => {
            if (str.data != null) {
              let data = str.data.commentParentVOList;
              this.replyDataSet = [];
              this.replyChildrenDataSet = [];
              for (let x = 0; x < str.data.commentParentVOList.length; x++) {
                let replyData = str.data.commentParentVOList[x];  //一级评论
                this.replyDataSet.push({
                  commentCreateTime: this.timeFormat(replyData.commentCreateTime),
                  commentDetail: replyData.commentDetail,
                  commentatorId: replyData.commentatorId,
                  commentatorName: replyData.commentatorName,
                  num: replyData.num,
                  oid: replyData.oid,
                  filmOid: film.oid,
                  isShowDelete: true,
                  isShowReplyFrame: true,
                  PRAISENUMflag: replyData.currentUserSub
                });
                let child = str.data.commentParentVOList[x].childCommentVOList;  //一级评论的回复
                if (child != null && child.length > 0) {
                  for (let j = 0; j < child.length; j++) {
                    this.replyChildrenDataSet.push({
                      commentDetail: child[j].commentDetail,
                      commentatorName: child[j].commentatorName,
                      nodeParentId: child[j].nodeParentId,
                      oid: child[j].oid,
                      parentId: child[j].parentId,
                      filmOid: film.oid,
                      replyCreateTime: this.timeFormat(child[j].replyCreateTime),
                      replyPersonName: child[j].replyPersonName,
                      isShowReplyFrame: true,
                      isShowDelete: true,
                      PRAISENUMflag: child[j].currentUserSub
                    });
                  }
                }
              }
              film.replyDataSet = this.replyDataSet;
              film.replyChildrenDataSet = this.replyChildrenDataSet;
              this.getThreeReply(film, this.replyDataSet);
            } else{
              alert('评论失败');
            }
          });
        }
      });
    } else{
      alert('评论不能为空');
    }
  }

  /**
   * 新增二级评论
   */
  addChildrenMessageReply(mreply: any, num: any, film: Film): void {
    let filmReply = new FilmReply();
    const oid = mreply.oid; // 回复（电影的回复）的OID
    if ( $(`#${oid}`).val().replace(/^\s+|\s+$/g, '') !== '') {
      if (num === 0) {
        filmReply.parent_oid = mreply.oid;   // 回复（动态的回复）的OID
        filmReply.node_parent_oid = mreply.oid;   // 回复（动态的回复）的OID
      } else {
        filmReply.parent_oid = mreply.oid;   // 回复（动态的回复）的OID
        filmReply.node_parent_oid = mreply.parentId;   // 回复（动态的回复）的OID
      }
      filmReply.film_oid = film.oid;
      filmReply.commentator_oid = 1;
      filmReply.commentator_name = 'admin';
      filmReply.commentator_detail = $(`#${oid}`).val();
      filmReply.replyperson_oid = mreply.commentatorId;
      filmReply.replyperson_name = mreply.commentatorName;

      this.filmcommentService.addParentMessageReply(filmReply).subscribe(res => {
        console.log(res);
        if (res.msg == '成功') {
          $(`#${oid}`).val('');
          mreply.isShowReplyFrame = true;  // 隐藏回复框
          film.isShowCommentFrame = false;   // 显示评论框
          this.filmcommentService.getCommentDataByFlmOid(film.oid).subscribe(str => {
            if (str.data != null) {
              this.replyDataSet = [];
              this.replyChildrenDataSet = [];
              for (let x = 0; x < str.data.commentParentVOList.length; x++) {
                let replyData = str.data.commentParentVOList[x];  //一级评论
                this.replyDataSet.push({
                  commentCreateTime: this.timeFormat(replyData.commentCreateTime),
                  commentDetail: replyData.commentDetail,
                  commentatorId: replyData.commentatorId,
                  commentatorName: replyData.commentatorName,
                  num: replyData.num,
                  oid: replyData.oid,
                  filmOid: film.oid,
                  isShowDelete: true,
                  isShowReplyFrame: true,
                  PRAISENUMflag: replyData.currentUserSub
                });
                let child = str.data.commentParentVOList[x].childCommentVOList;  //一级评论的回复
                if (child != null && child.length > 0) {
                  for (let j = 0; j < child.length; j++) {
                    this.replyChildrenDataSet.push({
                      commentDetail: child[j].commentDetail,
                      commentatorName: child[j].commentatorName,
                      nodeParentId: child[j].nodeParentId,
                      oid: child[j].oid,
                      parentId: child[j].parentId,
                      filmOid: film.oid,
                      replyCreateTime: this.timeFormat(child[j].replyCreateTime),
                      replyPersonName: child[j].replyPersonName,
                      isShowReplyFrame: true,
                      isShowDelete: true,
                      PRAISENUMflag: child[j].currentUserSub
                    });
                  }
                }
              }
              film.replyDataSet = this.replyDataSet;
              film.replyChildrenDataSet = this.replyChildrenDataSet;
              this.getThreeReply(film, this.replyDataSet);
            }
          });
        } else {
          alert('创建失败');
        }
      });
    } else {
      alert('回复不能为空');
    }

  }

  /**
   * 删除（不显示）
   */
  notShowMessage(film: Film): void {

  }

  /**
   * 动态评论删除(并将子回复一起删除)
   */
  deleteReply(film: Film, mreply: any): void {
    const oid = mreply.oid;
    this.filmcommentService.deleteReply(oid).subscribe(res => {
      console.log(res);
      if(res.msg == '成功'){
        console.log('删除成功');
        film.numberReply = film.numberReply - 1;
        this.getReplyByOid(film);
      } else{
        alert('删除失败');
      }
    });
  }

  /**
   * 动态评论的回复删除
   */
  deleteReplyChild(film: Film, oid: string): void {
    this.filmcommentService.deleteReply(oid).subscribe(res => {
      console.log(res);
      if(res.msg == '成功'){
        console.log('删除成功');
        this.getReplyByOid(film);
      } else{
        alert('删除失败');
      }
    });
  }

  /**
   * 根据电影oid查询评论信息
   * @param {Film} film
   */
  getReplyByOid(film: Film){
    this.filmcommentService.getCommentDataByFlmOid(film.oid).subscribe(str => {
      if (str.data != null) {
        this.replyDataSet = [];
        this.replyChildrenDataSet = [];
        let data = str.data.commentParentVOList;
        for (let x = 0; x < str.data.commentParentVOList.length; x++) {
          let replyData = str.data.commentParentVOList[x];  //一级评论
          // 点赞数初始化
          // if (replyData.parentSubCount > 0) {   // 点赞数大于0
          //   replyData.isShowPraise = true;
          // } else {                       // 没有点赞
          //   replyData.isShowPraise = false;
          // }
          this.replyDataSet.push({
            commentCreateTime: this.timeFormat(replyData.commentCreateTime),
            commentDetail: replyData.commentDetail,
            commentatorId: replyData.commentatorId,
            commentatorName: replyData.commentatorName,
            num: replyData.num,
            oid: replyData.oid,
            filmOid: film.oid,
            isShowDelete: true,
            isShowReplyFrame: true,
            PRAISENUMflag: replyData.currentUserSub,
            PRAISENUM: replyData.parentSubCount,
            isShowPraise: replyData.parentSubCount > 0 ? true : false
          });
          let child = str.data.commentParentVOList[x].childCommentVOList;  //一级评论的回复
          if (child != null && child.length > 0) {
            for (let j = 0; j < child.length; j++) {
              this.replyChildrenDataSet.push({
                commentDetail: child[j].commentDetail,
                commentatorName: child[j].commentatorName,
                nodeParentId: child[j].nodeParentId,
                oid: child[j].oid,
                parentId: child[j].parentId,
                filmOid: film.oid,
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
        film.replyDataSet = this.replyDataSet;
        film.replyChildrenDataSet = this.replyChildrenDataSet;
        this.getThreeReply(film, this.replyDataSet);
      } else{
        film.replyDataSet = [];
        film.replyChildrenDataSet = [];
        film.threeReply = [];
      }
    });
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
          PRAISENUMflag: replyData[i].PRAISENUMflag,
          PRAISENUM: replyData[i].PRAISENUM,
          isShowPraise: replyData[i].isShowPraise
        });
      }
    }
    return film.threeReply;
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

}
