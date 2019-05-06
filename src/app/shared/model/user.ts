/**
 * 用户表数据
 */

export class User {
  oid: number;
  username: string;    // 用户名
  password: string;    // 密码

  email: string;        //邮箱
  role: string;      //角色（admin管理员，common普通用户）
  createTime: Date; //创建时间
  updateTime: Date; //修改时间
  isvalid: number;  //删除标识，0-正常 1-删除
}
