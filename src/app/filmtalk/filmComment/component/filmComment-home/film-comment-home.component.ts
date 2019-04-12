import {Component, OnInit} from '@angular/core';
import {FilmpageHomeService} from "../../../filmPages/service/filmpage-home.service";
import {Film} from "../../../../shared/model/film";
import {FilmcommentServiceService} from "../../service/filmcomment-service.service";

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
  before: Film = new Film();

  constructor(private filmpageHomeService: FilmpageHomeService,
              private filmcommentService: FilmcommentServiceService) {
  }

  ngOnInit() {
    this.getFilmData();
  }

  //获取数据
  getFilmData() {
    this.filmcommentService.getFilmData().subscribe(res => {
      // console.log(res);
      this.dealWithData(res.data);
    });
  }

  //处理数据
  dealWithData(res: any) {
    this.filmsData = [];
    for (let i = 0; i < res.length; i++) {
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
      f.praiseNumb = 10;

      if (res[i].star != "0") {
        f.star = res[i].star.split(".")[0] + "." + res[i].star.split(".")[1].substring(0, 1)
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
   * 是否显示评论区
   */
  isShowReply(film: Film): void {
    // this.before = film;
    console.log(film);
    this.filmcommentService.getCommentDataByFlmOid(film.oid).subscribe(res => {
      this.dealWithComment(res.data, film);
      console.log(this.replyDataSet);
    });
  }

  //解析评论信息
  dealWithComment(str, film) {
    this.replyDataSet = [];
    this.replyChildrenDataSet = [];
    for (let i = 0; i < str.commentParentVOList.length; i++) {
      let child = str.commentParentVOList[i].childCommentVOList;
      if (child.length > 0) {
        for (let j = 0; j < child.length; j++) {
          this.replyChildrenDataSet.push({
            commentDetail: child[j].commentDetail,
            commentatorName: child[j].commentatorName,
            nodeParentId: child[j].nodeParentId,
            oid: child[j].oid,
            parentId: child[j].parentId,
            replyCreateTime: child[j].replyCreateTime,
            replyPersonName: child[j].replyPersonName,
            isShowDelete: true,
          });
        }
      } else {
        this.replyChildrenDataSet = [];
      }
      this.replyDataSet.push({
        childCommentVOList: this.replyChildrenDataSet,
        commentCreateTime: str.commentParentVOList[i].commentCreateTime,
        commentDetail: str.commentParentVOList[i].commentDetail,
        commentatorId: str.commentParentVOList[i].commentatorId,
        commentatorName: str.commentParentVOList[i].commentatorName,
        num: str.commentParentVOList[i].num,
        oid: str.commentParentVOList[i].oid,
        filmOid: film.oid,
        isShowDelete: true,
      });
    }
    if (film.isShowReply) {
      film.isShowReply = false;
      film.isShowCommentFrame = false;
      $('#isShowReply-' + film.oid).show();
      $('#isShowCommentFrame-' + film.oid).show();
      // $(".jkl").show();
    } else {
      film.isShowReply = true;
      film.isShowCommentFrame = true;
      $('#isShowReply-' + film.oid).hide();
      $('#isShowCommentFrame-' + film.oid).hide();
    }
    console.log("1111111");
    console.log(this.replyDataSet);
    console.log("1111111");
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
    const oid = film.oid;
    if ($(`#i1-${oid}`).val().replace(/^\s+|\s+$/g, '') !== '') {

      //   this.filmcommentService.addMessageReply(this.messageReply).subscribe(res => {
      //     if (res.success === true) {
      //       $(`#i1-${oid}`).val('');
      //       $(`#s1-${oid}`).hide();
      //       message.numberReply += 1;
      //       message.isshowNumbReply = false;
      //       this.messagesHomeService.getMessageReplyByOID(oid, this.userId).subscribe(res1 => {
      //         if (res1.data.t_messagereply.length > 0) {
      //           this.replyDataSet = this.replyDataSet.filter((r) => !(r.MESSAGEOID === oid) && r.REPLYMESSAGEOID !== '');
      //           let newReply = [];
      //           newReply = res1.data.t_messagereply;
      //           newReply = newReply.filter((r) => (r.REPLYMESSAGEOID === ''));
      //           for (let i = 0; i < newReply.length; i++) {
      //             if (newReply[i].REPLYMESSAGEOID === '') {
      //
      //               // 时间格式化
      //               newReply[i].REPLYTIME = this.timeFormat(newReply[i].REPLYTIME);
      //
      //               // 点赞数初始化
      //               if (newReply[i].PRAISENUM > 0) {   // 点赞数大于0
      //                 newReply[i].isShowPraise = true;
      //               } else {                       // 没有点赞
      //                 newReply[i].isShowPraise = false;
      //               }
      //
      //               this.replyDataSet.push({
      //                 OID: newReply[i].OID,
      //                 MESSAGEOID: newReply[i].MESSAGEOID,
      //                 CONTENT: newReply[i].CONTENT,
      //                 REPLYPERSON: newReply[i].REPLYPERSON,
      //                 REPLYPERSONID: newReply[i].REPLYPERSON.split('_')[0],
      //                 REPLYPERSONNAME: newReply[i].REPLYPERSON.split('_')[1],
      //                 REPLYTIME: newReply[i].REPLYTIME,
      //                 REPLYMESSAGEOID: '',
      //                 isShowDelete: true, isShowReplyFrame: true,
      //                 PRAISENUM: newReply[i].PRAISENUM,
      //                 PRAISENUMflag: newReply[i].PRAISENUMflag,
      //                 isShowPraise: newReply[i].isShowPraise
      //               });
      //             }
      //           }
      //           this.getThreeReply(message, newReply);
      //         }
      //       });
      //     } else {
      //       alert('创建失败');
      //     }
      //   });
      // }
    }
  }

  /**
   * add by GaoYa 2018.10.26
   * 动态评论删除(并将子回复一起删除)
   *
   */
  deleteReply(film: Film, mreply): void {
    // const oid = mreply.OID;
    // this.messagesHomeService.delMessageReply(oid).subscribe(response => {
    //   if (response.success === true) {
    //     this.resMessage.success('删除成功', {
    //       dwDuration: 1500
    //     });
    //     message.numberReply = message.numberReply - 1;
    //     if (message.numberReply < 1) {
    //       message.isshowNumbReply = true;  // 不显示评论数
    //     }
    //     this.messagesHomeService.getMessageReplyByOID(message.OID, this.userId).subscribe(res => {
    //       let newReply = [];
    //       if (!isUndefined(res.data.t_messagereply)) {
    //         newReply = res.data.t_messagereply;
    //         newReply = newReply.filter((r) => (r.REPLYMESSAGEOID === ''));
    //         if (message.isMore === 1 && newReply.length < 4) {
    //           message.isMore = 0;
    //         }
    //       }
    //       this.getThreeReply(message, newReply);
    //     });
    //     this.replyDataSet = this.replyDataSet.filter((r) => !(r.OID === oid));
    //     this.replyChildrenDataSet = this.replyChildrenDataSet.filter((r) => !(r.REPLYMESSAGEOID === oid));
    //     this.messagesHomeService.delMessagereplyByOid(oid).subscribe(res => {
    //       if (res.success === true) {
    //       } else {
    //         this.resMessage.error('子回复删除失败', {
    //           dwDuration: 1500
    //         });
    //       }
    //     });
    //   } else {
    //     this.resMessage.error('子回复删除失败', {
    //       dwDuration: 1500
    //     });
    //   }
    // });
  }

  /**
   * add by GaoYa 2018.12.07
   * 动态一级回复框显示和隐藏
   */
  replyMessageIsShow(mreply, film: Film): void {
    film.isShowCommentFrame = true;            // 关闭评论框
    // this.replyChildrenDataSet.forEach(      // 所有回复的回复框（二级）
    //   (x) => x.isShowReplyFrame = true
    // );
    // const threereply = message.threeReply;
    // for (let i = 0; i < threereply.length; i++) {
    //   if (mreply.OID !== threereply[i].OID) {
    //     threereply[i].isShowReplyFrame = true;
    //   }
    // }
    // const data = this.replyDataSet;
    // for (let i = 0; i < data.length; i++) {
    //   if (mreply.OID !== data[i].OID) {
    //     data[i].isShowReplyFrame = true;
    //   }
    // }
    // if (mreply.isShowReplyFrame) {  // 关闭状态需要打开
    //   mreply.isShowReplyFrame = false;
    // } else {                     // 打开状态关闭
    //   mreply.isShowReplyFrame = true;
    //   message.isShowCommentFrame = false;   // 评论框打开
    // }
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
}
