import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs/index';
import {UserHomeService} from '../../service/user-home.service';
import {User} from '../../model/user';
import {NzMessageService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';
import {UserRegisterComponent} from "../user-register/user-register.component";

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  @ViewChild('navbar') navbar: NavbarComponent;  //导航栏
  @ViewChild('userRegister') userRegister: UserRegisterComponent;  //注册组件
  validateForm: FormGroup;
  user: User = new User();
  currentUser: User = new User;
  isHidden: boolean = true;
  loginHidden: boolean = false;
  registerHidden: boolean = true;

  constructor(private fb: FormBuilder,
              private userHomeService: UserHomeService,
              private alertMessage: NzMessageService,
              private router: Router) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required], [this.userNameAsyncValidator]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }


  //登陆
  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.user.password = value.password;
    this.user.username = value.userName;
    this.userHomeService.login(this.user).subscribe(str => {
      if(str.data != null){
        this.currentUser = str.data;
        this.isHidden = false;
        this.loginHidden = true;
        this.registerHidden = true;
        this.navbar.currentUser = this.currentUser;
        this.router.navigate(['home/'+ this.currentUser.oid +'']);
        this.navbar.getInformData();
        this.navbar.openTimer();
      } else{
        this.alertMessage.error('用户名或密码错误', {
          nzDuration: 1500
        });
        this.isHidden = true;
        this.loginHidden = false;
        this.registerHidden = true;
      }
    });

  };

  //重置表单
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.loginHidden = true;
    this.isHidden = true;
    this.registerHidden = false;
    this.router.navigate(['/register']);
  }

  //userName校验
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  //退出登陆
  userLayout(){
    this.isHidden = true;
    this.loginHidden = false;
    this.registerHidden = true;
    this.currentUser = null;
  }

  //注册成功后登陆
  toLogin(){
    this.loginHidden = false;
    this.registerHidden = true;
    this.isHidden = true;
  }
}
