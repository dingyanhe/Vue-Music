// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min)
// }

// export function shuffle(arr) {
//   let _arr = arr.slice()
//   for (let i = 0; i < _arr.length; i++) {
//     let j = getRandomInt(0, i)
//     let t = _arr[i]
//     _arr[i] = _arr[j]
//     _arr[j] = t
//   }
//   return _arr
// }

function getRandomInt(min, max) {
  // [0,1)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

// 解决input输出框输入后再执行 截留
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
