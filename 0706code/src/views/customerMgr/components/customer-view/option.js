import * as echarts from 'echarts'
import filters from '../../../../filters'

export default function getBalanceOptions(data) {
  let dataArray = []
  if (data.data) {
    for (const item of data.data) {
      dataArray.push({
        name: item.busiName,
        value: item.amt
      })
    }
  }
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      top: 'center',
      left: '55%',
      icon: 'circle',
      align: 'left',
      itemWidth: 6,  // 设置宽度
      itemHeight: 6, // 设置高度
      itemGap: 8, // 设置间距
      textStyle: {
        color: () => {},
        fontSize: '14',
        fontFamily: 'PingFangSC-Regular, PingFang SC',
        fontWeight: 400,
        lineHeight: 20,
        rich: {
          a: {
            width: 102
          }
        }
      },
      formatter: function(name) {
        let str = '{a|' + name + '}' + filters.moneyFormat(dataArray.find(e => e.name === name).value)
        return str
      },
      selectedMode: false
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#4c4a4a',
            formatter: '{total|' + filters.moneyFormat(data.total) + '}亿元' + '\n\r' + '{active|当前业务余额}',
            rich: {
              total: {
                fontFamily: 'DINAlternate-Bold, DINAlternate',
                fontSize: 24,
                fontWeight: 'bold',
                color: '#333333'
              },
              active: {
                fontFamily: 'PingFangSC-Semibold, PingFang SC',
                fontSize: 16,
                color: '#666666',
                lineHeight: 30
              }
            }
          },
          emphasis: {
            show: true
          }
        },
        labelLine: {
          show: false
        },
        data: dataArray
      }
    ]
  }
  return option
}

export function getLinesOptions(data) {
  let dataArray = []
  let legendData = [
    {
      name: '已用额度',
      type: '2001',
      icon: 'circle'
    }, {
      name: '剩余额度',
      type: '2002',
      icon: 'circle'
    }, {
      name: '冻结额度',
      type: '2003',
      icon: 'circle'
    }, {
      name: '累计占用',
      type: '2004',
      icon: 'none'
    }
  ]
  if (data.data) {
    let arr = data.data.sort((a, b) => JSON.parse(a.busiType) - JSON.parse(b.busiType))
    for (const item of arr) {
      dataArray.push({
        name: item.busiName,
        value: item.amt,
        busiType: item.busiType
      })
    }
    for (const item of legendData) {
      item.name = data.data.find(e => e.busiType === item.type).busiName
    }
  }
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      top: 'center',
      left: '55%',
      icon: 'circle',
      align: 'left',
      itemWidth: 6,  // 设置宽度
      itemHeight: 6, // 设置高度
      itemGap: 8, // 设置间距
      textStyle: {
        color: () => {},
        fontSize: '14',
        fontFamily: 'PingFangSC-Regular, PingFang SC',
        fontWeight: 400,
        lineHeight: 20,
        rich: {
          a: {
            width: 102
          }
        }
      },
      // '已用额度', '剩余额度', '冻结额度', '累计占用'
      data: legendData,
      formatter: function(name) {
        let str = '{a|' + name + '}' + filters.moneyFormat(dataArray.find(e => e.name === name).value)
        return str
      },
      selected: {
        '累计占用': false
      },
      selectedMode: false
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#4c4a4a',
            formatter: '{total|' + (dataArray.find(e => e.busiType === '2001').value / data.total * 100).toFixed(0) + '%' + '}' + '\n\r' + '{active|已用}',
            rich: {
              total: {
                fontFamily: 'DINAlternate-Bold, DINAlternate',
                fontSize: 24,
                fontWeight: 'bold',
                color: '#333333'
              },
              active: {
                fontFamily: 'PingFangSC-Semibold, PingFang SC',
                fontSize: 16,
                color: '#666666',
                lineHeight: 30
              }
            }
          },
          emphasis: {
            show: true
          }
        },
        labelLine: {
          show: false
        },
        data: dataArray
      }
    ]
  }
  return option
}

