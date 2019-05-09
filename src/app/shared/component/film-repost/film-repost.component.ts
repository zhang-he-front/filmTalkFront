import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {UserRePost} from "../../model/userrepost";
import {FilmcommentServiceService} from "../../../filmtalk/service-home/filmcomment.service";
import {NzMessageService} from "ng-zorro-antd";
import {FilmReply} from "../../model/filmreply";

@Component({
  selector: 'app-film-repost',
  templateUrl: './film-repost.component.html',
  styleUrls: ['./film-repost.component.css']
})
export class FilmRepostComponent implements OnInit {
  @Output()
  closeRePostModel: EventEmitter<string> = new EventEmitter(); //关闭模态框

  rePostReasonValue: string;  //转发内容textarea框
  filmRePostForm: FormGroup; //表单
  userRePost: UserRePost = new UserRePost();

  constructor(private fb: FormBuilder,
              private filmcommentService: FilmcommentServiceService,
              private alertMessage: NzMessageService,) { }

  ngOnInit() {
    this.createFilmForm();
  }

  createFilmForm(){
    this.filmRePostForm = this.fb.group({
      rePostReason: '' //转发理由
    });
  }

  //提交
  onSubmit(){
    this.userRePost.reason = this.rePostReasonValue;
    this.filmcommentService.rePostFilm(this.userRePost).subscribe(res => {
      if(res.msg == '成功'){
        this.cancel();
        this.alertMessage.success('转发成功', {
          nzDuration: 1500
        });
      } else {
        alert('转发失败');
      }
    });
  }

  //取消
  cancel(){
    this.closeRePostModel.emit("closeRePostModel");
  }

}
