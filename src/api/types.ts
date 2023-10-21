// * 分页请求参数
export interface ReqPage {
  page: number
  limit: number
}

// * 分页响应参数
export interface PageRes<T> {
  records: T[]
  // 当前页
  page: number
  // 每页显示条数
  limit: number
  // 总页数
  pages: number
  // 总条数
  total: number
}
