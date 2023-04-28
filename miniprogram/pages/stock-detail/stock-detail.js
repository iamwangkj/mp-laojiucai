// pages/stock-detail/stock-detail.js
import moment from 'moment'
import { get, cloudfn } from '../../utils/common'

const today = moment().format('YYYY-MM-DD')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    halfYearData: null,
    startDate: '',
    today: today,
    endDate: today,
    price1: 0,
    price2: 0,
    changePercent: ''
  },

  async getManyHistory (code) {
    try {
      const res = await cloudfn('getHistoryByCode', { code })
      this.setData({
        halfYearData: res
      })
    } catch (err) {
      console.error(err)
    }
  },

  startDateChange (e) {
    const startDate = e.detail.value
    this.setData({
      startDate
    })
    this.analyse()
  },

  endDateChange (e) {
    const endDate = e.detail.value
    this.setData({
      endDate
    })
    this.analyse()
  },

  async analyse () {
    const { halfYearData, startDate, endDate } = this.data
    const item1 = halfYearData.find((item) => {
      return item.date === startDate
    })
    const item2 = halfYearData.find((item) => {
      return item.date === endDate
    })
    const price1 = get(item1, 'trade', '获取不到该天价格')
    const price2 = get(item2, 'trade', '获取不到该天价格')
    const changePercent = ((price2 - price1) / price1 * 100).toFixed(2) + '%'
    this.setData({
      price1,
      price2,
      changePercent
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const code = options.code
    const startDate = options.date
    this.setData({
      code,
      startDate
    })
    await this.getManyHistory(code)
    await this.analyse()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
