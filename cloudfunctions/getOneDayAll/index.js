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
    // 云函数一次读取最多1000条，所以要拼接
    const countResult = await db.collection('stock_all').where({ date }).count()
    const total = countResult.total
    const MAX_LIMIT = 1000
    const queryTimes = Math.ceil(total / MAX_LIMIT)
    const taskList = []
    for (let index = 0; index < queryTimes; index++) {
      const promise = db.collection('stock_all').skip(index * MAX_LIMIT).limit(MAX_LIMIT).get()
      taskList.push(promise)
    }
    const resTmp = await Promise.all(taskList)
    const res = resTmp.reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
    const list = res.data
    // const item = {
    //   code: '300159',
    //   name: '新研股份',
    //   trade: 7.16,
    //   changepercent: 14.377,
    //   open: 6,
    //   high: 7.51,
    //   low: 5.81,
    //   volume: 457164988,
    //   amount: 3095803559,
    //   per: -4.163,
    //   pb: 7.131,
    //   turnoverratio: 32.71976
    // }
    // 云函数返回数据量，不能超过1048576 bytes（1M），所以要压缩数据
    const listLess = list.map((item) => {
      const { code, name, trade, changepercent, open, high, low, volume, amount, per, pb, turnoverratio } = item
      return { code, name, trade, changepercent, open, high, low, volume, amount, per, pb, turnoverratio }
    })
    return listLess
  } catch (error) {
    return []
  }
}
