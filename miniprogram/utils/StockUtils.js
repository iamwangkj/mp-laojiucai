export default class StockUtils {
  static format (list) {
    if (!Array.isArray(list)) {
      console.warn('StockUtils.format()入参不是一个数组')
      return []
    }
    return list.map((item) => {
      const { code, name, changepercent } = item
      return { code, name, changepercent }
    })
  }
}
