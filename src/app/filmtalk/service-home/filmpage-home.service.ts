import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../shared/model/user';
import {Film} from '../../shared/model/film';

@Injectable({
  providedIn: 'root'
})
export class FilmpageHomeService {

  refreshPageHome: EventEmitter<string> = new EventEmitter();  // 刷新首页
  userPageHome: EventEmitter<User> = new EventEmitter();  // 首页人员信息

  constructor(private http: HttpClient) {
  }


  /**
   * 获取首页数据
   * add by zyx 2019-4-7
   * @returns {Observable<any>}
   */
  getPageData(): Observable<any> {
    const url = '/film/query';
    const body = {
    };
    return this.http.post(url, body);
  }


  /**
   * 新增电影
   * @returns {Observable<any>}
   */
  insertFilm(film: Film): Observable<any> {
    const url = '/film/insertFilm';
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
      'star': 0,
      'film_staus': film.film_staus,
      'isValid': film.isValid
    };
    return this.http.post(url, body);
  }
}
