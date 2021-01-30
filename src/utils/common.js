import { Notification } from 'element-ui'

export { debounce, throttle } from 'lodash-es'

export function pad(num, n = 2) {
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export function formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  date = date instanceof Date ? date : new Date(date)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length),
    )
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str),
      )
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function formatTime(interval) {
  interval = interval | 0
  const minute = pad((interval / 60) | 0)
  const second = pad(interval % 60)
  return `${minute}:${second}`
}

export function formatNumber(number) {
  number = Number(number) || 0
  return number > 100000 ? `${Math.round(number / 10000)}万` : number
}

export function genImgUrl(url, w, h) {
  if (!h) {
    h = w
  }
  url += `?param=${w}y${h}`
  return url
}

export function isLast(index, arr) {
  return index === arr.length - 1
}

export function shallowEqual(a, b, compareKey) {
  if (a.length !== b.length) {
    return false
  }
  for (let i = 0; i < a.length; i++) {
    let compareA = a[i]
    let compareB = b[i]
    if (compareKey) {
      compareA = compareA[compareKey]
      compareB = compareB[compareKey]
    }
    if (!Object.is(a[i], b[i])) {
      return false
    }
  }
  return true
}

export function notify(message, type) {
  const params = {
    message,
    duration: 1500,
  }
  const fn = type ? Notification[type] : Notification
  return fn(params)
}
;['success', 'warning', 'info', 'error'].forEach(key => {
  notify[key] = message => {
    return notify(message, key)
  }
})

export function requestFullScreen(element) {
  const docElm = element
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen()
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen()
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen()
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen()
  }
}

export function exitFullscreen() {
  const de = window.parent.document

  if (de.exitFullscreen) {
    de.exitFullscreen()
  } else if (de.mozCancelFullScreen) {
    de.mozCancelFullScreen()
  } else if (de.webkitCancelFullScreen) {
    de.webkitCancelFullScreen()
  } else if (de.msExitFullscreen) {
    de.msExitFullscreen()
  }
}

export function isFullscreen() {
  return (
    document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
  )
}

export function isUndef(v) {
  return v === undefined || v === null
}

export function isDef(v) {
  return v !== undefined && v !== null
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPromise(promise) {
  return promise && typeof promise.then === 'function'
}

export function getPageOffset(page, limit) {
  return (page - 1) * limit
}

export function find(arr, f) {
  return arr.filter(f)[0]
}

export function deepCopy(obj, cache = []) {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
    return obj
  }
  const hit = find(cache, c => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  cache.push({
    original: obj,
    copy,
  })

  Object.keys(obj).forEach(key => {
    copy[key] = deepCopy(obj[key], cache)
  })

  return copy
}

export function forEachValue(obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

const padZero = v => (v < 10 ? '0' + v : v)

export const relativeDate = date => {
  const currentDate = new Date()
  if (currentDate.getTime() - date.getTime() < 1000 * 3600 * 1) return `刚刚`
  if (date.getFullYear() < currentDate.getFullYear()) {
    return `${date.getFullYear()}年${padZero(date.getMonth() + 1)}月+${padZero(
      date.getDate(),
    )}日`
  }
  return `${padZero(date.getMonth() + 1)}月${padZero(date.getDate())}日`
}
