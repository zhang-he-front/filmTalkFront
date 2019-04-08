import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-film',
  templateUrl: './create-film.component.html',
  styleUrls: ['./create-film.component.css']
})
export class CreateFilmComponent implements OnInit {
  filmForm: FormGroup;
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfSelectedValue = ['a10', 'c12'];

  constructor(private fb: FormBuilder,) { }

  ngOnInit() {
    this.createFilmForm();
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;

    // this.listOfOption = children;

  }

  createFilmForm(){
    this.filmForm = this.fb.group({
      filmName: ['', [Validators.required, this.NoWhitespaceValidator()]],       //  电影名称
      hour: ['', [Validators.required, this.NoWhitespaceValidator()]], //  时长
      showTime: ['', [Validators.required, this.NoWhitespaceValidator()]],       //  上映时间
      selectType: '',       //
      location: '',       //  上映地点
      language: '',       //  电影语言
    });
  }

  /**
   * add by GaoYa 2019.01.09
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
