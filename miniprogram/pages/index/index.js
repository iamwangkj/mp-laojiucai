// pages/index/index.js
import moment from 'moment'
import initComputed from 'wx-computed'
import { filter } from '@fasum/stockjs'
import { cloudfn } from '../../utils/common'

let allList = []
const today = moment().format('YYYY-MM-DD')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    today,
    date: today,
    showList: []

  },
  computed: {
    showLink () {
      return this.data.date !== today
    }
  },

  dateChange (e) {
    const date = e.detail.value
    this.setData({
      date
    })
    this.getAllData(date)
  },

  getAllData (date) {
    cloudfn('getOneDayAll', { date }).then((res) => {
      allList = res
      this.chooseIA()
    })
  },

  chooseIA () {
    let tmpList = allList
    tmpList = filter.removeST(tmpList)
    tmpList = filter.getRealRedT(tmpList)
    this.setData({
      showList: tmpList
    })
  },

  toStockDetail (e) {
    if (!this.data.showLink) return
    const code = e.target.dataset.code
    const date = this.data.date
    wx.navigateTo({
      url: `/pages/stock-detail/stock-detail?code=${code}&date=${date}`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initComputed(this)
    let date = this.data.date
    if (moment().format('HH:mm') <= '15:00') {
      console.log('当前数据未更新，将使用昨天数据')
      date = moment().add(-1, 'day').format('YYYY-MM-DD')
      this.setData({
        date
      })
    }
    this.getAllData(date)
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
