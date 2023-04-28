/**
 * 直接引入lodash报错，自行实现类似_.get()
 * @param {object} object 对象
 * @param {string} path 路径
 * @param {any} defaultValue 默认值
 * @returns 返回期望值
 */
export function get (object, path, defaultValue) {
  return (!Array.isArray(path) ? path.replace(/\[/g, '.').replace(/\]/g, '').split('.') : path).reduce((o, k) => (o || {})[k], object) || defaultValue
}

/**
 * 获取当前系统
 * @returns string 当前系统
 */
export function getOS () {
  const systemInfo = wx.getSystemInfoSync()
  const system = systemInfo.system
  const os = system.includes('Android') ? 'android' : system.includes('iOS') ? 'ios' : system
  console.log('当前系统=', os)
  return os
}

/**
 * 检测小程序是否有新的版本，有则更新。
 */
export function checkUpdate () {
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
    console.log('检测小程序是否有新的版本', res.hasUpdate)
  })
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success (res) {
        if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  updateManager.onUpdateFailed(function () {
  // 新版本下载失败
  })
}

/**
 * wx.request的二次封装
 * @param {obejct} opts wx.request一样的入参
 * @returns promise
 */
export function request (opts) {
  return new Promise((resolve, reject) => {
    const defaultOpts = {
      success (res) {
        console.log('请求的返回=', res.data)
        resolve(res.data)
      },
      fail (err) {
        reject(err)
      },
      complete () {
        wx.hideLoading()
      }
    }
    console.log('请求的参数=', opts)
    const realOpts = Object.assign(defaultOpts, opts)
    wx.showLoading({
      title: '加载中...'
    })
    wx.request(realOpts)
  })
}

/**
 * 云函数工具封装
 * @param {string} cloudFnName 云函数名
 * @param {string} type 操作类型
 * @param {object} data 请求的参数
 * @returns {promise} 返回一个promise
 */
export function cloudfn (cloudFnName = '', data = {}) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...'
    })
    console.log(`调用云函数(${cloudFnName})`, '入参=', data)
    wx.cloud.callFunction({
      name: cloudFnName,
      data
    }).then((res) => {
      console.log('云函数返回=', res.result)
      resolve(res.result)
      wx.hideLoading()
    }).catch((err) => {
      reject(err)
      wx.hideLoading()
    })
  })
}
