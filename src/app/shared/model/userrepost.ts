/**
 * 用户-电影实体类
 */
export class UserRePost {
  oid: number;
  film_oid: number;   // 电影oid
  user_oid: number;   // 转发者oid
  user_name: string;    // 转发者姓名
  create_time: Date; //创建时间
  update_time: Date; //修改时间
  isvalid: number;    //删除表示，0-正常 1-删除
  reason: string; //转发理由
  reply_oid: number; //评论oid

}
