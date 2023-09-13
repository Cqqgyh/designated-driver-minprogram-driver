// 用于轮询的定时器创建
interface ITimerClass {
  time?: number
  callback?: () => void
}
export class TimerClass {
  //   存放定时器实例
  private timer: any
  //   定时器执行周期时间 ms
  private readonly time: number
  //   定时器执行的回调函数
  private readonly callback: () => void
  //   定时器是否正在运行
  private isRunning: boolean
  constructor(params: ITimerClass = {}) {
    this.time = params.time || 3000
    this.callback = params.callback || (() => {})
    this.isRunning = false
  }
  public start() {
    if (this.isRunning) {
      return
    }
    // 立即执行一次
    this.callback()
    this.isRunning = true
    this.timer = setInterval(() => {
      this.callback()
    }, this.time)
  }
  public stop() {
    if (!this.isRunning) {
      return
    }
    this.isRunning = false
    clearInterval(this.timer)
  }
}
