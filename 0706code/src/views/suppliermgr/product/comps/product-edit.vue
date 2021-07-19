<template>
  <div class="product-edit">
    <el-dialog
      :title="type === 'create' ? '创建商品' : '修改商品'"
      :visible.sync="dialogEditVisible"
      width="1100px"
      :before-close="cancel"
    >
      <div style="width: 100%" v-loading="waitLoading">
        <el-steps :space="100" :active="step" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="图片配置"></el-step>
          <el-step title="券码导入" v-if="steps === 4"></el-step>
          <el-step title="短信模板配置" v-if="steps > 2"></el-step>
        </el-steps>
        <!-- 基本信息 -->
        <el-form
          :model="infoForm"
          :rules="rules"
          ref="infoForm"
          v-if="step == 1"
          label-position="left"
        >
          <div class="inline-form">
            <el-form-item
              label="供应商名称："
              label-width="110px"
              prop="suppName"
            >
              <el-input v-model="infoForm.suppName" autocomplete="off" disabled
                ><img
                  src="~@/assets/img/search-logo.png"
                  slot="suffix"
                  style="width:15px; height:18px; margin-bottom:2px"
                  @click="searchSupplier"
              /></el-input>
              <router-link :to="{ path: '/supplier/mgr' }" target="_blank">
                <i class="el-icon-plus add-icon-style"></i>
              </router-link>
            </el-form-item>
            <el-form-item
              label="供应商渠道："
              label-width="110px"
              prop="suppChannel"
            >
              <el-input
                v-model="$root.selectOption.channelObj[infoForm.suppChannel]"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品名称："
              label-width="110px"
              prop="prodName"
            >
              <el-input
                v-model="infoForm.prodName"
                autocomplete="off"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inline-form">
            <el-form-item
              label="单位成本："
              label-width="110px"
              prop="unitCost"
            >
              <el-input
                v-model="infoForm.unitCost"
                autocomplete="off"
                @blur="unitCostBlur"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="市场价(元)："
              label-width="110px"
              prop="showPrice"
            >
              <el-input
                v-model="infoForm.showPrice"
                autocomplete="off"
                @blur="showPriceBlur"
              ></el-input>
            </el-form-item>
            <el-form-item label="计量单位：" label-width="110px" prop="units">
              <el-input
                v-model="infoForm.units"
                autocomplete="off"
                maxlength="16"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inline-form">
            <el-form-item label="数量：" label-width="110px" prop="prodCnt">
              <el-input
                v-model="infoForm.prodCnt"
                autocomplete="off"
                maxlength="8"
                :disabled="updDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="小苏通通知："
              label-width="110px"
              prop="ifMessage"
            >
              <el-select
                v-model="infoForm.ifMessage"
                placeholder=""
              >
                <el-option label="是" value="0"></el-option>
                <el-option label="否" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="商品类型："
              label-width="110px"
              prop="prodType"
            >
              <el-select
                v-model="infoForm.prodType"
                placeholder=""
                @change="typeChange"
                :disabled="updDisabled"
              >
                <el-option label="请选择" value=""></el-option>
                <el-option label="虚拟" value="1"></el-option>
                <el-option label="实物" value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="inline-form">
            <div v-if="infoForm.prodType === '2'" class="required-col">
              <span class="input-required">*</span>
              <el-form-item
                label="是否发送短信："
                label-width="110px"
                prop="isMsg"
              >
                <el-select
                  v-model="infoForm.isMsg"
                  placeholder=""
                  :disabled="updDisabled"
                  @change="sendChange"
                >
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="是" value="0"></el-option>
                  <el-option label="否" value="1"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div
              class="required-col"
              v-else
            >
              <span class="input-required">*</span>
              <el-form-item
                label="商品细类："
                label-width="110px"
                prop="ifThanks"
              >
                <el-select
                  v-model="infoForm.ifThanks"
                  placeholder=""
                  :disabled="updDisabled"
                  @change="thanksChange"
                >
                  <el-option label="请选择" value=""></el-option>
                  <el-option label="券码" value="0"></el-option>
                  <el-option label="谢谢惠顾" value="1"></el-option>
                  <el-option label="积分" value="2"></el-option>
                  <el-option label="苏惠保" value="3"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <el-form-item
              v-if="infoForm.prodType === '2'"
              label="是否发货："
              label-width="110px"
              prop="ifShipment"
            >
              <el-select
                v-model="infoForm.ifShipment"
                placeholder=""
              >
                <el-option label="请选择" value=""></el-option>
                <el-option label="是" value="0"></el-option>
                <el-option label="否" value="1"></el-option>
              </el-select>
            </el-form-item>
            <div
              class="required-col"
              :style="{
                display: isMsg ? 'block' : 'none'
              }"
            >
              <span class="input-required">*</span>
              <el-form-item
                label="是否发送短信："
                label-width="110px"
                prop="isMsg"
              >
                <el-select
                  v-model="infoForm.isMsg"
                  placeholder=""
                  :disabled="updDisabled"
                  @change="sendChange"
                >
                  <!-- <el-option label="请选择" value=""></el-option> -->
                  <el-option label="是" value="0"></el-option>
                  <!-- <el-option label="否" value="1"></el-option> -->
                </el-select>
              </el-form-item>
            </div>
            <div style="visibility: hidden">
              <el-form-item label-width="110px">
                <el-input></el-input>
              </el-form-item>
            </div>
          </div>
          <div>
            <el-form-item
              label="商品规格："
              label-width="110px"
              prop="prodSpec"
            >
              <el-input
                type="textarea"
                :rows="4"
                v-model="infoForm.prodSpec"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="商品说明：" label-width="110px">
              <el-input
                type="textarea"
                :rows="4"
                maxlength="100"
                v-model="infoForm.notes"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <!-- 图片配置 -->
        <div class="cus-button" v-if="step === 2">
          <div class="upload">
            <span>列表预览图：</span>
            <el-input
              placeholder=""
              v-model="imgs.listPreviewName"
              disabled
              style="padding: 0 10px;position: relative"
            >
              <el-upload
                slot="append"
                ref="uploadPreview"
                action
                class="upload-demo"
                accept=".png, .jpg, .jpeg"
                :auto-upload="false"
                :show-file-list="false"
                :file-list="previewList"
                :before-upload="beforeUpload"
                :http-request="handlePreviewRequest"
                :multiple="false"
                :on-change="handlePreviewChange"
              >
                <el-button size="small" type="primary">选择图片</el-button>
                <div
                  style="position: absolute;left: -120px;top: 30px;color:#ff0000"
                >
                  <span v-if="showPreviewMessage">{{ previewMessage }}</span>
                </div>
              </el-upload>
            </el-input>
            <el-button @click="uploadPreview" :loading="previewLoading"
              >导入</el-button
            >
            <!-- <el-button @click="download">导入</el-button> -->
          </div>
          <div class="upload">
            <span>详情图：</span>
            <el-input
              placeholder=""
              v-model="setDetialInput"
              disabled
              style="padding: 0 10px;position: relative"
            >
              <el-upload
                slot="append"
                ref="uploadDetailImg"
                action
                class="upload-demo"
                accept=".png, .jpg, .jpeg"
                :auto-upload="false"
                :before-upload="beforeDetailUpload"
                :http-request="handleDetailImg"
                :file-list="fileList"
                multiple
                :limit="5"
                :on-change="handlePictureChange"
                :on-remove="handleRemove"
              >
                <el-button size="small" type="primary">选择图片</el-button>
                <div
                  style="position: absolute;left: -120px;top: 30px;color:#ff0000"
                >
                  <span v-if="showPictureMessage">{{ pictureMessage }}</span>
                </div>
              </el-upload>
            </el-input>
            <el-button @click="uploadDetail" :loading="uploadDetailLoading"
              >导入</el-button
            >
            <span style="margin-left: 100px">商品轮播图：</span>
            <el-input
              placeholder=""
              v-model="setSlideInput"
              disabled
              style="padding: 0 10px;position: relative"
            >
              <el-upload
                slot="append"
                ref="uploadSlideImg"
                action
                class="upload-demo"
                accept=".png, .jpg, .jpeg"
                :auto-upload="false"
                :before-upload="beforeSlideUpload"
                :http-request="handleSlideImg"
                :file-list="slideList"
                multiple
                :limit="5"
                :on-change="handleSlideChange"
                :on-remove="handleSlideRemove"
              >
                <el-button size="small" type="primary">选择图片</el-button>
                <div
                  style="position: absolute;left: -120px;top: 30px;color:#ff0000"
                >
                  <span v-if="showSlideMessage">{{ slideMessage }}</span>
                </div>
              </el-upload>
            </el-input>
            <el-button @click="uploadSlide" :loading="uploadSlideLoading"
              >导入</el-button
            >
          </div>
        </div>
        <!-- 券码导入 -->
        <div v-if="steps === 4 && step === 3">
          <div class="upload cus-button" style="justify-content: center">
            <!-- <span style="color: #F56C6C; margin-right:4px">*</span> -->
            <span>选择文件：</span>
            <el-input
              placeholder=""
              v-model="fileName"
              disabled
              style="padding: 0 10px;position: relative;"
            >
              <el-upload
                slot="append"
                ref="upload"
                action
                class="upload-demo"
                accept=".xls, .xlsx"
                :show-file-list="false"
                :auto-upload="false"
                :http-request="handleRequest"
                :multiple="false"
                :file-list="files"
                :on-change="handleChange"
              >
                <el-button size="small" type="primary">选择文件</el-button>
                <div
                  style="position: absolute;left: -120px;top: 30px;color:#ff0000"
                >
                  <span v-show="messageShow">请选择并导入文件</span>
                </div>
              </el-upload>
            </el-input>
            <el-button @click="upload" :loading="importLoading">导入</el-button>
            <el-button @click="exportExcel" :loading="exportLoading"
              >导出</el-button
            >
            <el-button @click="download" :loading="downloadLoading"
              >模板下载</el-button
            >
          </div>
        </div>
        <!-- 短信模板配置 -->
        <div v-if="steps > 2 && step === steps">
          <edit-step4
            :step="step"
            :steps="steps"
            :operate="operate"
            :type="type"
            :prodId="infoForm.prodId"
            :msgContext="msgContext"
            :smsTemplateId="smsTemplateId"
            @setLoading="setLoading"
            @setOperate="operate = ''"
            @cancel="cancel"
          ></edit-step4>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        :style="{ display: waitLoading ? 'none' : 'block' }"
      >
        <div class="message" v-if="step === 2">
          注：1、“列表浏览图”最多添加1张；<br />
          2、“详情图”最多添加5张。<br />
          3、“商品轮播图”最多添加5张。<br />
          4、列表预览图宽240像素， 高160像素。<br />
          5、详情图宽750像素，高不限。<br />
          6、商品轮播图宽750像素，高530像素。<br />
        </div>
        <el-button @click="step--" v-if="step != 1">上一步</el-button>
        <el-button type="primary" @click="save" :loading="loading">{{
          step === steps ? '提交' : '下一步'
        }}</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <!-- 提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogConfirmVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>{{ msg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirmVisible = false"
          >确 认</el-button
        >
      </span>
    </el-dialog>
    <!-- 选择供应商 -->
    <supplier-select
      :dialogSupplierVisible="dialogSupplierVisible"
      @cancel="close"
    ></supplier-select>
  </div>
</template>

<script>
import editStep4 from './edit-step4'
import supplierSelect from './supplier-select'
import API from '@/api'
import { validateImg, imgFormat, fileFormat } from '@/utils/validate'
export default {
  components: { editStep4, supplierSelect },
  props: {
    dialogEditVisible: {
      type: Boolean
    },
    type: {
      type: String
    },
    prodId: {
      type: String
    },
    currentStatus: {
      type: String
    }
  },
  watch: {
    dialogEditVisible(value) {
      if (value) {
        // 初始化数据
        this.showPictureMessage = false
        this.showSlideMessage = false
        if (this.type === 'create') {
          for (let key in this.infoForm) {
            this.infoForm[key] = ''
          }
          this.infoForm.suppChannel = this.$store.state.user.channel
          this.infoForm.ifMessage = '0'
          this.fileName = ''
          this.fileList = []
          this.previewList = []
          this.slideList = []
          this.uploadPreviewFlg = false
          this.uploadDetailFlg = false
          this.uploadSlideFlg = false
          this.msgContext = ''
          this.smsTemplateId = ''
          this.steps = 2
          this.imgs = {
            listPreviewName: ''
          }
        } else {
          this.waitLoading = true
          this.init()
        }

        // 移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['infoForm'].clearValidate()
        })
      }
    },
    'imgs.listPreviewName': {
      handler: function(value, oldVal) {
        this.showPreviewMessage = !value && oldVal
        this.previewMessage = '请选择图片'
      },
      deep: true,
      immediate: true
    },
    setDetialInput(val, oldVal) {
      this.showPictureMessage = !val && oldVal && this.infoForm.prodType === '2'
      this.pictureMessage = '请选择图片'
    },
    setSlideInput(val, oldVal) {
      this.showSlideMessage = !val && oldVal
      this.slideMessage = '请选择图片'
    }
  },
  computed: {
    setDetialInput() {
      return this.fileList.length === 0 ? '' : `${this.fileList.length}个文件`
    },
    setSlideInput() {
      return this.slideList.length === 0 ? '' : `${this.slideList.length}个文件`
    },
    isMsg() {
      return (
        this.infoForm.prodType === '1' &&
        (this.infoForm.ifThanks === '0' || this.infoForm.ifThanks === '3')
      )
    },
    updDisabled() {
      return this.currentStatus === '1' && this.type === 'update'
    }
  },
  data() {
    // 校验数量
    var checkUnit = (rule, value, callback) => {
      if (!/^[0-9]{1,}[\d]*$/.test(value)) {
        return callback(new Error('请输入正整数'))
      }
      return callback()
    }
    // 校验单位成本
    var checkUnitCost = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        return callback(new Error('请输入正数'))
      }
      if (
        value !== '' &&
        String(value).split('.')[1] &&
        String(value).split('.')[1].length > 2
      ) {
        return callback(new Error('最多保留小数点后2位'))
      }
      if (
        value !== '' &&
        String(value).split('.')[0] &&
        String(value).split('.')[0].length > 4
      ) {
        return callback(new Error('整数部分最多4位'))
      }
      return callback()
    }
    // 校验单位成本
    var checkShowPrice = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        return callback(new Error('请输入正数'))
      }
      if (
        value !== '' &&
        String(value).split('.')[1] &&
        String(value).split('.')[1].length > 2
      ) {
        return callback(new Error('最多保留小数点后2位'))
      }
      if (
        value !== '' &&
        String(value).split('.')[0] &&
        String(value).split('.')[0].length > 4
      ) {
        return callback(new Error('整数部分最多4位'))
      }
      return callback()
    }
    // 判断短信选择
    var checkMsg = (rule, value, callback) => {
      if (
        (!value &&
          this.infoForm.prodType === '1' &&
          this.infoForm.ifThanks === '0') ||
        (!value && this.infoForm.prodType === '2')
      ) {
        return callback(new Error('请选择是否发送短信'))
      }
      return callback()
    }
    // 判断商品细类
    var checkIfThanks = (rule, value, callback) => {
      if (!value && this.infoForm.prodType === '1') {
        return callback(new Error('请选择商品细类'))
      }
      return callback()
    }
    return {
      waitLoading: false,
      step: 1,
      steps: 2,
      // supplier: {},
      // 模板信息 更新用
      msgContext: '',
      smsTemplateId: '',
      infoForm: {
        suppId: '',
        suppName: '',
        suppChannel: this.$store.state.user.channel,
        prodName: '',
        prodType: '',
        unitCost: '',
        prodCnt: '',
        ifMessage: '0',
        isMsg: '',
        ifThanks: '',
        prodSpec: '',
        notes: '',
        units: '',
        prodId: '',
        ifShipment: ''
      },
      rules: {
        suppName: [
          { required: true, message: '请选择供应商名称', trigger: 'change' }
        ],
        suppChannel: [
          { required: true, message: '请选择供应商渠道', trigger: 'change' }
        ],
        prodName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        prodType: [
          { required: true, message: '请选择商品类型', trigger: 'change' }
        ],
        unitCost: [
          { required: true, message: '请输入单位成本', trigger: 'blur' },
          { validator: checkUnitCost, trigger: 'blur' }
        ],
        showPrice: [
          { required: true, message: '请输入市场价', trigger: 'blur' },
          { validator: checkShowPrice, trigger: 'blur' }
        ],
        isMsg: [{ validator: checkMsg, trigger: 'change' }],
        ifThanks: [{ validator: checkIfThanks, trigger: 'change' }],
        units: [{ required: true, message: '请输入计量单位', trigger: 'blur' }],
        prodCnt: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { validator: checkUnit, trigger: 'blur' }
        ],
        ifMessage: [
          { required: true, message: '请选择小苏通通知', trigger: 'blur' }
        ],
        prodSpec: [
          { required: true, message: '请输入商品规格', trigger: 'blur' }
        ],
        ifShipment: [
          { required: true, message: '请选择是否发货', trigger: 'blur' }
        ]
      },
      loading: false,
      importLoading: false,
      downloadLoading: false,
      uploadDetailLoading: false,
      previewLoading: false,
      uploadSlideLoading: false,
      exportLoading: false,
      fileName: '',
      fileList: [],
      slideList: [],
      previewList: [],
      files: [],
      uploadMsg: '', // 是否有提示
      uploadFile: false, // 是否导入券码
      uploadPreviewFlg: false, // 是否导入预览图
      uploadDetailFlg: false, // 是否导入详情图
      uploadSlideFlg: false, // 是否导入轮播图
      imgs: {
        listPreviewName: ''
        // detailPictureName: ''
      },
      messageShow: false,
      showPreviewMessage: false,
      previewMessage: '',
      showPictureMessage: false,
      pictureMessage: '',
      showSlideMessage: false,
      slideMessage: '',
      msg: '',
      dialogConfirmVisible: false,
      dialogSupplierVisible: false,
      operate: '',
      formData: new FormData(),
      count: 0, // 详情图上传中符合标准的
      slideCount: 0 // 轮播图上传符合标准的
    }
  },

  methods: {
    // 预览图判断长宽
    beforeUpload(file) {
      if (imgFormat(file)) {
        this.previewLoading = false
        this.previewList = []
        this.$refs.uploadPreview.clearFiles()
        this.resetForm('uploadPreview')
        return
      }
      let _this = this
      let imgWidth = 240
      let imgHight = 160
      validateImg(file, imgWidth, imgHight)
        .then(() => {
          this.uploadImg()
        })
        .catch(() => {
          _this.$message.warning({
            message: `上传文件的图片大小不合符标准,宽需要为${imgWidth}px，高需要为${imgHight}px。`
          })
          this.previewLoading = false
          this.previewList = []
          this.$refs.uploadPreview.clearFiles()
          this.resetForm('uploadPreview')
        })
    },
    // 详情图判断长宽
    beforeDetailUpload(file) {
      if (imgFormat(file)) {
        this.uploadDetailLoading = false
        this.resetForm('uploadDetailImg')
        return
      }
      let _this = this
      let imgWidth = 750
      let imgHight = 0
      // let imgHight = 530
      validateImg(file, imgWidth, imgHight)
        .then(() => {
          this.formData.append('files', file)
          this.count++
          if (
            this.count ===
            this.$refs.uploadDetailImg.fileList.filter(
              item => item.status === 'ready'
            ).length
          ) {
            this.uploadDetailImg()
          }
        })
        .catch(() => {
          _this.$message.warning({
            message: `上传文件的图片大小不合符标准,宽需要为${imgWidth}px。`
          })
          this.resetForm('uploadDetailImg')
          this.uploadDetailLoading = false
        })
    },
    // 轮播图判断长宽
    beforeSlideUpload(file) {
      if (imgFormat(file)) {
        this.uploadSlideLoading = false
        this.resetForm('uploadSlideImg')
        return
      }
      let _this = this
      let imgWidth = 750
      let imgHight = 530
      validateImg(file, imgWidth, imgHight)
        .then(() => {
          this.formData.append('files', file)
          this.slideCount++
          if (
            this.slideCount ===
            this.$refs.uploadSlideImg.fileList.filter(
              item => item.status === 'ready'
            ).length
          ) {
            this.uploadSlideImg()
          }
        })
        .catch(() => {
          _this.$message.warning({
            message: `上传文件的图片大小不合符标准,宽需要为${imgWidth}px，高需要为${imgHight}px。`
          })
          this.resetForm('uploadSlideImg')
          this.uploadSlideLoading = false
        })
    },
    // 设置loading footer
    setLoading(val) {
      this.waitLoading = val
    },
    // 更新初始化数据
    init() {
      this.fileName = ''
      this.uploadPreviewFlg = true
      this.uploadDetailFlg = true
      this.uploadSlideFlg = true
      // 预览图
      this.previewList = []
      API.product
        .getProdOne({ prodId: this.prodId })
        .then(res => {
          this.infoForm = res.data.data.prodInfo
          // 处理商品细类以及发送短信
          if (res.data.data.prodInfo.ifThanks === null) {
            this.infoForm.ifThanks = ''
          }
          if (res.data.data.prodInfo.isMsg === null) {
            this.infoForm.isMsg = ''
          }
          this.infoForm.unitCost = this.infoForm.unitCost.toFixed(2)
          this.infoForm.showPrice = this.infoForm.showPrice.toFixed(2)
          this.imgs = res.data.data.prodImg
          this.waitLoading = false
          // 详情图反显
          this.setFileList()
          // 轮播图反显
          this.setSlideList()
          this.msgContext = res.data.data.prodMsg.msgContext
          this.smsTemplateId = res.data.data.prodMsg.smsTemplateId
          this.sendChange()
        })
        .catch(() => {
          this.waitLoading = false
        })
    },
    setFileList() {
      this.fileList = []
      if (this.imgs.detailPicture1Url) {
        this.fileList.push({
          name: this.imgs.detailPicture1Name,
          url: this.imgs.detailPicture1Url
        })
      }
      if (this.imgs.detailPicture2Url) {
        this.fileList.push({
          name: this.imgs.detailPicture2Name,
          url: this.imgs.detailPicture2Url
        })
      }
      if (this.imgs.detailPicture3Url) {
        this.fileList.push({
          name: this.imgs.detailPicture3Name,
          url: this.imgs.detailPicture3Url
        })
      }
      if (this.imgs.detailPicture4Url) {
        this.fileList.push({
          name: this.imgs.detailPicture4Name,
          url: this.imgs.detailPicture4Url
        })
      }
      if (this.imgs.detailPicture5Url) {
        this.fileList.push({
          name: this.imgs.detailPicture5Name,
          url: this.imgs.detailPicture5Url
        })
      }
    },
    setSlideList() {
      this.slideList = []
      if (this.imgs.slideshow1Url) {
        this.slideList.push({
          name: this.imgs.slideshow1Name,
          url: this.imgs.slideshow1Url
        })
      }
      if (this.imgs.slideshow2Url) {
        this.slideList.push({
          name: this.imgs.slideshow2Name,
          url: this.imgs.slideshow2Url
        })
      }
      if (this.imgs.slideshow3Url) {
        this.slideList.push({
          name: this.imgs.slideshow3Name,
          url: this.imgs.slideshow3Url
        })
      }
      if (this.imgs.slideshow4Url) {
        this.slideList.push({
          name: this.imgs.slideshow4Name,
          url: this.imgs.slideshow4Url
        })
      }
      if (this.imgs.slideshow5Url) {
        this.slideList.push({
          name: this.imgs.slideshow5Name,
          url: this.imgs.slideshow5Url
        })
      }
    },
    // 商品类型变更
    typeChange() {
      this.$refs.infoForm.clearValidate('ifThanks')
      this.$refs.infoForm.clearValidate('isMsg')
      if (this.infoForm.prodType !== '1') {
        this.infoForm.isMsg = ''
        this.infoForm.ifThanks = ''
      }
      this.thanksChange()
    },
    thanksChange() {
      this.infoForm.isMsg =
        this.infoForm.ifThanks === '0' || this.infoForm.ifThanks === '3'
          ? '0'
          : ''
      this.sendChange()
    },
    // 选择发送信息变更
    sendChange() {
      if (this.infoForm.ifThanks === '0') {
        this.steps = 4
      } else if (
        (this.infoForm.prodType === '2' && this.infoForm.isMsg === '0') ||
        (this.infoForm.prodType === '1' && this.infoForm.ifThanks === '3')
      ) {
        this.steps = 3
      } else {
        this.steps = 2
      }
    },
    // 选择供应商
    searchSupplier() {
      this.dialogSupplierVisible = true
    },
    // 关闭供应商弹框
    close(val) {
      this.dialogSupplierVisible = false
      this.infoForm.suppId = val.info.suppId
      this.infoForm.suppName = val.info.suppName
      this.infoForm.suppChannel = val.info.suppChannel
      // this.supplier = val.info
    },
    unitCostBlur() {
      // 保证输入的第一个不是小数点
      this.infoForm.unitCost = this.infoForm.unitCost.replace(/^\./g, '')
      // 输入小数点只能是一个
      this.infoForm.unitCost = this.infoForm.unitCost
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
    },
    showPriceBlur() {
      // 保证输入的第一个不是小数点
      this.infoForm.showPrice = this.infoForm.showPrice.replace(/^\./g, '')
      // 输入小数点只能是一个
      this.infoForm.showPrice = this.infoForm.showPrice
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
    },
    // 下一步/导入
    save() {
      switch (this.step) {
        case 1:
          this.$refs['infoForm'].validate(valid => {
            if (!valid) {
              return false
            }
            this.saveProd()
          })
          break
        case 2:
          this.saveProdImg()
          break
        case 3:
          if (this.steps === 3) {
            this.operate = 'submit'
          } else {
            if (this.uploadFile) {
              this.step++
              this.messageShow = false
            } else {
              if (this.uploadMsg) {
                this.$message.warning(this.uploadMsg)
              } else {
                this.messageShow = true
              }
            }
          }
          // this.step = this.step + 1
          break
        case 4:
          this.operate = 'submit'
          break
        default:
      }
    },
    // 商品保存修改(基本信息)
    saveProd() {
      this.loading = true
      API.product
        .saveProd(
          Object.assign(this.infoForm, {
            prodName: this.infoForm.prodName.trim(),
            createEmpName: this.infoForm.prodId
              ? ''
              : this.$store.state.user.name,
            createEmpNo: this.infoForm.prodId ? '' : this.$store.state.user.id,
            modifyEmpName: this.infoForm.prodId
              ? this.$store.state.user.name
              : '',
            modifyEmpNo: this.infoForm.prodId ? this.$store.state.user.id : ''
          })
        )
        .then(res => {
          // 下一步
          this.loading = false
          this.step = 2
          this.infoForm.prodId = res.data.data
          this.showPictureMessage = false
        })
        .catch(error => {
          this.loading = false
          this.$message.error(error.msg)
        })
    },
    // 商品保存修改(图片配置)
    saveProdImg() {
      this.showPreviewMessage =
        this.imgs.listPreviewName === null || this.imgs.listPreviewName === ''
      // 虚拟商品不是必传
      this.showPictureMessage =
        this.setDetialInput === '' && this.infoForm.prodType === '2'
      this.showSlideMessage = this.setSlideInput === ''
      if (this.showPreviewMessage) {
        this.previewMessage = '请选择图片'
        return
      }
      if (this.showPictureMessage) {
        this.pictureMessage = '请选择图片'
        return
      }
      if (this.showSlideMessage) {
        this.slideMessage = '请选择图片'
        return
      }
      // 判读有没有导入
      if (!this.uploadPreviewFlg) {
        this.$message.error('请导入列表预览图！')
        return
      }
      if (!this.uploadDetailFlg && this.infoForm.prodType === '2') {
        this.$message.error('请导入详情图！')
        return
      }
      if (!this.uploadSlideFlg) {
        this.$message.error('请导入轮播图！')
        return
      }
      this.loading = true
      // 上传参数赋值
      let imgs = {
        prodId: this.infoForm.prodId,
        listPreviewUrl: this.imgs.listPreviewUrl,
        listPreviewName: this.imgs.listPreviewName
      }
      this.fileList.map((file, index) => {
        let name = `detailPicture${index + 1}Name`
        let url = `detailPicture${index + 1}Url`
        imgs[name] = file.name
        imgs[url] = file.url
      })
      this.slideList.map((file, index) => {
        let name = `slideshow${index + 1}Name`
        let url = `slideshow${index + 1}Url`
        imgs[name] = file.name
        imgs[url] = file.url
      })
      API.product
        .saveProdImg(imgs)
        .then(() => {
          if (this.steps === 4) {
            // 获取判断是否导入券码
            API.product
              .getCodeCount({ prodId: this.infoForm.prodId })
              .then(res => {
                this.uploadFile = !(res.data.data === 0 || res.data.msg)
                this.uploadMsg = res.data.msg
                if (this.uploadMsg) {
                  this.$message.warning(this.uploadMsg)
                }
                this.loading = false
                this.step++
              })
          } else if (this.steps === 3) {
            this.loading = false
            this.step++
          } else {
            this.loading = false
            this.$message.success('操作成功！')
            this.cancel()
          }
        })
        .catch(error => {
          this.$message.error(error.msg)
          this.loading = false
        })
    },
    // 列表预览图
    handlePreviewChange(file, fileList) {
      // 只有一张图片
      this.previewList = []
      this.previewList.push(fileList[fileList.length - 1])
      this.uploadPreviewFlg = false
      this.imgs.listPreviewName = file.name
    },
    handlePreviewRequest(params) {
      this.formData.append('files', params.file)
    },
    uploadPreview() {
      if (!this.imgs.listPreviewName) {
        this.showPreviewMessage = true
        return
      }

      if (this.previewList.length === 0) {
        this.$message.warning('请选择新的图片再导入！')
        return
      }
      this.previewLoading = true
      this.formData = new FormData()
      this.$refs.uploadPreview.submit()
    },
    // 调用接口上传图片
    uploadImg() {
      API.common
        .upload(this.formData)
        .then(res => {
          this.previewLoading = false
          this.uploadPreviewFlg = true
          if (res.data.data.length > 0) {
            this.imgs.listPreviewUrl = res.data.data[0].fileUrl
          }
          this.$message.success('操作成功！')
          this.previewList = []
          this.$refs.uploadPreview.clearFiles()
          this.resetForm('uploadPreview')
        })
        .catch(() => {
          this.previewLoading = false
          this.previewList = []
          this.$refs.uploadPreview.clearFiles()
          this.resetForm('uploadPreview')
        })
    },
    // 详情图：
    handlePictureChange(file, fileList) {
      this.fileList = fileList
      this.uploadDetailFlg = false
    },
    handleRemove(file) {
      let i = this.fileList.findIndex((value, index, arr) => {
        return file.uid === value.uid
      })
      this.fileList.splice(i, 1)
    },
    // 详情图上传
    handleDetailImg(params) {
      // this.formData.append('files', params.file)
    },
    // 导入详情图
    uploadDetail() {
      this.count = 0
      if (this.fileList.length === 0) {
        this.showPictureMessage = true
        this.pictureMessage = '请选择图片'
        return
      }
      if (
        this.$refs.uploadDetailImg.fileList.filter(
          item => item.status === 'ready'
        ).length === 0
      ) {
        this.$message.warning('请选择新的图片再导入！')
        return
      }
      this.uploadDetailLoading = true
      this.formData = new FormData()
      this.$refs.uploadDetailImg.submit()
    },
    // 详情图上传
    uploadDetailImg() {
      API.common
        .upload(this.formData)
        .then(res => {
          this.uploadDetailLoading = false
          res.data.data.map((data, index) => {
            this.fileList.map((file, idx) => {
              if (file.name === data.name) {
                this.$set(this.fileList[idx], 'url', data.fileUrl)
              }
            })
          })
          this.uploadDetailFlg = true
          this.resetForm('uploadDetailImg')
          this.$message.success('操作成功！')
        })
        .catch(() => {
          this.uploadDetailLoading = false
          this.resetForm('uploadDetailImg')
        })
    },
    // 轮播图：
    handleSlideChange(file, fileList) {
      this.slideList = fileList
      this.uploadSlideFlg = false
    },
    handleSlideRemove(file) {
      let i = this.slideList.findIndex((value, index, arr) => {
        return file.uid === value.uid
      })
      this.slideList.splice(i, 1)
    },
    // 轮播图上传
    handleSlideImg(params) {
      // this.formData.append('files', params.file)
    },
    // 导入轮播图
    uploadSlide() {
      this.slideCount = 0
      if (this.slideList.length === 0) {
        this.showSlideMessage = true
        this.slideMessage = '请选择图片'
        return
      }
      if (
        this.$refs.uploadSlideImg.fileList.filter(
          item => item.status === 'ready'
        ).length === 0
      ) {
        this.$message.warning('请选择新的图片再导入！')
        return
      }
      this.uploadSlideLoading = true
      this.formData = new FormData()
      this.$refs.uploadSlideImg.submit()
    },
    // 轮播图上传
    uploadSlideImg() {
      API.common
        .upload(this.formData)
        .then(res => {
          this.uploadSlideLoading = false
          res.data.data.map((data, index) => {
            this.slideList.map((file, idx) => {
              if (file.name === data.name) {
                this.slideList[idx].url = data.fileUrl
              }
            })
          })
          this.uploadSlideFlg = true
          this.resetForm('uploadSlideImg')
          this.$message.success('操作成功！')
        })
        .catch(() => {
          this.uploadSlideLoading = false
          this.resetForm('uploadSlideImg')
        })
    },
    // 选择文件变更
    handleChange(file, fileList) {
      // 只能传一个文件
      this.files = []
      this.files.push(fileList[fileList.length - 1])
      this.fileName = file.name
      this.uploadFile = false
      if (this.fileName !== '') {
        this.messageShow = false
      }
    },
    // 导入excel
    handleRequest(param) {
      if (fileFormat(param.file)) {
        this.resetForm('upload')
        this.importLoading = false
        this.$refs.upload.clearFiles()
        this.fileName = ''
        return
      }
      this.formData.append('codeFile', param.file)
      this.saveCode()
    },
    // 导入
    upload() {
      if (this.fileName === '') {
        this.messageShow = true
        return
      }
      this.importLoading = true
      this.formData = new FormData()
      this.$refs.upload.submit()
    },
    // 导入文件
    saveCode() {
      this.formData.append('prodId', this.infoForm.prodId)
      this.formData.append('createEmpName', this.$store.state.user.name)
      this.formData.append('createEmpNo', this.$store.state.user.id)
      API.product
        .saveCode(this.formData)
        .then(res => {
          this.importLoading = false
          this.uploadFile = true
          this.messageShow = false
          this.uploadFile = true
          this.uploadMsg = ''
          this.dialogConfirmVisible = true
          this.msg = res.data.msg
          this.$refs.upload.clearFiles()
          this.fileName = ''
          this.resetForm('upload')
          // this.$message.success('导入成功！')
        })
        .catch(error => {
          this.resetForm('upload')
          this.importLoading = false
          this.$message.warning(error.msg)
          this.$refs.upload.clearFiles()
          this.fileName = ''
        })
    },
    // 清空input val
    resetForm(uploadName) {
      // 判断ie10以及以下
      let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
      let ele = this.$refs[uploadName].$el.getElementsByTagName('input')[0]
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
    // 导出模板
    exportExcel() {
      this.exportLoading = true
      API.product
        .exportCodeFile(this.infoForm.prodId)
        .then(data => {
          this.exportLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '券码.xls')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '券码.xls'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.exportLoading = false
          this.$message.error('暂无数据')
        })
    },
    // 下载模板
    download() {
      this.downloadLoading = true
      // 返回数据流
      API.product
        .uploadCodeFile()
        .then(data => {
          this.downloadLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '券码模板.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '券码模板.xls'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.downloadLoading = false
          this.$message.error('暂无数据')
        })
    },
    cancel() {
      this.$emit('cancel', { type: this.type, step: this.step })
      setTimeout(() => {
        this.step = 1
        // message清空
        this.messageShow = false
        this.fileList = []
        this.slideList = []
        this.imgs.listPreviewName = ''
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-edit {
  /deep/ .el-input,
  /deep/ .el-input__inner {
    width: 220px;
    height: 26px !important;
    line-height: 26px !important;
  }
  /deep/ .el-form-item__label {
    padding: 0;
  }
  /deep/ .el-step {
    width: 10%;
    max-width: unset !important;
  }
  .upload {
    display: flex;
    align-items: center;
    // justify-content: center;
    span {
      width: 84px;
      display: block;
    }
    margin-top: 40px;
  }
  .inline-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cus-button {
    width: 80%;
    margin: auto;
  }
  .cus-button /deep/ .el-button {
    // height: 26px;
    // line-height: 26px;
    padding: 5px 9px;
  }
  .message {
    color: #ff0000;
    padding: 120px 0 80px 120px;
    font-size: 12px;
    // padding-right: 150px;
    text-align: left;
  }
  .required-col {
    display: flex;
    /deep/ .el-form-item__label {
      padding-left: 10px;
    }
  }
  .input-required {
    color: #f56c6c;
    padding: 10px 4px 0 0;
    display: block;
    float: left;
    position: absolute;
  }
  /deep/ .el-upload-list {
    position: absolute;
    left: -120px;
  }
}
.add-icon-style {
  position: absolute;
  bottom: 13px;
  right: -16px;
  cursor: pointer;
}
</style>
