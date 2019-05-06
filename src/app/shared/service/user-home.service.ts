import { Injectable } from '@angular/core';
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class UserHomeService {

  constructor(private http: HttpClient) { }


  /**
   * 用户登陆
   * add by zyx 2019-5-6
   * @param {User} user
   * @returns {Observable<any>}
   */
  login(user: User): Observable<any> {
    const url = '/user/login';
    const body = {
      'username': user.username,
      'password': user.password
    };
    return this.http.post(url, body);
  }


  /**
   * 用户注册
   * add by zyx 2019-5-6
   * @param {User} user
   * @returns {Observable<any>}
   */
  register(user: User): Observable<any> {
    const url = '/user/register';
    const body = {
      'username': user.username,
      'password': user.password
    };
    return this.http.post(url, body);
  }

  /**
   * 更新用户信息
   * add by zyx 2019-5-6
   * @param {User} user
   * @returns {Observable<any>}
   */
  updateUserByOid(user: User): Observable<any> {
    const url = '/user/updateUserByOid';
    const body = {
      'oid': user.oid,
      'username': user.username,
      'email': user.email
    };
    return this.http.post(url, body);
  }
}
