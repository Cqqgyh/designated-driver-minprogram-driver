import { ref } from 'vue'
interface ICountdown {
  // 倒计时长
  hours?: number
  minutes?: number
  // 倒计时秒数 单位秒
  seconds?: number
  // 回调函数,到达持续时长后执行
  callback?: () => void
}

/**
 * 使用倒计时
 * @param param
 */
export const useCountdown = (param?: ICountdown) => {
  const hours = ref(param?.hours || 0)
  const minutes = ref(param?.minutes || 0)
  const seconds = ref(param?.seconds || 0)
  const timer = ref()
  const timeInfo = computed(() => {
    return {
      hours: hours.value,
      minutes: minutes.value,
      seconds: seconds.value
    }
  })
  const timeDateTypeInfo = computed(() => {
    return {
      hours: hours.value < 10 ? '0' + hours.value : hours.value,
      minutes: minutes.value < 10 ? '0' + minutes.value : minutes.value,
      seconds: seconds.value < 10 ? '0' + seconds.value : seconds.value
    }
  })
  const start = () => {
    timer.value = setInterval(() => {
      seconds.value--
      if (seconds.value === -1) {
        seconds.value = 59
        minutes.value--
      }
      if (minutes.value === -1) {
        minutes.value = 59
        hours.value--
      }
      // 如果持续时长存在，则在持续时长结束后自动停止
      if (param && hours.value * 3600 + minutes.value * 60 + seconds.value <= 0) {
        stop()
        param.callback && param.callback()
      }
    }, 1000)
  }
  const stop = () => {
    clearInterval(timer.value)
  }
  const reset = () => {
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
  }
  // 终止定时器，且重置时间
  const stopAndReset = () => {
    clearInterval(timer.value)
    reset()
  }

  onUnmounted(() => {
    clearInterval(timer.value)
    reset()
  })

  return {
    timeInfo,
    timeDateTypeInfo,
    start,
    stop,
    reset,
    stopAndReset
  }
}
