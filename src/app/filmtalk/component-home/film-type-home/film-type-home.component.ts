import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {isUndefined} from 'util';
import {ActivatedRoute} from '@angular/router';
import {Filmtype} from '../../../shared/model/filmtype';
import {User} from '../../../shared/model/user';
import {FilmtypeHomeService} from '../../service-home/filmtype-home.service';
import {UserHomeService} from '../../../shared/service/user-home.service';

declare var $: any;

@Component({
  selector: 'app-film-type-home',
  templateUrl: './film-type-home.component.html',
  styleUrls: ['./film-type-home.component.css']
})
export class FilmTypeHomeComponent implements OnInit {
  //查询条件
  filmName: string = null;    //根据电影名模糊查询
  all_type: number = 0;
  all_location: number = 0;
  all_year: number = 0;
  all_myself: number = 0;

  allType: Filmtype[] = []; //全部类型
  allLocation: Filmtype[] = [];  //全部地区
  allYears: Filmtype[] = []; //全部年代
  allMyself: Filmtype[] = []; //全部特色
  films: any[] = []; //电影信息
  filmHots: any[] = []; //电影信息热度
  oid: any; //电影类型oid
  isExistFilm: boolean = false;    // 是否存在电影
  currentUser: User = new User(); //当前登陆者

  tags = [];
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement') inputElement: ElementRef;

  handleClose(removedTag: {}): void {
    this.tags = this.tags.filter(tag => tag !== removedTag);
  }

  showInput(): void {
    this.inputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(): void {
    if (this.inputValue && this.tags.indexOf(this.inputValue) === -1) {
      this.tags = [...this.tags, this.inputValue];
    }
    if(this.inputValue != ''){
      this.filmtypeHomeService.queryFilmTypeByName(this.inputValue).subscribe(str => {
        if (str.code == 0) {
          this.filmtypeHomeService.createFilmType(this.inputValue, this.currentUser.oid).subscribe(res => {
            this.inputValue = '';
            this.inputVisible = false;
            if(res.msg == '成功'){
              this.getFilmType();
            } else {
              alert('添加失败');
            }
          });
        } else {
          alert('该类型已存在');
        }
      });
    } else {
      this.inputValue = '';
      this.inputVisible = false;
    }
  }


  constructor(private filmtypeHomeService: FilmtypeHomeService,
              private routeInfo: ActivatedRoute,
              private userHomeService: UserHomeService) {
  }

  ngOnInit() {
    this.getFilmType();
    this.getFilmCommentCountInfo();
    this.getFilmByFilmTypeOidOrFilmName();
    //刷新电影类型
    this.filmtypeHomeService.refreshTypeHome.subscribe(val => {
      this.getFilmType();
    });

    let userOid = this.routeInfo.snapshot.params['userOid'];
    if (userOid) {
      this.getUserByOid(userOid);
    }
  }

  //根据oid获取人员信息
  getUserByOid(userOid: number) {
    this.userHomeService.getUserByOid(userOid).subscribe(res => {
      this.currentUser = res.data;
    });
  }

  //查询电影类型
  getFilmType() {
    this.allType = [];
    this.allLocation = [];
    this.allYears = [];
    this.allMyself = [];
    this.filmtypeHomeService.queryFilmType().subscribe(str => {
      if (str.code == 0) {
        for (let i = 0; i < str.data.length; i++) {
          let type = new Filmtype();
          type.oid = str.data[i].oid;
          type.type_name = str.data[i].type_name;
          type.types = str.data[i].types;
          if (str.data[i].types == 1) { //全部类型
            type.typesFlag = 1;
            type.typesFlagName = '全部类型';
            this.allType.push(type);
          } else if (str.data[i].types == 2) {  //全部地区
            type.typesFlag = 2;
            type.typesFlagName = '全部地区';
            this.allLocation.push(type);
          } else if (str.data[i].types == 3) {  //全部年代
            type.typesFlag = 3;
            type.typesFlagName = '全部年代';
            this.allYears.push(type);
          } else { //全部特色
            type.typesFlag = 4;
            type.typesFlagName = '全部特色';
            this.allMyself.push(type);
          }
        }
      }
    });
  }

  //获取电影评论热度
  getFilmCommentCountInfo() {
    this.filmtypeHomeService.queryFilmCommentCountInfo().subscribe(res => {
      this.filmHots = [];
      let length = res.data.length;
      if (length > 10) {
        length = 10;
      }
      for (let i = 0; i < length; i++) {
        this.filmHots.push({
          'oid': res.data[i].oid,
          'film_name': res.data[i].film_name,
          'image_path': res.data[i].image_path,
          'hot': res.data[i].hot
        });
      }
      // console.log(res);
    });
  }

  //根据类型查询电影信息
  getFilmByFilmTypeOidOrFilmName() {
    this.filmtypeHomeService.queryFilmByFilmTypeOidOrFilmName(this.all_type,this.all_location, this.all_year, this.all_myself, this.filmName).subscribe(res => {
      this.films = [];
      if (!isUndefined(res)) {
        if (res.data.length < 1) {
          this.isExistFilm = true;
        } else {
          this.isExistFilm = false;
          for (let i = 0; i < res.data.length; i++) {
            let a = new Date(res.data[i].showTime);
            let star = res.data[i].star;
            if (res.data[i].star != 0) {
              if (res.data[i].star.split('.')[1] == '0') {
                star = parseInt(res.data[i].star.split('.')[0]);
              }
            } else {
              star = 0;
            }

            this.films.push({
              'oid': res.data[i].oid,
              'film_name': res.data[i].filmName,
              'filmType': res.data[i].filmType,
              'image_path': res.data[i].imagePath,
              'film_language': res.data[i].language,
              'location': res.data[i].location,
              'show_time': a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate(),
              'hour': res.data[i].hour,
              'star': star
            });
          }
        }
      } else {
        this.isExistFilm = true;
      }
    });
  }

  //获取类型
  showAllTab(types: number){
    this.all_type = types;
    this.getFilmByFilmTypeOidOrFilmName();
  }

  showLocationTab(types: number){
    this.all_location = types;
    this.getFilmByFilmTypeOidOrFilmName();
  }

  showYearTab(types: number){
    this.all_year = types;
    this.getFilmByFilmTypeOidOrFilmName();
  }

  showMySelfTab(types: number){
    this.all_myself = types;
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
