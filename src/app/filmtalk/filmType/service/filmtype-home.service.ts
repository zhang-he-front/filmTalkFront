import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FilmtypeHomeService {

  constructor(private http: HttpClient) {
  }


  /**
   * 新增电影类型
   * add by zyx 2019-4-7
   * @returns {Observable<any>}
   */
  createFilmType(type_name: any): Observable<any> {
    const url = '/filmType/insert';
    // const body = {
    // };
    return this.http.post(url, type_name);
  }


  /**
   * 根据名称查询电影类型
   * @param type_name
   * @returns {Observable<any>}
   */
  queryFilmTypeByName(type_name: any): Observable<any> {
    const url = '/filmType/queryFilmTypeByName';
    // const body = {
    //   type_name
    // };
    return this.http.post(url, type_name);
  }


  /**
   * 查询电影类型
   * add by zyx 2019-4-7
   * @returns {Observable<any>}
   */
  queryFilmType(): Observable<any> {
    const url = '/filmType/queryFilmType';
    const body = {};
    return this.http.post(url, body);
  }

  /**
   * 根据类型查询电影信息
   * add by zyx 2019-4-7
   * @param {number} oid 电影类型oid
   * @param filmName 电影名称
   * @returns {Observable<any>}
   */
  queryFilmByFilmTypeOidOrFilmName(oid: number, filmName: any): Observable<any> {
    const url = '/film/queryFilmByFilmTypeOidOrFilmName';
    const body = {
      oid,
      filmName
    };
    return this.http.post(url, body);
  }

  /**
   * 获取电影评论热度
   * add by zyx 2019-4-9
   * @returns {Observable<any>}
   */
  queryFilmCommentCountInfo(): Observable<any> {
    const url = '/filmType/queryFilmCommentCountInfo';
    const body = {};
    return this.http.post(url, body);
  }

}
