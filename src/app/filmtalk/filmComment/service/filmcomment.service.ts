import { Injectable } from '@angular/core';
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {FilmReply} from "../../../shared/model/filmreply";
import {Filmoperate} from "../../../shared/model/filmoperate";

@Injectable({
  providedIn: 'root'
})
export class FilmcommentServiceService {

  constructor(private http: HttpClient) { }

  /**
   * 获取评论页电影数据
   * add by zyx 2019-4-12
   * @returns {Observable<any>}
   */
  getFilmData(): Observable<any> {
    const url = '/film/queryDetail';
    const body = {
    };
    return this.http.post(url, body);
  }

  /**
   * 根据电影oid获取评论信息
   * add by zyx 2019-4-12
   * @returns {Observable<any>}
   */
  getCommentDataByFlmOid(filmId: any): Observable<any> {
    const url = '/comment/query';
    const body = {
      filmId
    };
    return this.http.post(url, body);
  }


  /**
   * 新增一级评论
   * add by zyx 2019-4-21
   * @returns {Observable<any>}
   */
  addParentMessageReply(filmReply: FilmReply): Observable<any> {
    const url = '/comment/insert';
    const body = {
      'nodeParentId': filmReply.node_parent_oid,
      'parentId': filmReply.parent_oid,
      'filmId': filmReply.film_oid,
      'commentatorId': filmReply.commentator_oid,
      'commentatorName': filmReply.commentator_name,
      'commentDetail': filmReply.commentator_detail,
      // 'commentCreateTime': filmReply.comment_create_time,
      'replyPersonId': filmReply.replyperson_oid,
      'replyPersonName': filmReply.replyperson_name,
    };
    return this.http.post(url, body);
  }

  /**
   * 删除评论信息
   * add by zyx 2019-4-24
   * @returns {Observable<any>}
   */
  deleteReply(parentId: any): Observable<any> {
    const url = '/comment/delete';
    const body = {
      parentId
    };
    return this.http.post(url, body);
  }

  /**
   * 根据Oid查询电影
   * add by zyx 2019-4-30
   * @returns {Observable<any>}
   */
  getFilmDataByFilmOid(filmOid: any): Observable<any> {
    const url = '/film/queryFilmByOid';
    const body = {
      filmOid
    };
    return this.http.post(url, body);
  }

  /**
   * 根据oid查询是否点赞了
   * add by zyx 2019-4-30
   * @returns {Observable<any>}
   */
  queryFilmOperate(filmOid: number, commentOid: number, userid: number): Observable<any> {
    const url = '/film/queryFilmOperate';
    const body = {
      'filmOid': filmOid,
      'commentOid': commentOid,
      'userId': userid
    };
    return this.http.post(url, body);
  }

  /**
   * 点赞
   * add by zyx 2019-5-5
   * @returns {Observable<any>}
   */
  addFilmOperate(filmOperate: Filmoperate): Observable<any> {
    const url = '/film/addFilmOperate';
    const body = {
      'filmOid': filmOperate.film_oid,
      'commentOid': filmOperate.comment_oid,
      'parise': filmOperate.parise,
      'pariseUserOid': filmOperate.parise_user_oid,
      'pariserUser': filmOperate.pariser_user,
      'pariseTime': filmOperate.parise_time,
    };
    return this.http.post(url, body);
  }

  /**
   * 更新点赞
   * add by zyx 2019-5-5
   * @returns {Observable<any>}
   */
  updateFilmOperate(filmOperate: Filmoperate): Observable<any> {
    const url = '/film/updateFilmOperate';
    const body = {
      'oid': filmOperate.oid,
      'filmOid': filmOperate.film_oid,
      'commentOid': filmOperate.comment_oid,
      'parise': filmOperate.parise,
      'pariseUserOid': filmOperate.parise_user_oid,
      'pariserUser': filmOperate.pariser_user,
      'pariseTime': filmOperate.parise_time,
    };
    return this.http.post(url, body);
  }

}
