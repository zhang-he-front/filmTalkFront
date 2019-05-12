/**
 * 电影评论实体类
 */
export class FilmReply {
  oid: number;
  film_oid: number;   //电影oid
  commentator_oid: number;   //评论人oid
  commentator_name: string;             // 电影名称
  commentator_detail: string;             // 电影名称
  comment_create_time: string;             // 评论时间
  node_parent_oid: number;             // 一级评论oId
  parent_oid: number;             // 评论oid（父级ID，指明回复者回复的是评论者的哪一条消息）
  replyperson_oid: number;             // 回复人oid
  replyperson_name: string;             // 回复人姓名
  reply_create_time: string;             // 回复时间
  create_time: Date; //创建时间
  update_time: Date; //修改时间
  isvalid: number; //删除标识，0-正常 1-删除
  flag: string; //标志位：null代表评论的，repost代表转发页评论的
  isread: number; //0代表已读，1代表未读
  informer_oid: number; //通知人oid
  informer_isread: number; //通知人是否已读：0已读，1未读
}
