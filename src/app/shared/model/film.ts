/**
 * 电影数据实体类
 */
import {UserRePost} from './userrepost';

export class Film {
  oid: number;
  film_name: string;             // 电影名称
  film_detail: string;             // 电影简介
  show_time: string;             // 上映时间
  director: string;             // 导演
  producer: string;             // 制片人
  location: string;             // 地区
  film_language: string;             // 语言
  hour_length: string;             // 时长
  star: string;             // 星级评价
  image_path: string;             // 海报
  film_staus: number;             // 电影状态，0-在线 1-即将上线 2-下线
  isValid: number;          //删除表示，0-正常 1-删除
  create_time: Date; //创建时间
  update_time: Date; //修改时间
  roles: any;
  add_image: string; // 图片

  filmType: string; //类型
  isShowOperate: boolean;     // 是否显示操作按钮
  isCollect: boolean = false;         // 是否收藏标识（默认不收藏）
  isPraise: boolean = false;          // 是否点赞标识（默认不点赞）
  isPraiseNumb: boolean = false;      // 是否显示点赞数（0不显示）
  praiseNumb: number;                 // 点赞数
  numberReply: number;                // 总评论数
  isShowCommentFrame: boolean;
  isShowReply: boolean;
  replyDataSet:any;
  replyChildrenDataSet:any;
  threeReply: any;                    // 显示三条回复
  isMoreBtn: boolean = false;           // 显示评论是否展开按钮
  isMore: number;         // 显示模板展示（0默认三条模板，1默认大于三条模板)
  nzStar: number;
  filmSubCount: number;  //点赞数
  filmSubCountFlag: Boolean; //电影点赞标志
  currentUserIsSub: boolean; //当前登陆者是否点赞了该电影


  //----------我的主页用到的数据-------
  rePostTime: string;  //转发时间
  reason: string; // 转发理由
  userRePost: UserRePost;  //转发信息
  rePostOid: number;  //转发oid
}
