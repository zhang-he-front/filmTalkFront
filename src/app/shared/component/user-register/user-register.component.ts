import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn,
  Validators
} from "@angular/forms";
import {UserHomeService} from "../../service/user-home.service";
import {NzMessageService} from "ng-zorro-antd";
import {Observable, Observer} from "rxjs/index";
import {User} from "../../model/user";

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  @Output()
  toLogin: EventEmitter<string> = new EventEmitter(); //登陆
  registerForm: FormGroup;
  registerHidden: boolean = false;

  constructor(private fb: FormBuilder,
              private userHomeService: UserHomeService,
              private alertMessage: NzMessageService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required], [this.userNameAsyncValidator]],
      pwd: ['', [Validators.required, this.lengthValidator]],
      email: ['', [Validators.email, Validators.required]],
    });
  }

  ngOnInit() {
  }

  //注册
  submitForm = ($event: any, value: any) => {
    $event.preventDefault();
    for (const key in this.registerForm.controls) {
      this.registerForm.controls[key].markAsDirty();
      this.registerForm.controls[key].updateValueAndValidity();
    }
    let user = new User();
    user.username = value.name;
    user.password = value.pwd;
    user.email = value.email;
    user.role = 'common';
    user.isvalid = 0;
    this.userHomeService.getUserByUserName(user.username).subscribe(res => {
      if(res.data == null){
        this.userHomeService.register(user).subscribe(str => {
          if(str.msg == '成功'){
            this.registerHidden = true;
            this.registerForm.reset();
            this.toLogin.emit('toLogin');
            this.alertMessage.success('注册成功', {
              nzDuration: 1500
            });
          } else{
            this.registerHidden = false;
            alert('注册失败');
          }
        });
      } else {
        this.alertMessage.error('该用户名已存在，请重试', {
          nzDuration: 1500
        });
        this.registerHidden = false;
      }
    });
  };

  //重置表单
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.registerForm.reset();
    for (const key in this.registerForm.controls) {
      this.registerForm.controls[key].markAsPristine();
      this.registerForm.controls[key].updateValueAndValidity();
    }
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


  // 自定义开始时间的校验器
  lengthValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value.length < 5) {
      return {minLength: true, error: true};
    } else if (control.value.length > 10) {
      return {maxLength: true, error: true};
    }
  };
}
