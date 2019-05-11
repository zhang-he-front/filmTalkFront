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
  isread: number; //转发人是否已读：0代表已读，1代表未读
  informer_oid: number; //通知人oid
  informer_isread: number; //通知人是否已读：0已读，1未读

}
