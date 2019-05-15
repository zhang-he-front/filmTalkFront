import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Film} from "../../model/film";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {FilmpageHomeService} from "../../../filmtalk/service-home/filmpage-home.service";
import {NzMessageService} from "ng-zorro-antd";
import {FilmcommentServiceService} from "../../../filmtalk/service-home/filmcomment.service";
import {User} from "../../model/user";
import {FilmtypeHomeService} from "../../../filmtalk/service-home/filmtype-home.service";
import {UploadFile} from "ng-zorro-antd/upload";
declare var $: any;

@Component({
  selector: 'app-film-info',
  templateUrl: './film-info.component.html',
  styleUrls: ['./film-info.component.css']
})
export class FilmInfoComponent implements OnInit {
  @Output()
  closeModel: EventEmitter<string> = new EventEmitter(); //关闭模态框
  //图片上传相关
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  filmInfoForm: FormGroup; //表单
  film: Film = new Film();
  currentUser: User = new User(); //当前登陆者
  filmOid: number;
  date = null;

  constructor(private fb: FormBuilder,
              private filmCommentServiceService: FilmcommentServiceService,
              private alertMessage: NzMessageService,
              private filmpageHomeService: FilmpageHomeService) { }

  ngOnInit() {
    this.createFilmForm();
  }

  //初始化表单
  createFilmForm(){
    this.filmInfoForm = this.fb.group({
      filmName: ['', [Validators.required, this.NoWhitespaceValidator()]],       //  电影名称
      hour: ['', [Validators.required, this.NoWhitespaceValidator()]], //  时长
      showTime: ['', [Validators.required]],       //  上映时间
      selectType: '',       //电影类型
      location: '',       //  上映地点
      language: '',       //  电影语言
      director: '',       //  导演
      producer: '',       //  编剧/制片人
      filmDetail: '', //电影简介
      roles: '',       //  主演
      filmStatus: ''  //电影状态
    });
  }

  //获取电影数据
  getFilmInfo(filmOid: number){
    this.filmOid = filmOid;
    this.filmCommentServiceService.getFilmDataByFilmOid(filmOid, this.currentUser.oid).subscribe(str => {
      let data = str.data;
      this.filmInfoForm.patchValue({filmName: data.filmName});
      this.filmInfoForm.patchValue({hour: data.hour});
      this.filmInfoForm.patchValue({location: data.location});
      this.filmInfoForm.patchValue({language: data.language});
      this.filmInfoForm.patchValue({producer: data.producer});
      this.filmInfoForm.patchValue({director: data.director});
      this.filmInfoForm.patchValue({filmDetail: data.filmDetail});
      this.filmInfoForm.patchValue({selectType: data.filmType});
      this.filmInfoForm.patchValue({roles: data.roles});
      if(data.filmStatus == 0){ //电影状态，0-在线 1-即将上线 2-下线
        this.filmInfoForm.patchValue({filmStatus: '正在热播'});
      }else if(data.filmStatus == 1){
        this.filmInfoForm.patchValue({filmStatus: '即将上线'});
      } else {
        this.filmInfoForm.patchValue({filmStatus: '马上下架'});
      }
      this.date = new Date(data.showTime);
      this.fileList = [
        {
          name: data.imagePath,
          url: data.imagePath
        }
      ];
    });
  }

  //修改
  onSubmit(){
    for (const i in this.filmInfoForm.controls) {  // 数据校验
      this.filmInfoForm.controls[i].markAsDirty();
      this.filmInfoForm.controls[i].updateValueAndValidity();
    }
    if (this.filmInfoForm.invalid === true) {
      return;
    }
    this.film.oid = this.filmOid;
    this.film.film_name = this.filmInfoForm.get('filmName').value; // title
    this.film.hour_length = this.filmInfoForm.get('hour').value; // location
    this.film.show_time = new Date(this.date).getFullYear() + "-"
      + ((new Date(this.date).getMonth() + 1) > 10 ? (new Date(this.date).getMonth() + 1) : ('0' + (new Date(this.date).getMonth() + 1))) + "-"
      + (new Date(this.date).getDate() > 10 ? new Date(this.date).getDate() : ('0' + new Date(this.date).getDate()));
    this.film.director = this.filmInfoForm.get('director').value;
    this.film.producer = this.filmInfoForm.get('producer').value;
    this.film.film_language = this.filmInfoForm.get('language').value;
    this.film.location = this.filmInfoForm.get('location').value;
    this.film.film_detail = this.filmInfoForm.get('filmDetail').value;
    this.film.roles = this.filmInfoForm.get('roles').value;
    if(this.fileList.length > 0){
      let arr = '';
      for(let i = 0; i < this.fileList.length; i++){
        if(i == 0){
          this.film.image_path = "assets/img/film/future/" + this.fileList[0].name;
        } else{
          arr += "assets/img/film/future/" + this.fileList[i].name + ';';
        }
      }
      this.film.add_image = arr;
    }
    this.filmCommentServiceService.updateFilm(this.film).subscribe(str => {
      if(str.msg == '成功'){
        this.closeModel.emit("closeAndRefresh");
        this.alertMessage.success('修改成功', {
          nzDuration: 1500
        });
      } else {
        this.alertMessage.error('修改失败', {
          nzDuration: 1500
        });
      }
    });
  }

  //删除
  delete(){
    this.filmCommentServiceService.deleteFilm(this.filmOid).subscribe(str => {
      if(str.msg == '成功'){
        this.closeModel.emit("closeAndRefresh");
        this.alertMessage.success('删除成功', {
          nzDuration: 1500
        });
      } else {
        this.alertMessage.success('删除失败', {
          nzDuration: 1500
        });
      }
    });
  }

  //取消
  cancel(){
    this.fileList = [];
    this.closeModel.emit("closeModel");
  }

  //图片上传
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  /**
   * 必填项去空格校验
   */
  NoWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : {'whitespace': 'value is only whitespace'};
    };
  }

}
