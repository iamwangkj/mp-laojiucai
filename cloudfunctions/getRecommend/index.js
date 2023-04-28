// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { date } = event
    const res = await db.collection('stock_recommend').where({ date }).get()
    const rows = res.data
    // 云函数返回数据量，不能超过1048576 bytes（1M），所以要压缩数据
    return rows
  } catch (error) {
    return []
  }
}
