<template>
  <div class="rule-form">
    <div class="rule-form-title">
      <span class="line"></span>
      <span>{{
        lotteryType === '1'
          ? '九宫格奖品配置'
          : lotteryType === '2'
          ? '转盘奖品配置'
          : '刮奖奖品配置'
      }}</span>
    </div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="90px"
      class="demo-dynamic"
      size="mini"
      label-position="right"
    >
      <div v-for="(item, index) in ruleForm.rules" :key="index">
        <div class="rule-form-row">
          <div class="rule-form-num">
            <span class="text">{{
              lotteryType === '1'
                ? '奖品格序号'
                : lotteryType === '2'
                ? '扇区编号'
                : ''
            }}</span>
            <span class="number" v-if="lotteryType !== '3'">{{
              index + 1
            }}</span>
          </div>
          <el-form-item
            label="奖品:"
            :prop="'rules.' + index + '.prodName'"
            :rules="{ required: true, message: '请输入', trigger: 'blur' }"
            :class="`prodName${index}`"
          >
            <el-input
              :disabled="true"
              placeholder="请查询"
              v-model="item.prodName"
            >
              <i
                v-if="!inputDisabled"
                slot="suffix"
                class="el-input__icon el-icon-khz"
                @click="handleDialogVisible(index)"
              ></i>
            </el-input>
            <i v-if="!inputDisabled && index === 0" class="el-icon-plus" @click="jumpPage"></i>
          </el-form-item>
          <el-form-item
            label="奖品上限:"
            :prop="'rules.' + index + '.prodUp'"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { validator: checkProdUp, trigger: 'blur' }
            ]"
          >
            <el-input
              :disabled="inputDisabled"
              placeholder="请输入"
              v-model="item.prodUp"
              @change="val => changeProdUp(val, index)"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="奖品库存:"
            :prop="'rules.' + index + '.prodStock'"
          >
            <el-input
              :disabled="true"
              v-model="item.prodStock"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="抽中概率:"
            :prop="'rules.' + index + '.lotteryRate'"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { validator: checkRate, trigger: 'blur' }
            ]"
          >
            <el-input
              :disabled="inputDisabled"
              placeholder="请输入"
              v-model="item.lotteryRate"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </div>
        <div class="rule-form-row">
          <div style="width: 100px;"></div>
          <el-form-item
            label="展示类型:"
            :prop="'rules.' + index + '.showType'"
            :rules="{ required: true, message: '请选择', trigger: 'change' }"
          >
            <el-select
              :disabled="inputDisabled"
              v-model="item.showType"
              placeholder="请选择"
            >
              <el-option key="01" label="文字" value="01" />
              <el-option key="02" label="图片" value="02" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="item.showType === '01'"
            label="文字描述1:"
            :prop="'rules.' + index + '.prodDescribe1'"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              {
                min: 0,
                max: 100,
                message: '长度限制100字符内',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              :disabled="inputDisabled"
              placeholder="请输入"
              maxlength="100"
              v-model="item.prodDescribe1"
            />
          </el-form-item>
          <el-form-item
            v-if="item.showType === '01'"
            label="文字描述2:"
            :prop="'rules.' + index + '.prodDescribe2'"
            :rules="[
              {
                min: 0,
                max: 100,
                message: '长度限制100字符内',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              :disabled="inputDisabled"
              placeholder="请输入"
              maxlength="100"
              v-model="item.prodDescribe2"
            />
          </el-form-item>
          <el-form-item
            v-if="item.showType === '02'"
            label="上传图片:"
            style="position: relative"
          >
            <span style="color: #F56C6C; margin-right:4px; position: absolute;top: 0;left: -80px;">*</span>
            <el-input
              disabled
              placeholder="请选择"
              v-model="item.prodPicName"
            >
              <el-upload
                :slot="inputDisabled ? '' : 'append'"
                :ref="`upload${index}`"
                action
                class="upload-demo"
                accept=".png, .jpg, .jpeg"
                :show-file-list="false"
                :auto-upload="false"
                :before-upload="(file) => beforeUpload(file, index)"
                :file-list="item.pictureList"
                :http-request="handleRequest"
                :multiple="false"
                :on-change="(file, fileList) => handleChangeFile(file, fileList, index)"
              >
                <span>选择文件</span>
                <div
                  style="position: absolute;left: -80px;top: 25px;color:#ff0000"
                >
                  <span v-if="item.showMessage">{{item.message}}</span>
                </div>
              </el-upload>
            </el-input>
            <el-button v-if="!inputDisabled" size="small" type="primary" @click="uploadImg(index)">导入</el-button>
            <el-button v-if="inputDisabled" size="small" type="primary" @click="previewImg(item.prodPicUrl)">预览</el-button>
          </el-form-item>
          <div style="width: 200px;" v-if="item.showType === '02'"></div>
          <div style="width: 480px;marginRight: 40px;" v-if="item.showType === ''"></div>
          <i
            class="el-icon-remove"
            v-if="
              (index !== 0 && !inputDisabled && lotteryType === '3') ||
                (index > 4 && !inputDisabled && lotteryType === '2')
            "
            @click.prevent="removeRule(item)"
          ></i>
        </div>

      </div>
    </el-form>
    <div
      class="rule-form-add"
      @click="addRule"
      v-if="!inputDisabled && lotteryType !== '1'"
    >
      <i class="el-icon-tjzb"></i>
      <span>{{ lotteryType === '2' ? '增加扇区' : '增加奖品' }}</span>
    </div>
    <div
      class="rule-form-notice"
      v-if="lotteryType === '1' && !inputDisabled"
    >
      <p>注：1、“奖品上限”≤5000且为正整数；</p>
      <p>2、奖品库存等于奖品发放上限减去已兑换奖品数量；</p>
      <p>3、“抽中概率”精确到0.00%，且所有“抽中概率”之和等于100%。</p>
    </div>
    <div
      class="rule-form-notice"
      v-if="lotteryType !== '1' && !inputDisabled"
    >
      <p v-if="lotteryType === '2'">注：1、扇区最多添加8个；</p>
      <p v-if="lotteryType === '3'">注：1、奖品最多添加5个；</p>
      <p>2、“奖品上限”≤5000且为正整数；</p>
      <p>3、奖品库存等于奖品发放上限减去已兑换奖品数量；</p>
      <p>4、“抽中概率”精确到0.00%，且所有“抽中概率”之和等于100%。</p>
    </div>
    <el-dialog
      class="prod-dialog"
      title="查询"
      :visible.sync="prodDialogVisible"
      width="900px"
      append-to-body
    >
      <div>
        <div class="prod-dialog-search">
          <div class="search-input">
            <div class="search-input-item">
              <div class="search-input-label">供应商名称</div>
              <el-input
                placeholder="请输入供应商名称"
                v-model="prodSearchParams.suppName"
              ></el-input>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">供应商渠道</div>
              <el-select
                v-model="prodSearchParams.suppChannel"
                placeholder="请选择"
                disabled
              >
                <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">商品名称</div>
              <el-input
                placeholder="请输入商品名称"
                v-model="prodSearchParams.prodName"
              ></el-input>
            </div>
          </div>
          <div class="search-btns">
            <el-button type="primary" icon="el-icon-query" @click="onSearchBtn"
              >查询</el-button
            >
            <el-button icon="el-icon-reset" @click="onResetBtn">重置</el-button>
          </div>
        </div>
        <el-table
          class="prod-dialog-table"
          :data="prodTableData"
          border
          :header-cell-style="{ background: '#80A639', color: '#ffffff' }"
        >
          <el-table-column label="选择" fixed width="60" align="center">
            <template slot-scope="scope">
              <el-radio
                v-model="radio"
                :label="scope.$index"
                @change="onTableSelect(scope.row)"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="suppName"
            label="供应商名称"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="suppChannel" label="供应商渠道" align="center">
            <template slot-scope="{ row }">
              <span>{{ $root.selectOption.channelObj[row.suppChannel] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prodName"
            label="商品名称"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prodCnt" label="数量" align="center">
          </el-table-column>
        </el-table>
        <v-pagination
          :total="page.total"
          :currentPageNum="page.currentPage"
          :currentPageSize="page.pageSize"
          @pageChange="pageChange"
        ></v-pagination>
        <div class="prod-dialog-btns">
          <el-button type="primary" @click="handleAdd">添 加</el-button>
          <el-button @click="prodDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 预览 图片 -->
    <el-dialog
      class="img-dialog"
      title="图片预览"
      :visible.sync="imgShow"
      width="720px"
    >
      <div class="preview-img">
        <img :src='`${baseUrl}/${pictureUrl}`' style="width: 500px" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import { baseUrl } from '@/utils'
import vPagination from '@/components/pagination/pagination'
import { validateImg, imgFormat } from '@/utils/validate'
const channelOptions = [
  {
    key: '',
    name: '请选择'
  },
  {
    key: '1',
    name: '财富'
  },
  {
    key: '2',
    name: '直销'
  },
  {
    key: '3',
    name: '信用卡'
  }
]
const channelKeyValue = channelOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
export default {
  components: {
    vPagination
  },
  filters: {
    channelFilter(num) {
      return channelKeyValue[num]
    }
  },
  props: {
    actId: {
      type: String
    },
    type: {
      type: String
    },
    active: {
      type: Number
    },
    lotteryType: {
      type: String
    },
    typeChanged: {
      type: Boolean
    },
    actStatus: {
      type: String
    }
  },
  computed: {
    inputDisabled () {
      return this.type === 'detail' || (this.type === 'edit' && this.actStatus === '4')
    }
  },
  data() {
    var checkProdUp = (rule, value, callback) => {
      if (value > 5000) {
        callback(new Error('“奖品上限”<=5000！'))
      } else if (!/^([1-9]\d*)$/.test(value)) {
        callback(new Error('“奖品上限”为正整数！'))
      } else {
        callback()
      }
    }
    var checkRate = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        callback(new Error('请输入正数！'))
      } else if (value > 100) {
        callback(new Error('不可大于100%!'))
      } else if (value < 0) {
        callback(new Error('不可为负数!'))
      } else if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(value)) {
        callback(new Error('保留两位小数!'))
      } else {
        callback()
      }
    }
    return {
      checkProdUp,
      checkRate,
      channelOptions,
      pictureUrl: '',
      imgShow: false,
      baseUrl: baseUrl(),
      ruleForm: {
        rules: [
          {
            prodId: '',
            prodName: '',
            prodUp: '',
            prodStock: '',
            lotteryRate: '',
            showType: '',
            prodPicName: '',
            prodPicUrl: '',
            pictureList: [],
            showMessage: false,
            message: ''
          }
        ]
      },
      upload: false, // 是否提交表单
      prodDialogVisible: false,
      prodSearchParams: {
        suppName: '',
        suppChannel: this.$store.state.user.channel,
        prodName: ''
      },
      radio: '',
      selectProdId: '',
      selectProdName: '',
      ruleIndex: '',
      prodTableData: [],
      formData: new FormData(),
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  methods: {
    // 跳转至商品管理
    jumpPage() {
      const prod = this.$router.resolve({name: 'prod'})
      window.open(prod.href, '_blank')
    },
    // 图片check
    beforeUpload(file, index) {
      let obj = this.ruleForm.rules[index]
      if (imgFormat(file)) {
        // this.previewLoading = false
        obj.pictureList = []
        this.$set(obj, 'prodPicName', '')
        this.$set(obj, 'prodPicUrl', '')
        this.$refs[`upload${index}`][0].clearFiles()
        this.resetForm(`upload${index}`)
        return
      }
      let _this = this
      let imgWidth = 95
      let imgHight = 65
      validateImg(file, imgWidth, imgHight).then(() => {
        this.uploadImage(index)
      }).catch(() => {
        _this.$message.warning({message: `上传文件的图片大小不合符标准,宽需要为${imgWidth}px，高需要为${imgHight}px。`})
        // this.previewLoading = false
        obj.pictureList = []
        this.$set(obj, 'prodPicUrl', '')
        this.$set(obj, 'prodPicName', '')
        this.$refs[`upload${index}`][0].clearFiles()
        this.resetForm(`upload${index}`)
      })
    },
    // 选择文件变更
    handleChangeFile(file, fileList, index) {
      // 只有一张图片
      this.ruleForm.rules[index].pictureList = []
      this.ruleForm.rules[index].pictureList.push(fileList[fileList.length - 1])
      this.$set(this.ruleForm.rules[index], 'prodPicName', file.name)
      this.$set(this.ruleForm.rules[index], 'prodPicUrl', '')
      this.$set(this.ruleForm.rules[index], 'showMessage', false)
    },
    // 导入
    handleRequest(param) {
      this.formData.append('files', param.file)
    },
    uploadImg(index) {
      let obj = this.ruleForm.rules[index]
      this.$set(obj, 'showMessage', false)
      if (obj.pictureList.length === 0) {
        this.$set(obj, 'showMessage', true)
        this.$set(obj, 'message', '请选择后图片再导入')
        return
      }
      // this.uploadDetailLoading = true
      this.formData = new FormData()
      let upload = `upload${index}`
      this.$refs[upload][0].submit()
    },
    // 图片上传
    uploadImage(index) {
      let obj = this.ruleForm.rules[index]
      API.common.upload(this.formData).then((res) => {
        this.$set(obj, 'prodPicUrl', res.data.data[0].fileUrl)
        // this.uploadDetailLoading = false
        // this.uploadDetailFlg = true
        this.resetForm(`upload${index}`)
        this.$message.success('上传成功！')
      }).catch(() => {
        obj.pictureList = []
        this.$set(obj, 'prodPicName', '')
        this.$set(obj, 'prodPicUrl', '')
        this.resetForm(`upload${index}`)
        this.$message.error('上传失败！')
        // this.uploadDetailLoading = false
      })
    },
    // 清空input val
    resetForm(uploadName) {
      // 判断ie10以及以下
      let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
      let ele = this.$refs[uploadName][0].$el.getElementsByTagName('input')[0]
      if (isIE10) {
        let form = document.createElement('form')
        let beforInput = ele.nextSibling
        let parentInput = ele.parentNode
        form.appendChild(ele)
        form.reset()
        parentInput.insertBefore(ele, beforInput)
      } else {
        ele.value = null
      }
    },
    handleNextStep(type) {
      if (type === 'TEMP') {
        this.setParams(type)
      } else {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.setParams()
          }
        })
      }
      // this.$refs['ruleForm'].validate(valid => {
      //   if (valid) {
      //     this.upload = true
      //     var rulesArr = []
      //     this.ruleForm.rules.forEach((item, index) => {
      //       var ruleObj = {}
      //       if (item.showType === '01') {
      //         ruleObj = {
      //           prodSeqid: index,
      //           prodId: item.prodId,
      //           prodName: item.prodName,
      //           prodUp: item.prodUp,
      //           prodStock: item.prodStock,
      //           lotteryRate: item.lotteryRate,
      //           showType: item.showType,
      //           prodDescribe1: item.prodDescribe1,
      //           prodDescribe2: item.prodDescribe2,
      //           ifThanks: 0
      //         }
      //       } else {
      //         this.$set(item, 'showMessage', false)
      //         if (!item.prodPicName) {
      //           this.$set(item, 'showMessage', true)
      //           this.$set(item, 'message', '请选择图片')
      //           this.upload = false
      //           return
      //         }
      //         if (!item.prodPicUrl) {
      //           this.$set(item, 'showMessage', true)
      //           this.$set(item, 'message', '请导入图片')
      //           this.upload = false
      //           return
      //         }
      //         ruleObj = {
      //           prodSeqid: index,
      //           prodId: item.prodId,
      //           prodName: item.prodName,
      //           prodUp: item.prodUp,
      //           prodStock: item.prodStock,
      //           lotteryRate: item.lotteryRate,
      //           showType: item.showType,
      //           prodPicName: item.prodPicName,
      //           prodPicUrl: item.prodPicUrl,
      //           ifThanks: 0
      //         }
      //       }
      //       rulesArr.push(ruleObj)
      //     })
      //     if (this.upload) {
      //       this.$emit('handleNext', rulesArr)
      //     }
      //   } else {
      //     return false
      //   }
      // })
    },
    setParams(type) {
      this.upload = true
      var rulesArr = []
      this.ruleForm.rules.forEach((item, index) => {
        var ruleObj = {}
        if ((item.showType === '01' && type !== 'TEMP') || type === 'TEMP') {
          ruleObj = {
            prodSeqid: index,
            prodId: item.prodId,
            prodName: item.prodName,
            prodUp: item.prodUp,
            prodStock: item.prodStock,
            lotteryRate: item.lotteryRate,
            showType: item.showType,
            prodDescribe1: item.prodDescribe1,
            prodDescribe2: item.prodDescribe2,
            ifThanks: 0
          }
        } else {
          this.$set(item, 'showMessage', false)
          if (!item.prodPicName) {
            this.$set(item, 'showMessage', true)
            this.$set(item, 'message', '请选择图片')
            this.upload = false
            return
          }
          if (!item.prodPicUrl) {
            this.$set(item, 'showMessage', true)
            this.$set(item, 'message', '请导入图片')
            this.upload = false
            return
          }
          ruleObj = {
            prodSeqid: index,
            prodId: item.prodId,
            prodName: item.prodName,
            prodUp: item.prodUp,
            prodStock: item.prodStock,
            lotteryRate: item.lotteryRate,
            showType: item.showType,
            prodPicName: item.prodPicName,
            prodPicUrl: item.prodPicUrl,
            ifThanks: 0
          }
        }
        rulesArr.push(ruleObj)
      })
      if (this.upload) {
        this.$emit('handleNext', rulesArr)
      }
    },
    removeRule(item) {
      var index = this.ruleForm.rules.indexOf(item)
      if (index !== -1) {
        this.ruleForm.rules.splice(index, 1)
      }
    },
    addRule() {
      if (this.lotteryType === '2') {
        if (this.ruleForm.rules.length < 8) {
          this.ruleForm.rules.push({
            prodId: '',
            prodName: '',
            prodUp: '',
            prodStock: '',
            lotteryRate: '',
            showType: '',
            prodPicName: '',
            prodPicUrl: '',
            pictureList: [],
            showMessage: false,
            message: ''
          })
        } else {
          this.$message({
            message: '扇区最多添加8个!',
            type: 'warning'
          })
        }
      } else if (this.lotteryType === '3') {
        if (this.ruleForm.rules.length < 5) {
          this.ruleForm.rules.push({
            prodId: '',
            prodName: '',
            prodUp: '',
            prodStock: '',
            lotteryRate: '',
            showType: '',
            prodPicName: '',
            prodPicUrl: '',
            pictureList: [],
            showMessage: false,
            message: ''
          })
        } else {
          this.$message({
            message: '奖品最多添加5个!',
            type: 'warning'
          })
        }
      }
    },
    resetRuleForm() {
      var ruleArr = []
      var rule = {}
      if (this.lotteryType === '1') {
        for (var i = 0; i < 8; i++) {
          rule = {
            prodId: '',
            prodName: '',
            prodUp: '',
            prodStock: '',
            lotteryRate: '',
            showType: '',
            prodPicName: '',
            prodPicUrl: '',
            pictureList: [],
            showMessage: false,
            message: ''
          }
          ruleArr.push(rule)
        }
        this.ruleForm = {
          rules: ruleArr
        }
      } else if (this.lotteryType === '2') {
        for (var j = 0; j < 5; j++) {
          rule = {
            prodId: '',
            prodName: '',
            prodUp: '',
            prodStock: '',
            lotteryRate: '',
            showType: '',
            prodPicName: '',
            prodPicUrl: '',
            pictureList: [],
            showMessage: false,
            message: ''
          }
          ruleArr.push(rule)
        }
        this.ruleForm = {
          rules: ruleArr
        }
      } else {
        this.ruleForm = {
          rules: [
            {
              prodId: '',
              prodName: '',
              prodUp: '',
              prodStock: '',
              lotteryRate: '',
              showType: '',
              prodPicName: '',
              prodPicUrl: '',
              pictureList: [],
              showMessage: false,
              message: ''
            }
          ]
        }
      }
    },
    handleDialogVisible(index) {
      this.ruleIndex = index
      this.prodDialogVisible = true
    },
    // 加载奖品配置
    getLotteryActProd() {
      API.lottery
        .getLotteryActProdData({
          actId: this.actId
        })
        .then(response => {
          if (response.data.data.length === 0) {
            this.resetRuleForm()
          } else {
            var data = response.data.data
            var ruleArr = []
            data.forEach(item => {
              var rule = {
                prodSeqid: item.prodSeqid,
                prodId: item.prodId,
                prodName: item.prodName,
                prodUp: item.prodUp,
                prodStock: item.prodStock,
                lotteryRate: item.lotteryRate && item.lotteryRate.toFixed(2),
                showType: item.showType,
                prodDescribe1: item.prodDescribe1,
                prodDescribe2: item.prodDescribe2,
                ifThanks: item.ifThanks,
                prodPicName: item.prodPicName,
                prodPicUrl: item.prodPicUrl,
                pictureList: [],
                showMessage: false,
                message: ''
              }
              ruleArr.push(rule)
            })
            this.ruleForm = {
              rules: ruleArr
            }
          }
        })
        .catch(() => {})
    },
    // 请求商品列表数据
    getProdTableList(page) {
      API.buy
        .getProdListData(
          Object.assign(
            {
              prodStatus: 1,
              current: page.currentPage,
              size: page.pageSize
            },
            this.prodSearchParams
          )
        )
        .then(response => {
          this.prodTableData = response.data.data.records
          this.page.total = response.data.data.total
        })
        .catch(() => {
          console.log('error')
        })
    },
    // 查询
    onSearchBtn() {
      this.selectProdId = ''
      this.selectProdName = ''
      this.radio = ''
      this.page.currentPage = 1
      this.getProdTableList(this.page)
    },
    // 查询重置
    onResetBtn() {
      this.selectProdId = ''
      this.selectProdName = ''
      this.radio = ''
      this.prodSearchParams = {
        suppName: '',
        suppChannel: this.$store.state.user.channel,
        prodName: ''
      }
      this.page.currentPage = 1
      this.getProdTableList(this.page)
    },
    // 分页
    pageChange(page) {
      this.selectProdId = ''
      this.selectProdName = ''
      this.radio = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getProdTableList(this.page)
    },
    // 表格单选
    onTableSelect(row) {
      this.selectProdId = row.prodId
      this.selectProdName = row.prodName
    },
    handleAdd() {
      if (!this.selectProdId) {
        this.$message({
          message: '请选择!',
          type: 'warning'
        })
      } else {
        this.ruleForm.rules.forEach((item, index) => {
          if (this.ruleIndex === index) {
            item.prodId = this.selectProdId
            item.prodName = this.selectProdName
          }
        })
        this.prodDialogVisible = false
      }
    },
    changeProdUp(val, i) {
      this.ruleForm.rules.forEach((item, index) => {
        if (i === index) {
          item.prodStock = val
        }
      })
    },
    // 图片预览
    previewImg(url) {
      if (!url) {
        this.$message.info('还没有上传的图片！')
        return
      }
      this.pictureUrl = url
      this.imgShow = true
    }
  },
  created() {
    if (this.type !== 'add') {
      this.getLotteryActProd()
    }
  },
  watch: {
    // active(value) {
    //   console.log(this.typeChanged)
    //   if (value === 2 && this.type !== 'add' && !this.typeChanged) {
    //     this.getLotteryActProd()
    //   }
    // },
    type(value) {
      if (!value) {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.ruleForm = {
            rules: [
              {
                prodId: '',
                prodName: '',
                prodUp: '',
                prodStock: '',
                lotteryRate: '',
                showType: ''
              }
            ]
          }
        })
      } else if (value !== 'add') {
        this.getLotteryActProd()
      } else if (value === 'add') {
        this.resetRuleForm()
      }
    },
    lotteryType(value, oldValue) {
      if (value !== oldValue && this.typeChanged) {
        this.resetRuleForm()
      }
    },
    prodDialogVisible(value) {
      if (value) {
        this.getProdTableList(this.page)
      } else {
        this.radio = ''
        this.selectProdId = ''
        this.selectProdName = ''
        this.prodSearchParams = {
          suppName: '',
          suppChannel: this.$store.state.user.channel,
          prodName: ''
        }
        this.page = {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
        this.prodTableData = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rule-form {
  .rule-form-title {
    display: flex;
    align-items: center;
    color: #111111;
    margin-bottom: 25px;

    .line {
      width: 2px;
      height: 12px;
      margin-right: 5px;
      background-color: #80a639;
    }
  }

  .rule-form-row {
    display: flex;

    .rule-form-num {
      width: 100px;

      .text {
        font-size: 12px;
        color: #676666;
      }

      .number {
        width: 20px;
        height: 20px;
        font-size: 10px;
        color: #ffffff;
        margin-left: 6px;
        text-align: center;
        line-height: 20px;
        display: inline-block;
        border-radius: 4px;
        background-color: #80a639;
      }
    }

    .el-form-item {
      /deep/ .el-input {
        width: 130px;
      }

      /deep/ .el-form-item__label {
        padding-right: 10px;
      }

      /deep/ .el-input-group__append {
        padding: 4px;
      }

      &:nth-child(2), &:nth-child(3), &:nth-child(4) {
        margin-right: 40px;
      }

      .el-icon-khz {
        width: 16px;
        height: 19px;
        background: url(../imgs/khz.png) center no-repeat;
        background-size: cover;
        position: relative;
        top: 3px;
        cursor: pointer;
      }
    }

    .el-icon-remove {
      font-size: 20px;
      line-height: 26px;
      color: #ff0000;
      margin-left: 15px;
      cursor: pointer;
    }
  }

  .rule-form-add {
    width: 72px;
    display: flex;
    align-items: center;
    color: #80a639;
    cursor: pointer;

    /deep/ .el-icon-tjzb {
      width: 11px;
      height: 11px;
      background: url(../imgs/tjzb.png) center no-repeat;
      background-size: cover;
      margin-right: 5px;
    }
  }

  .rule-form-notice {
    color: #ff0000;
    margin: 60px 0;

    p {
      margin: 0;
    }

    p:not(:first-child) {
      margin-left: 28px;
    }
  }
}

.prod-dialog,
.rule-dialog {
  .prod-dialog-search {
    .search-input {
      display: flex;
      justify-content: space-around;

      /deep/ .el-input {
        width: 140px;
        /deep/ .el-input__inner {
          height: 35px;
        }
      }
    }
  }

  .rule-dialog-search {
    .search-input {
      display: flex;
      justify-content: center;
      align-items: center;

      /deep/ .el-input {
        width: 248px;
      }
    }
  }

  .search-input-item {
    display: flex;
    align-items: center;

    &:nth-child(2) {
      margin: 0 50px;
    }
  }

  .search-input-label {
    width: 70px;
    margin-right: 16px;
  }

  .search-btns {
    margin: 30px 0;
    display: flex;
    justify-content: center;
  }

  .prod-dialog-btns,
  .rule-dialog-btns {
    display: flex;
    justify-content: center;
  }

  .el-button {
    height: 35px;
    display: flex;
    align-items: center;
    padding: 0 20px;

    /deep/ .el-icon-query {
      width: 18px;
      height: 18px;
      background: url(../imgs/search.png) center no-repeat;
      background-size: cover;
    }

    /deep/ .el-icon-reset {
      width: 15px;
      height: 19px;
      background: url(../imgs/reset.png) center no-repeat;
      background-size: cover;
    }
  }

  .prod-dialog-table,
  .rule-dialog-table {
    /deep/ tr {
      height: 35px;

      /deep/ th,
      td {
        padding: 0;
      }
    }

    /deep/ .el-radio__label {
      display: none;
    }
  }
}
.prodName0 {
  /deep/ .el-form-item__content {
    position: relative;
  }
  /deep/ .el-icon-plus {
    position: absolute;
    right: -20px;
    top: 5px;
  }
}
</style>
