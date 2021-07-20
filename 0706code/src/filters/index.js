export default {
  /**
   * 格式化金额
   * @param value
   * @param formatNum 默认不进行小数点的处理
   * @returns {string}
   */
  moneyFormat(value, formatNum) {
    if (!value && value !== 0) return '-'
    if (formatNum) value = value.toFixed(formatNum)
    let intPart = Number(value) | 0 // 获取整数部分
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
    let value2Array = value.toString().split('.')
    // =2表示数据有小数位
    if (value2Array.length === 2) {
      return intPartFormat + '.' + value2Array[1]
    } else {
      return intPartFormat
    }
  }
}
