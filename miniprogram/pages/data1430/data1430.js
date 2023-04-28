// pages/data1430/data1430.js
import moment from 'moment'
import { cloudfn } from '../../utils/common'
const today = moment().format('YYYY-MM-DD')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    today,
    date: today,
    showList: []
  },

  toStockDetail (e) {
    const code = e.target.dataset.code
    const date = this.data.date
    wx.navigateTo({
      url: `/pages/stock-detail/stock-detail?code=${code}&date=${date}`
    })
  },

  dateChange (e) {
    const date = e.detail.value
    this.setData({
      date,
      showList: []
    })
    this.getRecommend(date)
  },

  getRecommend (date) {
    cloudfn('getRecommend', { date }).then((res) => {
      this.setData({
        showList: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = this.data.date
    if (moment().format('HH:mm') <= '14:30') {
      console.log('当前数据未更新，将使用昨天数据')
      date = moment().add(-1, 'day').format('YYYY-MM-DD')
      this.setData({
        date
      })
    }
    this.getRecommend(date)
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
