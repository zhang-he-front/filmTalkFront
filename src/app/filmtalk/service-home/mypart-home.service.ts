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
}
