/**
 * 电影数据实体类
 */

export class Filmtype {
  oid: number;
  type_name: string;             // 电影类型名称
  types: number;   //大类型
  create_time: string;             // 创建时间
  update_time: string;             // 更新时间
  isValid: string;  //删除表示，0-正常 1-删除
  typesFlag: number;  //全部标志
  typesFlagName: string;  //全部标志代表的值
}
