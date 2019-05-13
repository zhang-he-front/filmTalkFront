import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './filmtalk/component-home/home/home.component';
import {FilmCommentHomeComponent} from "./filmtalk/component-home/film-comment-home/film-comment-home.component";
import {FilmTypeHomeComponent} from "./filmtalk/component-home/film-type-home/film-type-home.component";
import {FilmDetailComponent} from "./shared/component/film-detail/film-detail.component";
import {UserLoginComponent} from "./shared/component/user-login/user-login.component";
import {MyPartHomeComponent} from "./filmtalk/component-home/my-part-home/my-part-home.component";
import {UserRegisterComponent} from "./shared/component/user-register/user-register.component";

const routes: Routes = [
  {path: '' , component: UserLoginComponent},
  {path: 'register', component: UserRegisterComponent},  //用户登陆页
  // {path: 'home', component: HomeComponent},//首页
  {path: 'home/:userOid', component: HomeComponent},//首页
  {path: 'filmComment/:userOid', component: FilmCommentHomeComponent}, //影评主页
  {path: 'filmType/:userOid', component: FilmTypeHomeComponent}, //分类主页
  {path: 'myPart/:userOid', component: MyPartHomeComponent}, //分类主页
  {path: 'commentDetail', component: FilmDetailComponent},  //电影详情页
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
