/**
 * 电影数据实体类
 */

export class Filmtype {
  oid: number;
  type_name: string;             // 电影类型名称
  create_time: string;             // 创建时间
  update_time: string;             // 更新时间
  isValid: string;  //删除表示，0-正常 1-删除
}
