/**
 * @description 微信录音管理器类
 */
const plugin = requirePlugin('WechatSI')
interface IRecorderManagerClass {
  //  录音最大时长 单位s
  maxDuration?: number
  //  录音达到最大时长回调函数
  recordCallback?: (params: IRecordCallback) => void
}
export interface IRecordCallback {
  tempFilePath: string
  duration: number
  fileSize: number
  result: string
}

export class RecorderManagerClass {
  //   录音管理器实例
  private recorderManager: any
  //   录音文件的持续时长
  private readonly maxDuration: number
  //   是否正在录制
  private isRecording: boolean
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
    this.maxDuration = params?.maxDuration || 5
    this.isRecording = false
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
    this.recorderManager = plugin.getRecordRecognitionManager()
    this.isRecording = true
    this.startTime = new Date().getTime()
    // 监听录音结束事件
    this.onRecordEnd()
    //  开始录音
    this.recorderManager.start({ duration: 60000, lang: 'zh_CN' })

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
  //   停止录音
  public stopRecord() {
    console.log('停止录音-1')
    if (!this.isRecording) {
      return
    }
    console.log('停止录音-2')
    this.isRecording = false
    this.endTime = new Date().getTime()
    this.recorderManager.stop()
    this.recorderManager = null
    clearInterval(this.recordTimer)
  }
  //   监听录音结束事件
  public onRecordEnd() {
    this.recorderManager.onStop = (res: { tempFilePath: string; duration: number; fileSize: number; result: string }) => {
      this.recordCallback({
        tempFilePath: res.tempFilePath,
        duration: res.duration,
        fileSize: res.fileSize,
        result: res.result
      })
      //  重置所有参数
      this.reset()
    }
  }
  //   重置所有参数
  public reset() {
    this.isRecording = false
    this.startTime = 0
    this.endTime = 0
    this.recordTime = 0
    this.recordTimer = null
  }
}
