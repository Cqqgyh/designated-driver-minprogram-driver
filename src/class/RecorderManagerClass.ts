/**
 * @description 微信录音管理器类
 */
interface IRecorderManagerClass {
  //  录音最大时长 单位秒
  maxDuration?: number
  //  录音达到最大时长回调函数
  recordCallback?: (params: IRecordCallback) => void
}
export interface IRecordCallback {
  tempFilePath: string
  duration: number
  fileSize: number
  startTime: number
  endTime: number
  recordTime: number
}

export class RecorderManagerClass {
  //   录音管理器实例
  private recorderManager: any
  //   录音文件的临时路径
  private tempFilePath: string
  //   录音文件的持续时长
  private readonly maxDuration: number
  //   是否正在录制
  private isRecording: boolean
  //   是否暂停
  private isPaused: boolean
  //   是否停止
  private isStoped: boolean
  //   录音开始时间
  private startTime: number
  //   录音结束时间
  private endTime: number
  //   录音时长
  private recordTime: number
  //   录音时长定时器
  private recordTimer: any
  //   录音时长回调函数
  private readonly recordCallback: (params: IRecordCallback) => void
  constructor(params?: IRecorderManagerClass) {
    this.recorderManager = wx.getRecorderManager()
    this.tempFilePath = ''
    this.maxDuration = params?.maxDuration || 5
    this.isRecording = false
    this.isPaused = false
    this.isStoped = false
    this.startTime = 0
    this.endTime = 0
    this.recordTime = 0
    this.recordTimer = null
    this.recordCallback = params?.recordCallback || (() => {})
  }
  //   开始录音
  public startRecord() {
    if (this.isRecording) {
      return
    }
    this.isRecording = true
    this.isPaused = false
    this.isStoped = false
    this.startTime = new Date().getTime()
    this.recorderManager.start({
      format: 'mp3'
    })
    // 监听录音结束事件
    this.onRecordEnd()
    // 监听录音因为受到系统占用而被中断开始事件
    this.onRecordInterruptionBegin()
    // 监听录音中断结束事件
    this.onRecordInterruptionEnd()
    //  开始录音后，每隔1s计算一次录音时长
    this.recordTimer = setInterval(() => {
      //  如果录音时长达到最大时长，则停止录音
      console.log('this.recordTime', this.recordTime)

      if (this.maxDuration && this.recordTime >= this.maxDuration) {
        this.stopRecord()
      }
      this.recordTime++
    }, 1000)
  }
  //   暂停录音
  public pauseRecord() {
    if (!this.isRecording || this.isPaused) {
      return
    }
    this.isPaused = true
    this.recorderManager.pause()
    clearInterval(this.recordTimer)
  }
  //   继续录音
  public resumeRecord() {
    if (!this.isRecording || !this.isPaused) {
      return
    }
    this.isPaused = false
    this.recorderManager.resume()
    this.recordTimer = setInterval(() => {
      //  如果录音时长达到最大时长，则停止录音
      if (this.maxDuration && this.recordTime >= this.maxDuration) {
        this.stopRecord()
      }
      this.recordTime++
    }, 1000)
  }
  //   停止录音
  public stopRecord() {
    if (!this.isRecording || this.isStoped) {
      return
    }
    this.isRecording = false
    this.isStoped = true
    this.endTime = new Date().getTime()
    this.recorderManager.stop()
    clearInterval(this.recordTimer)
  }
  // 监听录音因为受到系统占用而被中断开始事件
  public onRecordInterruptionBegin() {
    this.recorderManager.onInterruptionBegin(() => {
      this.pauseRecord()
    })
  }
  // 监听录音中断结束事件
  public onRecordInterruptionEnd() {
    this.recorderManager.onInterruptionEnd(() => {
      this.resumeRecord()
    })
  }
  //   监听录音结束事件
  public onRecordEnd() {
    // tempFilePath 	string 	录音文件的临时路径 (本地路径)
    // duration 	number 	录音总时长，单位：ms
    // fileSize 	number 	录音文件大小，单位：Byte
    this.recorderManager.onStop((res: { tempFilePath: string; duration: number; fileSize: number }) => {
      this.tempFilePath = res.tempFilePath
      this.recordCallback({
        tempFilePath: this.tempFilePath,
        duration: res.duration,
        fileSize: res.fileSize,
        startTime: this.startTime,
        endTime: this.endTime,
        recordTime: this.recordTime
      })
      //  重置所有参数
      this.reset()
    })
  }
  //   重置所有参数
  public reset() {
    this.tempFilePath = ''
    this.isRecording = false
    this.isPaused = false
    this.isStoped = false
    this.startTime = 0
    this.endTime = 0
    this.recordTime = 0
    this.recordTimer = null
  }
}
