import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Film} from "../../../shared/model/film";
import {User} from "../../../shared/model/user";

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
    const oid = film.oid;
    const film_name = film.film_name;
    const hour_length = film.hour_length;
    const show_time = film.show_time;
    const filmType = film.filmType;
    const roles = film.roles;
    const director = film.director;
    const producer = film.producer;
    const film_language = film.film_language;
    const location = film.location;
    const film_detail = film.film_detail;
    const image_path = film.image_path;
    const star = film.star;
    const film_staus = film.film_staus;
    const isValid = film.isValid;
    const body = {
      oid,
      film_name,
      hour_length,
      show_time,
      filmType,
      roles,
      director,
      producer,
      film_language,
      location,
      film_detail,
      image_path,
      star,
      film_staus,
      isValid
    };
    return this.http.post(url, body);
  }
}
