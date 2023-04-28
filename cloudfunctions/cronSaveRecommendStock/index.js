// 云函数入口文件
const cloud = require('wx-server-sdk')
const { api, filter, getter } = require('@fasum/stockjs')
const axios = require('axios')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

cloud.init()

async function notify(list) {
  let content = list.length === 0 ? '今日无推荐' : ''
  list.forEach((item) => {
    const { code, name } = item
    content += `${name}~${code}~~~~`
  })
  const str = encodeURIComponent(`?title=今日推荐&desp=${content}`)
  const url = `https://sctapi.ftqq.com/SCT2873TNfv8OBQy3oVGFyE7dUId4AIf.send${str}`
  return axios.get(url)
}

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let list = await api.getTodayAll()
    // let list = require('./2021-09-09.json')
    list = getter.ia1(list)
    list = await getter.ia2(list)
    // 存入数据库
    const resNotify = await notify(list)
    if (list.length > 0) {
      db.collection('stock_recommend').add({
        data: list
      })
    }
    return {
      msg: '已存至数据库',
      len: list.length
    }
  } catch (err) {
    return {
      msg: err.message,
      len: 0
    }
  }
}
