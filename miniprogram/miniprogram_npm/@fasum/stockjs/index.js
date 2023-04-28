module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1629426331393, function(require, module, exports) {
const checker = require('./checker')
const collector = require('./collector')
const filter = require('./filter')
const ia = require('./ia')

module.exports = {
  checker,
  collector,
  filter,
  ia
}

}, function(modId) {var map = {"./checker":1629426331394,"./collector":1629426331395,"./filter":1629426331396,"./ia":1629426331397}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1629426331394, function(require, module, exports) {
// 检验涨跌比
function check (codeList, startDate, endDate) {
  const upList = []
  const downList = []
  codeList.forEach((item) => {
    const { code, buy, sale } = item
    const changePercent = ((sale.trade - buy.trade) / buy.trade * 100).toFixed(2) + '%'
    if (changePercent > 0) {
      console.log('涨', code, `${changePercent}%`)
      upList.push(item)
    } else {
      console.log('跌', code, `${changePercent}%`)
      downList.push(item)
    }
  })
  console.log(`总(${codeList.length})，涨跌比(${upList.length}:${downList.length})`)
}

function checkSingleStock (code, startDate, endDate) {
  // const { code, buy, sale } = item
  //   const changePercent = ((sale.trade - buy.trade) / buy.trade * 100).toFixed(2) + '%'
}

module.exports = {
  check
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1629426331395, function(require, module, exports) {
const axios = require('axios')
const asyncUtil = require('async')
const dayjs = require('dayjs')

/**
 * 获取股票2年半的行情数据
 * @param {string} code 股票代码
 * @returns {promise<array>} 获取股票2年半的行情数据，返回数据格式 - 0日期 ，1开盘价， 2最高价， 3收盘价， 4最低价， 5成交量， 6价格变动 ，7涨跌幅，5日均价，10日均价，20日均价，5日均量，10日均量，20日均量，换手率
{
  date: item[0],
  code,
  open: Number(item[1]),
  high: Number(item[2]),
  trade: Number(item[3]),
  low: Number(item[4]),
  volume: Number(item[5]),
  pricechange: Number(item[6]),
  changepercent: Number(item[7]),
  price5: Number(item[8]),
  price10: Number(item[9]),
  price20: Number(item[10]),
  volume5: Number(item[11].replace(/,/g, '')),
  volume10: Number(item[12].replace(/,/g, '')),
  volume20: Number(item[13].replace(/,/g, '')),
  turnoverratio: Number(item[14])
}
 */
async function getHistory (code, startDate, endDate) {
  try {
    if (typeof code !== 'string') {
      throw (Error(`code应该为string，但接收到的是${typeof code}`))
    }
    const symbol = ['5', '6', '9'].indexOf(code.charAt(0)) >= 0 ? `sh${code}` : `sz${code}`
    const res = await axios.get(`http://api.finance.ifeng.com/akdaily/?type=fq&code=${symbol}`)
    const recordList = res.data.record
    const data = recordList.map((item) => {
      return {
        date: item[0],
        code,
        open: Number(item[1]),
        high: Number(item[2]),
        trade: Number(item[3]),
        low: Number(item[4]),
        volume: Number(item[5]),
        pricechange: Number(item[6]),
        changepercent: Number(item[7]),
        price5: Number(item[8]),
        price10: Number(item[9]),
        price20: Number(item[10]),
        volume5: Number(item[11].replace(/,/g, '')),
        volume10: Number(item[12].replace(/,/g, '')),
        volume20: Number(item[13].replace(/,/g, '')),
        turnoverratio: Number(item[14])
      }
    })
    if (!startDate && !endDate) {
      return data
    } else {
      const startIndex = data.findIndex((item) => {
        return item.date === startDate
      })
      const endIndex = data.findIndex((item) => {
        return item.date === endDate
      })
      const newData = data.slice(startIndex, endIndex + 1)
      return newData
    }
  } catch (err) {
    console.log(err)
    return []
  }
}

/**
 * 查看指定日期是否开盘
 * @param {string} date 日期，如'2021-08-08'
 * @returns {promise<boolean>} true or false
 */
async function isOpen (date = '') {
  const res = await axios.get(`http://tool.bitefu.net/jiari/?d=${date}`)
  return Number(res.data) === 0
}

/**
 * 获取今日全部股票行情
 * @returns {promise<array>} 数组，某一个item，如下：
{
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
function getTodayAll () {
  return new Promise((resolve, reject) => {
    const urlList = []
    for (let index = 1; index <= 45; index++) {
      const url = `http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?num=100&sort=changepercent&asc=0&node=hs_a&symbol=&_s_r_a=page&page=${index}`
      urlList.push(url)
    }
    asyncUtil.mapLimit(urlList, 2, async (url) => {
      const res = await axios.get(url)
      console.log(`获取到${res.data.length}条行情数据`)
      return res.data
    }, (err, results) => {
      if (err) reject(err)
      else {
        let res = []
        results.forEach((itemlist) => {
          res = res.concat(itemlist)
        })
        const date = dayjs().format('YYYY-MM-DD')
        const realRes = res.map((item) => {
          const { symbol, code, name, trade, pricechange, changepercent, buy, sell, settlement, open, high, low, volume, amount, ticktime, per, pb, mktcap, nmc, turnoverratio } = item
          Number()
          return {
            date: date,
            symbol,
            code,
            name,
            trade: Number(trade),
            pricechange,
            changepercent,
            buy: Number(buy),
            sell: Number(sell),
            settlement: Number(settlement),
            open: Number(open),
            high: Number(high),
            low: Number(low),
            volume,
            amount,
            ticktime,
            per,
            pb,
            mktcap,
            nmc,
            turnoverratio
          }
        })
        resolve(realRes)
      }
    })
  })
}

module.exports = {
  getHistory,
  getTodayAll,
  isOpen
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1629426331396, function(require, module, exports) {
// 移除ST
function removeST (list) {
  return list.filter((item) => {
    return !(/(ST)/.test(item.name))
  })
}

// 移除科创股，因为我还没法买
function removeKechuang (list) {
  return list.filter((item) => {
    return item.code.substring(0, 3) !== '688'
  })
}

// 红T
function getRedT (list) {
  return list.filter((item) => {
    const { open, high, low, trade, changepercent } = item
    const divH = Math.abs(trade - open)
    const lineUpH = Math.abs(high - trade)
    const lineDownH = open - low
    return changepercent > 0.9 && (lineUpH / divH) < 0.05 && (lineDownH / divH) > 1
  })
}

// 真红T
function getRealRedT (list) {
  return list.filter((item) => {
    const { open, high, low, trade } = item
    const divH = Math.abs(trade - open)
    const lineDownH = open - low
    return trade === high && (lineDownH / divH) > 1
  })
}

// 获取创业股
function getChuangye (list) {
  return list.filter((item) => {
    return item.code[0] === '3'
  })
}

// 移除涨停
function removeLimitUp (list) {
  return list.filter((item) => {
    const { changepercent } = item
    return Number(changepercent) < 9
  })
}

// 筛选出涨停
function getLimitUp (list) {
  return list.filter((item) => {
    const { changepercent } = item
    return Number(changepercent) > 9
  })
}

// 筛选出大于1亿金额的股票
function getBigAmount (list) {
  return list.filter((item) => {
    let { amount } = item
    amount = Number(amount)
    return amount > 100000000
  })
}

// 按价格筛选
function getByPrice (list, lowPrice = 0, highPrice = 3000) {
  return list.filter((item) => {
    const trade = Number(item.trade)
    return trade > lowPrice && trade < highPrice
  })
}

// 筛选出高换手率的股票
function getHighRatio (list, huanshoulv = 5) {
  return list.filter((item) => {
    const ratio = Number(item.turnoverratio)
    return ratio > huanshoulv
  })
}

module.exports = {
  removeST,
  removeKechuang,
  getRedT,
  getRealRedT,
  getChuangye,
  removeLimitUp,
  getLimitUp,
  getBigAmount,
  getHighRatio,
  getByPrice
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1629426331397, function(require, module, exports) {
function _ema (lastEma, closePrice, units) {
  return (lastEma * (units - 1) + closePrice * 2) / (units + 1)
}
function _dea (lastDea, curDiff) {
  return (lastDea * 8 + curDiff * 2) / 10
}
/**
 * 获取macd
 * @param {array} ticks 价格数组
 * @returns obj，如下：{
  macds,
  diffs,
  deas
}
 */
function macd (ticks) {
  const ema12 = []
  const ema26 = []
  const diffs = []
  const deas = []
  const macds = []
  ticks.forEach((c, i) => {
    if (i === 0) {
      ema12.push(c)
      ema26.push(c)
      deas.push(0)
    } else {
      ema12.push(_ema(ema12[i - 1], c, 12))
      ema26.push(_ema(ema26[i - 1], c, 26))
    }
    diffs.push(ema12[i] - ema26[i])
    if (i !== 0) {
      deas.push(_dea(deas[i - 1], diffs[i]))
    }
    macds.push((diffs[i] - deas[i]) * 2)
  })

  return {
    macds,
    diffs,
    deas
  }
}

module.exports = {
  macd
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1629426331393);
})()
//miniprogram-npm-outsideDeps=["axios","async","dayjs"]
//# sourceMappingURL=index.js.map