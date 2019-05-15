import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HomeComponent } from './filmtalk/component-home/home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavbarComponent } from './shared/component/navbar/navbar.component';
import { FilmTypeHomeComponent } from './filmtalk/component-home/film-type-home/film-type-home.component';
import {FilmCommentHomeComponent} from "./filmtalk/component-home/film-comment-home/film-comment-home.component";
import { CreateFilmComponent } from './shared/component/create-film/create-film.component';
import { FilmDetailComponent } from './shared/component/film-detail/film-detail.component';
import { UserLoginComponent } from './shared/component/user-login/user-login.component';
import { UserDetailComponent } from './shared/component/user-detail/user-detail.component';
import { FilmRepostComponent } from './shared/component/film-repost/film-repost.component';
import { MyPartHomeComponent } from './filmtalk/component-home/my-part-home/my-part-home.component';
import { UserRegisterComponent } from './shared/component/user-register/user-register.component';
import { FilmInfoComponent } from './shared/component/film-info/film-info.component';
registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FilmTypeHomeComponent,
    FilmCommentHomeComponent,
    CreateFilmComponent,
    FilmDetailComponent,
    UserLoginComponent,
    UserDetailComponent,
    FilmRepostComponent,
    MyPartHomeComponent,
    UserRegisterComponent,
    FilmInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    // { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
