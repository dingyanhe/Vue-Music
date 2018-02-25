// import originJsonp from 'jsonp'

// export default function jsonp(url, data, option) {
//   url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

//   return new Promise((resolve, reject) => {
//     originJsonp(url, option, (err, data) => {
//       if (!err) {
//         resolve(data)
//       } else {
//         reject(err)
//       }
//     })
//   })
// }

// export function param(data) {
//   let url = ''
//   for (var k in data) {
//     let value = data[k] !== undefined ? data[k] : ''
//     url += '&' + k + '=' + encodeURIComponent(value)
//   }
//   return url ? url.substring(1) : ''
// }

import originalJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  console.log('----------jsonp args------------')
  console.log(url)
  console.log(data)
  console.log(option)
  console.log('----------jsonp args------------')
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  console.log('----------jsonp connection------------')
  console.log(url)
  console.log('----------jsonp connection------------')
  return new Promise((resolve, reject) => {
    originalJSONP(url, option, (err, data) => {
      if (!err) {
        console.log('----------jsonp data------------')
        console.log(data)
        console.log('----------jsonp data------------')
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// 循环一遍
function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}