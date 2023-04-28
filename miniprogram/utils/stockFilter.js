
/**
 * 移除ST
 * @param {array} list 行情数组
 * @returns {array} 数组
 */
function removeST (list) {
  return list.filter((item) => {
    return !(/ST/g.test(item.name))
  })
}

/**
 * 移除科创股，因为我还没法买
 * @param {array} list 行情数组
 * @returns {array} 数组
 */
function removeKechuang (list) {
  return list.filter((item) => {
    return item.code.substring(0, 3) !== '688'
  })
}

/**
 * 根据价格，筛选
 * @param {array} list 行情数组
 * @param {number} lowPrice 最低价，默认0
 * @param {number} highPrice 最高价，默认3000
 * @returns {array} 数组
 */
function byPrice (list, lowPrice = 0, highPrice = 3000) {
  return list.filter((item) => {
    const trade = Number(item.trade)
    return trade >= lowPrice && trade <= highPrice
  })
}

/**
 * 根据换手率，筛选
 * @param {array} list 行情数组
 * @param {number} lowRatio 最低换手率，默认0
 * @param {number} highRatio 最高换手率，默认100
 * @returns {array} 数组
 */
function byRatio (list, lowRatio = 0, highRatio = 100) {
  return list.filter((item) => {
    const ratio = Number(item.turnoverratio)
    return ratio >= lowRatio && ratio <= highRatio
  })
}

/**
 * 根据涨跌幅度，筛选
 * @param {array} list 行情数组
 * @param {number} lowPercent 最低涨跌幅度，默认-20
 * @param {number} highPercent 最高涨跌幅度，默认20
 * @returns 数组
 */
function byChangePercent (list, lowPercent = -20, highPercent = 20) {
  return list.filter((item) => {
    const percent = Number(item.changepercent)
    return percent >= lowPercent && percent <= highPercent
  })
}

/**
 * 根据成交额，筛选
 * @param {array} list 行情数组
 * @param {number} lowAmount 最低成交额，默认100000000（一亿）
 * @returns 数组
 */
function byAmount (list, lowAmount = 100000000) {
  return list.filter((item) => {
    const amount = Number(item.amount)
    return amount >= lowAmount
  })
}

/**
 * 获取redT，但不是平头
 * @param {array} list 行情数组
 * @returns 数组
 */
function getRedT (list) {
  return list.filter((item) => {
    let { open, high, low, trade, changepercent } = item
    open = Number(open)
    high = Number(high)
    low = Number(low)
    trade = Number(trade)
    changepercent = Number(changepercent)
    const divH = Math.abs(trade - open)
    const lineUpH = Math.abs(high - trade)
    const lineDownH = open - low
    return changepercent > 0.9 && (lineUpH / divH) < 0.05 && (lineDownH / divH) > 1
  })
}

/**
 * 获取平头redT，
 * @param {array} list 行情数组
 * @returns 数组
 */
function getRealRedT (list) {
  return list.filter((item) => {
    let { open, high, low, trade, changepercent } = item
    open = Number(open)
    high = Number(high)
    low = Number(low)
    trade = Number(trade)
    changepercent = Number(changepercent)
    const divH = Math.abs(trade - open)
    const lineDownH = open - low
    return changepercent > 0 && trade === high && (lineDownH / divH) > 1
  })
}

/**
 * 获取创业股
 * @param {array} list 行情数组
 * @returns 数组
 */
function getChuangye (list) {
  return list.filter((item) => {
    return /^3/g.test(item.code)
  })
}

module.exports = {
  removeST,
  removeKechuang,
  byPrice,
  byRatio,
  byChangePercent,
  byAmount,
  getRedT,
  getRealRedT,
  getChuangye
}

/*
数组中的每个item，如下：
const item = {
  date: '2021-08-08',
  amount: 361594492
  buy: "37.840"
  changepercent: -0.132
  code: "002138"
  high: "38.280"
  low: "37.100"
  mktcap: 3051914.96989
  name: "顺络电子"
  nmc: 2690487.12155
  open: "37.930"
  pb: 6.003
  per: 51.149
  pricechange: -0.05
  sell: "37.850"
  settlement: "37.900"
  symbol: "sz002138"
  ticktime: "15:00:03"
  trade: "37.850"
  turnoverratio: 1.34741
  volume: 9577808
}
 */
