import { ref } from 'vue'
interface ITimeIncrease {
  // 最大持续时长
  duration?: number
  // 回调函数,到达持续时长后执行
  callback?: () => void
}

/**
 * 使用时间增长
 * @param param
 */
export const useTimeIncrease = (param?: ITimeIncrease) => {
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
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
      seconds.value++
      if (seconds.value === 60) {
        seconds.value = 0
        minutes.value++
      }
      if (minutes.value === 60) {
        minutes.value = 0
        hours.value++
      }
      // 如果持续时长存在，则在持续时长结束后自动停止
      if (param && param.duration && hours.value * 3600 + minutes.value * 60 + seconds.value >= param.duration) {
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
