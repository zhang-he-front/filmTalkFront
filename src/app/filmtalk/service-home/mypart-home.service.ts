import { Injectable } from '@angular/core';
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MypartHomeService {

  constructor(private http: HttpClient) { }

  /**
   * 获取电影评论热度
   * add by zyx 2019-4-9
   * @returns {Observable<any>}
   */
  getMyPartData(): Observable<any> {
    const url = '/film/myPart';
    const body = {
    };
    return this.http.post(url, body);
  }

  /**
   * 删除'我的'电影
   * add by zyx 2019-5-10
   * @returns {Observable<any>}
   */
  deleteMyPartFilmByOid(oid: number): Observable<any> {
    const url = '/film/myPart/delete';
    const body = {
      'oid': oid
    };
    return this.http.post(url, body);
  }
}
