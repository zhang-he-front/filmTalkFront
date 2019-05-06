import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './filmtalk/filmPages/component/home/home.component';
import {FilmCommentHomeComponent} from "./filmtalk/filmComment/component/filmComment-home/film-comment-home.component";
import {FilmTypeHomeComponent} from "./filmtalk/filmType/component/filmType-home/film-type-home.component";
import {FilmDetailComponent} from "./shared/component/film-detail/film-detail.component";
import {UserLoginComponent} from "./shared/component/user-login/user-login.component";

const routes: Routes = [
  {path: '' , component: UserLoginComponent},
  {path: 'home', component: HomeComponent},//首页
  {path: 'filmComment', component: FilmCommentHomeComponent}, //影评主页
  {path: 'filmType', component: FilmTypeHomeComponent}, //分类主页
  {path: 'commentDetail/:filmOid', component: FilmDetailComponent}  //电影详情页
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
