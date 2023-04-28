// 云函数入口文件
const cloud = require('wx-server-sdk')
const { collector } = require('@fasum/stockjs')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { code } = event
  const res = await collector.getHistory(code)

  return res
}
