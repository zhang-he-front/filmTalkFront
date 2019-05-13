import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user';

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
      'password': user.password,
      'email': user.email,
      'role': user.role,
      'isValid': user.isvalid
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

  /**
   * 根据oid获取用户信息
   * add by zyx 2019-5-7
   * @returns {Observable<any>}
   */
  getUserByOid(userOid: number): Observable<any> {
    const url = '/user/getUserByOid';
    const body = {
      'oid': userOid
    };
    return this.http.post(url, body);
  }

  /**
   * 根据oid获取用户信息
   * add by zyx 2019-5-7
   * @returns {Observable<any>}
   */
  getUserByUserName(username: string): Observable<any> {
    const url = '/user/getUserByUserName';
    const body = {
      'username': username
    };
    return this.http.post(url, body);
  }
}
