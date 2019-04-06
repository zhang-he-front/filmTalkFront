/**
 * 电影数据实体类
 */

export class Film {
  oid: string;
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
}
