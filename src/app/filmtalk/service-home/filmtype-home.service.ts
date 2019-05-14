import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilmtypeHomeService {

  refreshTypeHome: EventEmitter<string> = new EventEmitter();  // 刷新类型页

  constructor(private http: HttpClient) {
  }


  /**
   * 新增电影类型
   * add by zyx 2019-4-7
   * @returns {Observable<any>}
   */
  createFilmType(type_name: any, oid: number): Observable<any> {
    const url = '/filmType/insert';
    const body = {
      'createOid': oid,
      'typeName': type_name
    };
    return this.http.post(url, body);
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
   * @param {number} all_type
   * @param {number} all_location
   * @param {number} all_year
   * @param {number} all_myself
   * @param filmName
   * @returns {Observable<any>}
   */
  queryFilmByFilmTypeOidOrFilmName(all_type: number,all_location: number,all_year: number,all_myself:number, filmName: any): Observable<any> {
    const url = '/film/queryFilmByFilmTypeOidOrFilmName';
    const body = {
      'allType': all_type,
      'allLocation': all_location,
      'allYear': all_year,
      'allMyself': all_myself,
      'filmName': filmName
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

  /**
   * 根据电影类型名称获取同类型的电影
   * add by zyx 2019-5-12
   * @returns {Observable<any>}
   */
  getTypesByName(filmType: string): Observable<any> {
    const url = '/filmType/getTypesByName';
    const body = {
      'typeName': filmType
    };
    return this.http.post(url, body);
  }

  /**
   * 删除当前登陆者自定义的类型
   * add by zyx 2019-5-14
   * @returns {Observable<any>}
   */
  deleteTypeByCurrentUser(): Observable<any> {
    const url = '/filmType/deleteTypeByCurrentUser';
    const body = {
    };
    return this.http.post(url, body);
  }

}
