import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Filmtype} from '../../model/filmtype';
import {FilmtypeHomeService} from '../../../filmtalk/service-home/filmtype-home.service';
import {NzMessageService} from 'ng-zorro-antd';
import {CreateFilmComponent} from '../create-film/create-film.component';
import {FilmpageHomeService} from '../../../filmtalk/service-home/filmpage-home.service';
import {Router} from '@angular/router';
import {UserDetailComponent} from '../user-detail/user-detail.component';
import {User} from '../../model/user';
import {Film} from "../../model/film";

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('createFilm') createFilm: CreateFilmComponent;  // 导航栏电影
  @ViewChild('userDetail') userDetail: UserDetailComponent;  // 导航栏--个人信息
  @Output()
  layout: EventEmitter<string> = new EventEmitter(); //退出登陆
  typeForm: FormGroup;
  filmType: Filmtype = new Filmtype();
  isVisible: boolean = false;
  userIsVisible: boolean = false;  //个人信息模态框展示
  isTypeVisible: boolean = false;
  currentUser: User = new User();
  informInfo: any[] = []; //消息集合
  messageLength: number; //消息总数量
  saveLength: number; //消息总数量
  timer;//定时器


  constructor(private fb: FormBuilder,
              private filmtypeHomeService: FilmtypeHomeService,
              private alertMessage: NzMessageService,
              private filmpageHomeService: FilmpageHomeService,
              private router: Router) {
  }

  ngOnInit() {
    this.createTypeForm();
  }

  //定时检测信息
  openTimer(){
    this.timer = setInterval(() => {
      //此处为需要定时执行的方法，5000为间隔的时间，单位是毫秒
      this.getInformData();
    },5000);
  }

  //关闭定时器
  closeTimer(){
    if (this.timer) {
      clearInterval(this.timer);// 销毁定时器
    }
  }


  //获取通知部分数据
  getInformData(){
    this.filmpageHomeService.getInformData().subscribe(res => {
      this.messageLength = res.data.length;
      this.saveLength = this.messageLength;
      this.informInfo = [];
      if(this.messageLength > 9){
        $('.autoStyle').css('height','750px');
        $('.autoStyle').css('overflow-y','scroll');
      }
      for(let i = 0; i < res.data.length; i++){
        let data = res.data[i];
        let film = new Film();
        film.oid = data.filmDetail.oid;
        film.film_name = data.filmDetail.filmName;
        let info;
        if(data.operate == '点赞'){
          info = '赞了我的'
        } else if(data.operate == '转发'){
          info = '转发了我的';
        }else{
          info = '评论了我';
        }
        this.informInfo.push({
          'length': res.data.length,
          'filmDetail': film,
          'operate': data.operate,
          'message': info,
          'operateInfo': data.operateInfo,
          'operateTime': this.timeFormat(data.operateTime),
          'operateName': data.operateName
        });
      }
    });
  }

  /**
   * 时间格式化（将日期格式化为 xx月xx日 xx:xx ）
   */
  timeFormat(operateTime: Date): string {
    let d = new Date(operateTime);
    let date = ((d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '月'
      + (d.getDate() >= 10 ? d.getDate() : ('0' + d.getDate())) + '日 '
      + (d.getHours() >= 10 ? d.getHours() : ('0' + d.getHours())) + ':'
      + (d.getMinutes() >= 10 ? d.getMinutes() : ('0' + d.getMinutes()));
    let current = ((new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1) : ('0' + (new Date().getMonth() + 1))) + '月'
      + (new Date().getDate() >= 10 ? new Date().getDate() : ('0' + new Date().getDate())) + '日 ';
    if(date.split('.')[0] == current){
      return '今天' + date.split(':')[1];
    } else {
      return date;
    }
  }

  //展示通知数据
  showInform(){
    this.messageLength = 0;
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
    if (str == 'closeAndRefresh') {
      this.filmpageHomeService.refreshPageHome.emit('refreshPageHome');
    }
    this.handleCancel();
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
    let type_name = '';
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
            this.filmtypeHomeService.refreshTypeHome.emit('refreshTypeHome');
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
        this.alertMessage.warning('该类型已经存在', {
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

  //展示个人信息模态框
  showUser(){
    this.userDetail.user = this.currentUser;
    this.userDetail.showUserInfo();
    this.userIsVisible = true;
  }

  //取消按钮：关闭人员模态框
  userCancel(){
    this.userIsVisible = false;
  }

  //确定按钮：关闭人员模态框
  userOk(){
    this.userCancel();
  }

  //确定按钮：关闭人员模态框
  closeUserModel($event: any){
    this.userCancel();
    if($event == 'okUserModel'){  //个人信息修改成功，需重新登陆后生效
      this.logint();
    }
  }

  //退出登陆
  logint(){
    this.closeTimer();
    this.router.navigate(['']);
    this.layout.emit('layout');
  }
}
