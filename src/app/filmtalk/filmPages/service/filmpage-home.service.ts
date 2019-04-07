import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmpageHomeService {

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

}
