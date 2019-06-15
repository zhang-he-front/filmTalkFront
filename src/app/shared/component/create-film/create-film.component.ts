import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {FilmtypeHomeService} from "../../../filmtalk/service-home/filmtype-home.service";
import {UploadFile} from "ng-zorro-antd/upload";
import {FilmpageHomeService} from "../../../filmtalk/service-home/filmpage-home.service";
import {Film} from "../../model/film";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-create-film',
  templateUrl: './create-film.component.html',
  styleUrls: ['./create-film.component.css']
})
export class CreateFilmComponent implements OnInit {
  @Output()
  closeModel: EventEmitter<string> = new EventEmitter(); //关闭模态框,刷新页面

  filmForm: FormGroup; //表单
  fimTypes: any[] = []; //电影所有类型
  film: Film = new Film();
  //多选select框相关
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfSelectedValue = [];
  // new Date(); 日期选择框相关
  date = null;
  //图片上传相关
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  //textarea框
  filmDetailValue: string;

  typeValue: any;

  constructor(private fb: FormBuilder,
              private filmtypeHomeService: FilmtypeHomeService,
              private filmpageHomeService: FilmpageHomeService,
              private alertMessage: NzMessageService) { }

  ngOnInit() {
    this.createFilmForm();
    this.getFilmType();
  }

  //查询电影类型
  getFilmType() {
    this.filmtypeHomeService.queryFilmType().subscribe(str => {
      if (str.code == 0) {
        const children: Array<{ label: string; value: string }> = [];
        for (let i = 0; i < str.data.length; i++) {
          children.push({ label: str.data[i].type_name, value: str.data[i].oid });
        }
        this.listOfOption = children;
      }
    });
  }

  createFilmForm(){
    this.filmForm = this.fb.group({
      filmName: ['', [Validators.required, this.NoWhitespaceValidator()]],       //  电影名称
      hour: ['', [Validators.required, this.NoWhitespaceValidator()]], //  时长
      showTime: ['', [Validators.required]],       //  上映时间
      selectType: '',       //电影类型
      location: '',       //  上映地点
      language: '',       //  电影语言
      director: '',       //  导演
      producer: '',       //  编剧/制片人
      roles: '',       //  主演
      filmDetail: '' //电影简介
    });
  }

  initFilmForm(){
    this.filmForm = this.fb.group({
      filmName: '',       //  电影名称
      hour: '', //  时长
      showTime: '',       //  上映时间
      selectType: '',       //电影类型
      location: '',       //  上映地点
      language: '',       //  电影语言
      director: '',       //  导演
      producer: '',       //  编剧/制片人
      roles: '',       //  主演
      filmDetail: '' //电影简介
    });
  }


  //提交
  onSubmit(){
    for (const i in this.filmForm.controls) {  // 数据校验
      this.filmForm.controls[i].markAsDirty();
      this.filmForm.controls[i].updateValueAndValidity();
    }
    if (this.filmForm.invalid === true) {
      return;
    }
    this.film.film_name = this.filmForm.get('filmName').value; // title
    this.film.hour_length = this.filmForm.get('hour').value; // location
    this.film.show_time = new Date(this.date).getFullYear() + "-"
      + ((new Date(this.date).getMonth() + 1) > 10 ? (new Date(this.date).getMonth() + 1) : ('0' + (new Date(this.date).getMonth() + 1))) + "-"
      + (new Date(this.date).getDate() > 10 ? new Date(this.date).getDate() : ('0' + new Date(this.date).getDate()));
    let arr = "";
    for(let j = 0; j < this.listOfSelectedValue.length; j++){
      if(this.listOfSelectedValue[j] != '' && this.listOfSelectedValue[j] != null){
        arr += this.listOfSelectedValue[j] + ",";
      }
    }
    this.film.filmType = arr;
    this.film.roles = this.filmForm.get('roles').value; // location ;
    this.film.director = this.filmForm.get('director').value; // location ;
    this.film.producer = this.filmForm.get('producer').value; // location ;
    this.film.film_language = this.filmForm.get('language').value; // location ;
    this.film.location = this.filmForm.get('location').value; // location ;
    this.film.film_detail = this.filmForm.get('filmDetail').value; // location ;
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
    this.film.film_staus = 1;
    this.film.isValid = 0;
    this.film.oid = 0;

    this.filmpageHomeService.insertFilm(this.film).subscribe(str => {
      if (str.code == 0) {
        this.fileList = [];
        this.closeModel.emit("closeAndRefresh");
        this.alertMessage.success('新建成功', {
          nzDuration: 1500
        });
      } else{
        this.closeModel.emit("closeModel");
        this.alertMessage.error('新建失败', {
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

  //时间选择框
  onChange(result: Date): void {
    // console.log('onChange: ', result);
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
