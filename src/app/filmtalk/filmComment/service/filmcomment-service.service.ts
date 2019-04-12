import { Injectable } from '@angular/core';
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";

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
   * 根据电影oid获取评论信息
   * add by zyx 2019-4-12
   * @returns {Observable<any>}
   */
  addFilmReply(filmId: any): Observable<any> {
    const url = '/comment/query';
    const body = {
      filmId
    };
    return this.http.post(url, body);
  }
}
