import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmpageHomeService {

  constructor(private http: HttpClient) {
  }


  /*
    获取所有日程信息
   */
  getPageData(): Observable<any> {
    const url = 'http://localhost:8080/filmTalk_war_exploded/filmTalk/film/query';
    const body = {

    };
    return this.http.post(url, body);
  }

}
