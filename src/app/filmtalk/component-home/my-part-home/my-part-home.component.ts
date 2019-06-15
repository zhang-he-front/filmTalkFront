import {Component, OnInit, ViewChild} from '@angular/core';
import {Film} from '../../../shared/model/film';
import {FilmRepostComponent} from '../../../shared/component/film-repost/film-repost.component';
import {User} from '../../../shared/model/user';
import {FilmcommentServiceService} from '../../service-home/filmcomment.service';
import {ActivatedRoute} from '@angular/router';
import {UserHomeService} from '../../../shared/service/user-home.service';
import {isUndefined} from 'util';
import {MypartHomeService} from '../../service-home/mypart-home.service';
import {FilmReply} from '../../../shared/model/filmreply';
import {UserRePost} from '../../../shared/model/userrepost';
import {Filmoperate} from '../../../shared/model/filmoperate';
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
  pageNumber: number = 0;  //页码
  pageSize: number = 10; //一页个数
  showMoreHidden: boolean = false;  //点击更多显示标志
  repostCount: number;  //该用户转发总数

  constructor(private filmcommentService: FilmcommentServiceService,
              private routeInfo: ActivatedRoute,
              private userHomeService: UserHomeService,
              private myPartHomeService: MypartHomeService) { }

  ngOnInit() {
    this.getMyPartData();
    let userOid = this.routeInfo.snapshot.params['userOid'];
    this.pageNumber = 0;
    this.showMoreHidden = false;
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
  getMyPartData() {
    this.pageNumber = 0;
    this.myPartHomeService.getMyPartData(this.pageNumber, this.pageSize).subscribe(res => {
      this.dealWithData(res.data);
      if(res.data.length == 0){
        this.showMoreHidden = true;
      }
      if(this.filmsData.length == this.repostCount){
        this.showMoreHidden = true;
      } else if(this.filmsData.length < this.repostCount){
        this.showMoreHidden = false;
      }
      this.films = this.filmsData;
    });
  }

  //处理数据
  dealWithData(res: any) {
    console.log(res);
    if(!isUndefined(res)){
      if(res.length < 1){
        this.isExistFilm = true;
        this.filmsData = [];
      } else{
        this.isExistFilm = false;
        this.filmsData = [];
        for (let i = 0; i < res.length; i++) {
          this.repostCount = res[i].count;
          let filmDetail = res[i].filmDetail;
          let commentDetail = res[i].commentDetail;
          let userRePostDetail = res[i].userRePostDetail;
            this.replyDataSet = [];
            this.replyChildrenDataSet = [];
            let f = new Film();
            f.rePostOid = res[i].rePostOid;
            f.reason = res[i].reason;
            f.rePostTime = this.timeFormat2(userRePostDetail.createTime);
            f.userRePost = userRePostDetail;
            f.oid = filmDetail.oid;
            f.film_name = filmDetail.filmName;
            f.filmType = filmDetail.filmType;
            f.image_path = filmDetail.imagePath;
            f.film_language = filmDetail.filmLanguage;
            f.location = filmDetail.location;
            f.show_time = new Date(filmDetail.showTime).getFullYear() + '-' + (new Date(filmDetail.showTime).getMonth() + 1) + '-' + new Date(filmDetail.showTime).getDate();
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
            f.filmSubCount = res[i].filmSubCount;
            if(f.filmSubCount == 0){
              f.filmSubCountFlag = false;
            } else{
              f.filmSubCountFlag = true;
            }
            f.currentUserIsSub = res[i].currentUserIsSub;
            if (filmDetail.star != 0) {
              f.star = filmDetail.star * 2 + '';
              f.nzStar = filmDetail.star;
              if(filmDetail.star.split('.')[1] == '0'){
                f.nzStar = parseInt(filmDetail.star.split('.')[0]);
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
                    let isSub = child[j].childSubCount > 0 ? true : false;
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
                      isShowPraise: isSub
                    });
                  }
                }
              }
            }
            f.numberReply = this.replyDataSet.length;
            let threeReply = this.getThreeReply(filmDetail, this.replyDataSet);
            f.threeReply = threeReply;
            f.replyDataSet = this.replyDataSet;
            f.replyChildrenDataSet = this.replyChildrenDataSet;
            this.filmsData.push(f);
        }
      }
      // this.films = this.filmsData;
    } else{
      this.filmsData = [];
      // this.films = [];
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

  //电影删除
  deleteFilm(film: Film){
    this.myPartHomeService.deleteMyPartFilmByOid(film.userRePost.oid).subscribe(res => {
      if(res.msg != '成功'){
        alert('删除失败');
      } else{
        this.getMyPartData();
      }
    });
  }

  /**
   * 新增一级评论
   */
  addParentMessageReply(film: Film): void {
    let filmReply = new FilmReply();
    const oid = film.oid;
    if ($(`#i1-${oid}`).val().replace(/^\s+|\s+$/g, '') !== '') {
      filmReply.film_oid = film.userRePost.oid;
      filmReply.commentator_oid = this.currentUser.oid;
      filmReply.commentator_name = this.currentUser.username;
      filmReply.commentator_detail = $(`#i1-${oid}`).val();
      filmReply.node_parent_oid = null;
      filmReply.parent_oid = null;
      filmReply.replyperson_oid = null;
      filmReply.replyperson_name =null;
      filmReply.flag = 'repost';
      filmReply.isread = 0;
      if(this.currentUser.role == 'admin' ){
        filmReply.informer_oid = 2;  //管理员
        filmReply.informer_isread = 0; //已读
      } else {
        filmReply.informer_oid = 2;  //管理员
        filmReply.informer_isread = 1; //未读
      }

      this.filmcommentService.addParentMessageReply(filmReply).subscribe(res => {
        if(res.msg == '成功'){
          $(`#i1-${oid}`).val('');
          $(`#s1-${oid}`).hide();
          film.numberReply += 1;
          this.filmcommentService.getCommentDataByFlmOid(film.userRePost.oid, this.currentUser.oid, 'repost').subscribe(str => {
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
    const oid = mreply.oid; //
    if ( $(`#${oid}`).val().replace(/^\s+|\s+$/g, '') !== '') {
      if (num === 0) {
        filmReply.parent_oid = mreply.oid;
        filmReply.node_parent_oid = mreply.oid;
      } else {
        filmReply.parent_oid = mreply.oid;
        filmReply.node_parent_oid = mreply.parentId;
      }
      filmReply.film_oid = film.userRePost.oid;
      filmReply.commentator_oid = this.currentUser.oid;
      filmReply.commentator_name = this.currentUser.username;
      filmReply.commentator_detail = $(`#${oid}`).val();
      filmReply.replyperson_oid = mreply.commentatorId;
      filmReply.replyperson_name = mreply.commentatorName;
      filmReply.flag = 'repost';
      filmReply.isread = 0;
      if(mreply.commentatorName == this.currentUser.username){
        filmReply.informer_oid = this.currentUser.oid;
        filmReply.informer_isread = 0;
      }else{
        filmReply.informer_oid = mreply.commentatorId;
        filmReply.informer_isread = 1;
      }

      this.filmcommentService.addParentMessageReply(filmReply).subscribe(res => {
        if (res.msg == '成功') {
          $(`#${oid}`).val('');
          mreply.isShowReplyFrame = true;  // 隐藏回复框
          film.isShowCommentFrame = false;   // 显示评论框
          this.filmcommentService.getCommentDataByFlmOid(film.userRePost.oid, this.currentUser.oid, 'repost').subscribe(str => {
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
   * 动态评论删除(并将子回复一起删除)
   */
  deleteReply(film: Film, mreply: any): void {
    const oid = mreply.oid;
    this.filmcommentService.deleteReply(oid).subscribe(res => {
      // console.log(res);
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
      if(res.msg == '成功'){
        this.getReplyByOid(film);
      } else{
        alert('删除失败');
      }
    });
  }

  //转发电影
  rePostFilm(film: Film){
    this.filmRePostIsVisible = true;
    this.filmRePost.createFilmForm();
    this.filmRePost.rePostReasonValue = null;
    let userRePost = new UserRePost();
    userRePost.film_oid = film.oid;
    userRePost.reply_oid = null;
    userRePost.isread = 0;
    userRePost.informer_oid = this.currentUser.oid;
    userRePost.informer_isread = 0;
    this.filmRePost.userRePost = userRePost;
  }

  //评论处的转发按钮
  rePostFilmComment(mreply: any, film: Film){
    this.filmRePostIsVisible = true;
    this.filmRePost.createFilmForm();
    this.filmRePost.rePostReasonValue = null;
    let userRePost = new UserRePost();
    userRePost.film_oid = film.oid;
    userRePost.reply_oid = mreply.oid;
    userRePost.isread = 0;
    userRePost.informer_oid = mreply.commentatorId;
    if(mreply.commentatorName == this.currentUser.username){
      userRePost.informer_isread = 0;
    } else {
      userRePost.informer_isread = 1;
    }
    this.filmRePost.userRePost = userRePost;
  }

  //点赞电影
  likeFilm(film: Film){
    const filmOperate = new Filmoperate();
    if (film.currentUserIsSub === false) {  // 去点赞
      film.currentUserIsSub = true;
      filmOperate.parise = 1;
    } else { // 已经点赞了，取消赞
      film.currentUserIsSub = false;
      filmOperate.parise = 0;
    }
    filmOperate.parise_user_oid = this.currentUser.oid;
    filmOperate.film_oid = film.rePostOid;
    filmOperate.comment_oid = null;
    filmOperate.pariser_user = this.currentUser.username;
    filmOperate.flag = 'repost';
    filmOperate.isread = 0;
    filmOperate.informer_oid = this.currentUser.oid;
    filmOperate.informer_isread = 0;

    this.filmcommentService.queryFilmOperate(film.rePostOid, null, this.currentUser.oid, 'repost').subscribe(res => {
      if (res.data != null) {
        filmOperate.oid = res.data.oid;
        this.filmcommentService.updateFilmOperate(filmOperate).subscribe(str => {
          if (str.msg === '成功') {
            this.getMyPartData();
          }
        });
      } else {
        filmOperate.parise_time = new Date().getFullYear() + '-'
          + ((new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : ('0') + (new Date().getMonth() + 1)) + '-'
          + ((new Date().getDate() > 10) ? (new Date().getDate()) : ('0' + new Date().getDate()));
        this.filmcommentService.addFilmOperate(filmOperate).subscribe(data => {
          if (data.msg == '成功') {
            this.getMyPartData();
          } else {
            alert('点赞失败\n');
          }
        });
      }
    });
  }

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
    filmOperate.parise_user_oid = this.currentUser.oid;
    filmOperate.film_oid = film.rePostOid;
    filmOperate.comment_oid = mreply.oid;
    filmOperate.pariser_user = this.currentUser.username;
    filmOperate.flag = 'repost';
    filmOperate.isread = 0;
    if(mreply.commentatorName == this.currentUser.username){
      filmOperate.informer_oid = this.currentUser.oid;
      filmOperate.informer_isread = 0;
    } else {
      filmOperate.informer_oid = mreply.commentatorId;
      filmOperate.informer_isread = 1;
    }

    this.filmcommentService.queryFilmOperate(film.rePostOid, mreply.oid, this.currentUser.oid, 'repost').subscribe(res => {
      if (res.data != null) {
        filmOperate.oid = res.data.oid;
        this.filmcommentService.updateFilmOperate(filmOperate).subscribe(str => {
          if (str.msg === '成功') {
            this.getReplyByOid(film);
          }
        });
      } else {
        filmOperate.parise_time = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : ('0') + (new Date().getMonth() + 1))
          + '-' + ((new Date().getDate() > 10) ? (new Date().getDate()) : ('0' + new Date().getDate()));
        this.filmcommentService.addFilmOperate(filmOperate).subscribe(data => {
          if (data.msg == '成功') {
            this.getReplyByOid(film);
          } else {
            alert('点赞失败\n');
          }
        });
      }
    });
  }

  /**
   * 根据电影oid查询评论信息
   * @param {Film} film
   */
  getReplyByOid(film: Film){
    this.filmcommentService.getCommentDataByFlmOid(film.rePostOid, this.currentUser.oid, 'repost').subscribe(str => {
      if (str.data != null) {
        this.replyDataSet = [];
        this.replyChildrenDataSet = [];
        let data = str.data.commentParentVOList;
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
    return d.getFullYear() + '-'
          + ((d.getMonth() + 1) > 10 ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '-'
          + (d.getDate() > 10 ? d.getDate() : ('0' + d.getDate())) + ' '
          + (d.getHours() > 10 ? d.getHours() : ('0' + d.getHours())) + ':'
          + (d.getMinutes() > 10 ? d.getMinutes() : ('0' + d.getMinutes()));
  }

  /**
   * 是否显示评论区
   */
  isShowReply(film: Film): void {
    this.isShowReplyFrames();  // 关闭所有回复输入框
    if (film.isShowReply) {  // 关闭状态需要打开
      film.isShowReply = false;
      film.isShowCommentFrame = false;
    } else {                     // 打开状态关闭
      film.isShowReply = true;
      film.isShowCommentFrame = true;
    }
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
    // $('#commentText-' + film.oid).css('border-left', '2px solid #fff');
  }

  /**
   * css效果：鼠标移动到某一动态块，显示操作按钮
   */
  isShowOperate(film: Film): void {
    if (!this.messageTopChk) {
      film.isShowOperate = false;
      // $('#commentText-' + film.oid).css('border-left', '2px solid #329cc6');
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
    this.getMyPartData();
  }

  //分页设置
  getMoreData(){
    this.pageNumber = this.pageNumber + 1;
    let num = this.pageNumber * this.pageSize;
    this.myPartHomeService.getMyPartData(num, this.pageSize).subscribe(res => {
      this.dealWithData(res.data);
      this.films = this.films.concat(this.filmsData);
      if((this.films.length) == this.repostCount){
        this.showMoreHidden = true;
      } else if(this.films.length < this.repostCount){
        this.showMoreHidden = false;
      }
      if(this.filmsData.length == 0){
        this.isExistFilm = false;
      }
    });
  }
}
