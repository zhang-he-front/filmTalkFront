import {Component, OnInit} from '@angular/core';
import {FilmtypeHomeService} from "../../service/filmtype-home.service";
import {isUndefined} from "util";

declare var $: any;

@Component({
  selector: 'app-film-type-home',
  templateUrl: './film-type-home.component.html',
  styleUrls: ['./film-type-home.component.css']
})
export class FilmTypeHomeComponent implements OnInit {
  filmName: string = null;    //根据电影名模糊查询
  fimType: any[] = []; //电影所有类型
  films: any[] = []; //电影信息
  filmHots: any[] = []; //电影信息热度
  oid: any; //电影类型oid
  isExistFilm: boolean = false;    // 是否存在电影

  constructor(private filmtypeHomeService: FilmtypeHomeService) {
  }

  ngOnInit() {
    this.getFilmType();
    this.getFilmCommentCountInfo();
    this.getFilmByFilmTypeOidOrFilmName();
    //刷新电影类型
    this.filmtypeHomeService.refreshTypeHome.subscribe(val => {
      this.getFilmType();
    });
  }

  //查询电影类型
  getFilmType() {
    this.fimType = [];
    this.filmtypeHomeService.queryFilmType().subscribe(str => {
      if (str.code == 0) {
        for (let i = 0; i < str.data.length; i++) {
          this.fimType.push({
            "oid": str.data[i].oid,
            "type_name": str.data[i].type_name
          });
        }
      }
    });
  }

  //获取电影评论热度
  getFilmCommentCountInfo() {
    this.filmtypeHomeService.queryFilmCommentCountInfo().subscribe(res => {
      this.filmHots = [];
      let length = res.data.length;
      if(length > 10){
        length = 10;
      }
      for (let i = 0; i < length; i++) {
        this.filmHots.push({
          "oid": res.data[i].oid,
          "film_name": res.data[i].film_name,
          "image_path": res.data[i].image_path,
          "hot": res.data[i].hot
        });
      }
      console.log(res);
    });
  }

  getFilmByFilmTypeOidOrFilmName() {
    this.filmtypeHomeService.queryFilmByFilmTypeOidOrFilmName(this.oid, this.filmName).subscribe(res => {
      this.films = [];
      if(!isUndefined(res)){
        if(res.data.length < 1){
          this.isExistFilm = true;
        } else{
          this.isExistFilm = false;
          for (let i = 0; i < res.data.length; i++) {
            let a = new Date(res.data[i].showTime);
            this.films.push({
              "oid": res.data[i].oid,
              "film_name": res.data[i].filmName,
              "filmType": res.data[i].filmType,
              "image_path": res.data[i].imagePath,
              "film_language": res.data[i].language,
              "location": res.data[i].location,
              "show_time": a.getFullYear() + "-" + (a.getMonth() + 1) + "-" + a.getDate(),
              "hour": res.data[i].hour,
              "star": res.data[i].star.split(".")[0] + "." + res.data[i].star.split(".")[1].substring(0, 1)
            });
          }
        }
      } else {
        this.isExistFilm = true;
      }
    });
  }

  // 获取类型
  showTab(oid: number) {
    this.oid = oid;
    this.getFilmByFilmTypeOidOrFilmName();
  }

  //获取电影名称
  searchTitle(): void {
    if (this.filmName != null) {
      if (this.filmName.replace(/^\s+|\s+$/g, '') === '') {
        this.filmName = null;
      }
    }
    this.getFilmByFilmTypeOidOrFilmName();
  }
}