export function getCreditOptions() {
  let option = {
    tooltip: {
      trigger: 'item',
      show: false
    },
    legend: {
      show: false
    },
    color: ['#7EACEA', '#85B05B', '#F0BC3E'],
    series: [
      {
        type: 'pie',
        radius: ['70%', '95%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#4c4a4a',
            formatter: '{total|' + total + '}' + '\n\r' + '{active|已用}',
            rich: {
              total: {
                fontFamily: 'DINAlternate-Bold, DINAlternate',
                fontSize: 28,
                fontWeight: 'bold',
                color: '#333333'
              },
              active: {
                fontFamily: 'PingFangSC-Semibold, PingFang SC',
                fontSize: 16,
                color: '#666666'
              }
            }
          },
          emphasis: {
            show: true
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {value: 83123.12, name: '票据转贴现'},
          {value: 23234.45, name: '票据资管'},
          {value: 6453.52, name: '同业理财'}
        ]
      }
    ]
  }
  return option
}

export function getCreditHistoryOptions() {
  let option = {
    backgroundColor: '',
    tooltip: {
      trigger: 'axis' // 鼠标经过提示
    },
    legend: {
      show: false
    },
    grid: {
      left: 0,
      top: '50',
      right: 100,
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      name: '年份',
      type: 'category',
      axisLine: {show: true},
      axisTick: {show: false},
      data: [2015, 2016, 2017, 2018, 2019, 2020, 2021]
    },
    yAxis: {
      name: '授信',
      type: 'value',
      axisLine: {show: true}
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#79AC43'
        },
        areaStyle: {
          normal: {
            // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{

              offset: 0,
              color: '#D9E7C9'
            }, {
              offset: 0.34,
              color: '#EBF3E3'
            }, {
              offset: 1,
              color: '#F9FBF6'
            }])

          }
        },
        data: [6, 10, 4, 6, 4, 10, 4]
      }
    ]
  }
  return option
}

export function getAssets(data) {
  let y = data.aumRank / data.custCount * 3
  let x = data.prodRank / data.custCount * 3
  let option = {
    grid: [
      {left: '15%', top: '14%', width: '60%', height: '60%'},
      {left: '15.1%', top: '20%', width: '54.5%', height: '54%'}
    ],
    xAxis: [
      {
        name: '产品覆盖度',
        nameTextStyle: {
          color: '#333333',
          padding: [0, 0, 0, 90]
        },
        nameLocation: 'center',
        min: 0,
        max: 3.3,
        gridIndex: 0,
        splitNumber: 3,
        type: 'value',
        axisLine: {show: true, symbol: ['none', 'arrow'], lineStyle: {color: '#C5C5C5'}},
        axisTick: false,
        axisLabel: false,
        zlevel: 3,
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#fff']
          }
        },
        boundaryGap: ['0', '20%']
      },
      {gridIndex: 1, type: 'category', show: false}
    ],
    yAxis: [
      {
        name: '资产余额',
        nameTextStyle: {
          color: '#333333'
        },
        min: 0,
        max: 3.3,
        gridIndex: 0,
        splitNumber: 3,
        type: 'value',
        axisLine: {show: true, symbol: ['none', 'arrow'], lineStyle: {color: '#C5C5C5'}},
        axisTick: false,
        axisLabel: false,
        zlevel: 3,
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#fff']
          }
        },
        boundaryGap: ['20%', '20%']
      },
      {gridIndex: 1, type: 'category', show: false}
    ],
    visualMap: {
      min: 0,
      max: 3,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      color: ['#f46042', '#7eacea', '#85b05b', '#f9c446'],
      show: false
    },
    series: [
      {
        name: 'I',
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: [[x, y, 3]]
      },
      {
        name: 'II',
        type: 'heatmap',
        coordinateSystem: 'cartesian2d',
        xAxisIndex: 1,
        yAxisIndex: 1,
        silent: true,
        data: [
          [0, 0, 0], [0, 1, 0], [0, 2, 1],
          [1, 0, 0], [1, 1, 1], [1, 2, 2],
          [2, 0, 1], [2, 1, 2], [2, 2, 2]
        ]
      }
    ]
  }
  return option
}
