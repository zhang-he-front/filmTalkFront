import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {User} from "../../model/user";
import {UserHomeService} from "../../service/user-home.service";
import {Router} from "@angular/router";
import {Observable, Observer} from "rxjs/index";
declare var $: any;

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Output()
  closeUserModel: EventEmitter<string> = new EventEmitter(); //关闭个人信息模态框,刷新页面

  userInfoForm: FormGroup;
  user: User = new User();
  createTime: any; //注册时间
  updateTime: any;  //最新修改时间

  dateFormat = 'yyyy-MM-dd HH:mm:ss';  //日期显示格式

  constructor(private fb: FormBuilder,
              private userHomeService: UserHomeService,
              private router: Router) {
    this.userInfoForm = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      createTime: '',  //注册时间
      updateTime: '', //最新修改时间
    });
  }

  ngOnInit() {

  }

  //展示个人信息
  showUserInfo(){
    let create = new Date(this.user.createTime);
    this.createTime = create.getFullYear() + '-' + ((create.getMonth() + 1) > 10 ? (create.getMonth() + 1) : ('0' + (create.getMonth() + 1)))
                      + '-' + (create.getDate() > 10 ? create.getDate() : ('0' + create.getDate())) + ' ' + create.getHours() + ':' + create.getMinutes() + ':' + create.getSeconds();
    let update = new Date(this.user.updateTime);
    this.updateTime = update.getFullYear() + '-' + ((update.getMonth() + 1) > 10 ? (update.getMonth() + 1) : ('0' + (update.getMonth() + 1)))
                       + '-' + (update.getDate() > 10 ? update.getDate() : ('0' + update.getDate())) + ' ' + update.getHours() + ':' + update.getMinutes() + ':' + update.getSeconds();
    $('.userName').val(this.user.username);
    $('.email').val(this.user.email);
  }

  //保存提交
  onSubmit(){
    for (const key in this.userInfoForm.controls) {
      this.userInfoForm.controls[key].markAsDirty();
      this.userInfoForm.controls[key].updateValueAndValidity();
    }
    let updateUser = new User();
    updateUser.oid = this.user.oid;
    updateUser.username = $('.userName').val();
    updateUser.email = $('.email').val();
    this.userHomeService.updateUserByOid(updateUser).subscribe(str => {
      if(str.msg == '成功'){
        alert('修改成功，需重新登陆后生效');
        this.closeUserModel.emit('okUserModel');
      } else{
        alert('修改失败');
      }
    });
  }

  // 取消按钮/x按钮--关闭模态框
  cancel(){
    this.closeUserModel.emit('cancelUserModel');
  }

}
