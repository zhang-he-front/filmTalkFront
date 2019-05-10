/**
 * 电影及评论操作表数据
 */
export class Filmoperate {
  oid: number;
  film_oid: number;             // 电影oid
  comment_oid: number;             // 评论oid
  parise: number;             // 点赞数
  parise_user_oid: number;             // 点赞者oid
  password: string;             // 密码
  pariser_user: string;             // 姓名
  parise_time: string;             // 点赞时间
  create_time: Date;             // 创建时间
  update_time: Date;             // 修改时间
  isvalid: number;             // 删除标识，0-正常 1-删除
  flag: string; //标志位：null代表评论的，repost代表转发页评论的
}
