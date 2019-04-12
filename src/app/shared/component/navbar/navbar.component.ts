import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Filmtype} from "../../model/filmtype";
import {FilmtypeHomeService} from "../../../filmtalk/filmType/service/filmtype-home.service";
import {NzMessageService} from "ng-zorro-antd";
import {CreateFilmComponent} from "../create-film/create-film.component";
import {FilmpageHomeService} from "../../../filmtalk/filmPages/service/filmpage-home.service";

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('createFilm') createFilm: CreateFilmComponent;  // 导航栏电影
  typeForm: FormGroup;
  filmType: Filmtype = new Filmtype();
  isVisible: boolean = false;
  isTypeVisible: boolean = false;


  constructor(private fb: FormBuilder,
              private filmtypeHomeService: FilmtypeHomeService,
              private alertMessage: NzMessageService,
              private filmpageHomeService: FilmpageHomeService) {
  }

  ngOnInit() {
    this.createTypeForm();
  }

  //展示电影模态框
  showFilmModal() {
    this.isVisible = true;
    this.createFilm.createFilmForm();
  }

  handleCancel() {
    this.isVisible = false;
  }

  handleOk() {
    this.isVisible = false;
  }

  //关闭模态框,刷新页面
  closeModel(str: any) {
    if (str == "closeAndRefresh") {
      this.filmpageHomeService.refreshPageHome.emit("refreshPageHome");
    } else {
      this.handleCancel();
    }
  }

  //关闭电影模态框
  hideFilmModal() {
    $('#myFilm').modal('hide');
  }


  //关闭电影分类模态框
  handleTypeCancel() {
    this.isTypeVisible = false;
  }

  //关闭电影分类模态框
  handleTypeOk() {
    this.isTypeVisible = false;
  }

  //展示电影分类模态框
  showFilmTypeModal() {
    this.isTypeVisible = true;
    this.createTypeForm();
  }

  createTypeForm(): void {
    this.typeForm = this.fb.group({
      TYPENAME: ['', [Validators.required, this.NoWhitespaceValidator()]],       //  任务类型
    });
  }

  clearTypeForm() {
    this.typeForm.reset({
      TYPENAME: '',       //  任务类型
    });
  }

  // 提交
  onSubmit(): void {
    let type_name = "";
    for (const i in this.typeForm.controls) {  // 数据校验
      this.typeForm.controls[i].markAsDirty();
      this.typeForm.controls[i].updateValueAndValidity();
    }
    if (this.typeForm.invalid === true) {
      return;
    }
    type_name = this.typeForm.get('TYPENAME').value; // title
    this.filmtypeHomeService.queryFilmTypeByName(type_name).subscribe(str => {
      if (str.code == 0) {
        this.filmtypeHomeService.createFilmType(type_name).subscribe(res => {
          if (res.code == 0) {
            this.typeCancel();
            this.filmtypeHomeService.refreshTypeHome.emit("refreshTypeHome");
            this.alertMessage.success('新建成功', {
              nzDuration: 1500
            });
          } else {
            this.typeCancel();
            this.alertMessage.error('新建失败', {
              nzDuration: 1500
            });
          }
        });
      } else {
        this.alertMessage.warning('该数据存在', {
          nzDuration: 1500
        });
      }
    });
  }

  //取消
  typeCancel(): void {
    this.isTypeVisible = false;
  }

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
