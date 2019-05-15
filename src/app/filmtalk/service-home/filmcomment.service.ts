import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {FilmReply} from '../../shared/model/filmreply';
import {Filmoperate} from '../../shared/model/filmoperate';
import {UserRePost} from '../../shared/model/userrepost';
import {Film} from "../../shared/model/film";

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
  getFilmData(oid: number, flag: string): Observable<any> {
    const url = '/film/queryDetail';
    const body = {
      'currentUserOid': oid,
      'flag': flag
    };
    return this.http.post(url, body);
  }

  /**
   * 根据电影oid获取评论信息
   * add by zyx 2019-4-12
   * @returns {Observable<any>}
   */
  getCommentDataByFlmOid(filmId: any, currentUserOid: number, flag: string): Observable<any> {
    const url = '/comment/query';
    const body = {
      'filmId': filmId,
      'currentUserOid': currentUserOid,
      'flag': flag
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
      'replyPersonId': filmReply.replyperson_oid,
      'replyPersonName': filmReply.replyperson_name,
      'flag': filmReply.flag,
      'isRead': filmReply.isread,
      'informerOid': filmReply.informer_oid,
      'informerIsRead': filmReply.informer_isread
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
  getFilmDataByFilmOid(filmOid: any, userId: number): Observable<any> {
    const url = '/film/queryFilmByOid';
    const body = {
      'filmOid': filmOid,
      'userId': userId
    };
    return this.http.post(url, body);
  }

  /**
   * 根据oid查询是否点赞了
   * add by zyx 2019-4-30
   * @returns {Observable<any>}
   */
  queryFilmOperate(filmOid: number, commentOid: number, userid: number, flag: string): Observable<any> {
    const url = '/film/queryFilmOperatePrise';
    const body = {
      'filmOid': filmOid,
      'commentOid': commentOid,
      'userId': userid,
      'flag': flag
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
      'flag': filmOperate.flag,
      'isRead': filmOperate.isread,
      'informerOid': filmOperate.informer_oid,
      'informerIsRead': filmOperate.informer_isread
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

  /**
   * 电影转发
   * add by zyx 2019-5-8
   * @returns {Observable<any>}
   */
  rePostFilm(repost: UserRePost): Observable<any> {
    const url = '/film/rePostFilm';
    const body = {
      'filmOid': repost.film_oid,
      'replyOid': repost.reply_oid,
      'reason': repost.reason,
      'isRead': repost.isread,
      'informerOid': repost.informer_oid,
      'informerIsRead': repost.informer_isread
    };
    return this.http.post(url, body);
  }

  /**
   * 删除电影
   * add by zyx 2019-5-10
   * @returns {Observable<any>}
   */
  deleteFilm(oid: number): Observable<any> {
    const url = '/film/deleteFilm';
    const body = {
      'oid': oid
    };
    return this.http.post(url, body);
  }

  /**
   * 修改电影
   * add by zyx 2019-5-15
   * @returns {Observable<any>}
   */
  updateFilm(film: Film): Observable<any> {
    const url = '/film/updateFilm';
    const body = {
      'oid': film.oid,
      'film_name': film.film_name,
      'hour_length': film.hour_length,
      'show_time': film.show_time,
      'filmType': film.filmType,
      'roles': film.roles,
      'director': film.director,
      'producer': film.producer,
      'film_language': film.film_language,
      'location': film.location,
      'film_detail': film.film_detail,
      'image_path': film.image_path,
      'film_staus': film.film_staus,
      'add_image': film.add_image
    };
    return this.http.post(url, body);
  }

}
