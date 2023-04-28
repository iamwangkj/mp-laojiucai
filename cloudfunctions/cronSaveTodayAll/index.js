// 云函数入口文件
const cloud = require('wx-server-sdk')
const { collector } = require('@fasum/stockjs')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const resStock = await collector.getTodayAll()
  await db.collection('stock_all').add({
    // data 字段表示需新增的 JSON 数据
    data: resStock
  })
  return resStock
}
