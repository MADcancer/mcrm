<template>
  <div class="edit">
    <el-dialog
      title="灰度名单详情"
      :visible.sync="dialogInfoVisible"
      width="1000px"
      :before-close="cancel"
    >
      <div v-loading="waitLoading">
        <el-form
          label-position="left"
          label-width="120px"
          :model="editForm"
          ref="editForm"
        >
          <div class="info-form-row">
            <el-form-item label="客户号：" prop="custNo">
              <el-input v-model="editForm.custNo" autocomplete="off" maxlength="60" disabled></el-input>
            </el-form-item>
            <el-form-item label="客户姓名：" prop="custName">
              <el-input v-model="editForm.custName" autocomplete="off" maxlength="60" disabled></el-input>
            </el-form-item>
          </div>
          <div class="info-form-row">
            <el-form-item label="客户等级：" prop="custLevel">
              <el-select v-model="editForm.custLevel" placeholder="请选择" disabled>
                <el-option v-for="(item,index) in custLevels" :key="index" :label="item.label" :value="item.value"></el-option>
				      </el-select>
            </el-form-item>
            <el-form-item label="AUM余额：" prop="aumAmt">
              <el-input v-model="editForm.aumAmt" autocomplete="off" maxlength="60" disabled></el-input>
            </el-form-item>
          </div>
          <div class="info-form-row">
            <el-form-item label="积分渠道：" prop="scoreChannel">
              <el-select v-model="editForm.scoreChannel" placeholder="请选择" disabled>
                <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
              <!-- <el-option v-for="(item, index) in channel" :key="index" :label="item" :value="index === 0 ? '': index" /> -->
				      </el-select>
            </el-form-item>
            <el-form-item label="可用积分：" prop="avaScore">
              <el-input
                :rows="4"
                maxlength="100"
                v-model="editForm.avaScore"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </div>
          <div class="info-form-row">
            <el-form-item label="上级机构：" prop="parentOrgName">
              <el-select v-model="editForm.parentOrgName" placeholder="请选择" disabled>
				      </el-select>
            </el-form-item>
            <el-form-item v-show="!!editForm.parentOrgNo" label="机构：" prop="orgName">
              <el-select v-model="editForm.orgName" placeholder="请选择" disabled>
				      </el-select>
            </el-form-item>
          </div>
          <div class="info-form-row">
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="editForm.mobile" autocomplete="off" maxlength="60" disabled></el-input>
            </el-form-item>
            <el-form-item label="人才卡：">
              <el-input v-model="editForm.cardName" autocomplete="off" maxlength="60" disabled v-if="!editForm.cardName"></el-input>
              <el-tooltip class="item" effect="dark" :content="editForm.cardName" placement="top-start" v-else>
                <el-input v-model="editForm.cardName" autocomplete="off" maxlength="60" disabled></el-input>
              </el-tooltip>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import { baseUrl } from '@/utils'
export default {
  props: {
    dialogInfoVisible: {
      type: Boolean
    },
    id: {
      type: String
    },
    type: {
      type: String
    }
  },
  watch: {
    dialogInfoVisible(value) {
      if (value) {
        this.waitLoading = true
        API.custgrey.getCustGrayInfo({ custNo: this.id }).then(res => {
          this.waitLoading = false
          this.editForm = res.data.data
        }).catch(() => {
          this.waitLoading = false
        })
      }
    }
  },
  data() {
    return {
      baseUrl: baseUrl(),
      editForm: {
        subName: '',
        subChannel: this.$store.state.user.channel,
        subBegtime: '',
        subEndtime: '',
        pictureName: '',
        pictureUrl: ''
      },
      waitLoading: false,
      channel: ['', '财富', '直销', '信用卡'],
      custLevels: [
        {
          value: '0',
          label: '零星'
        }, {
          value: '1',
          label: '一星'
        }, {
          value: '2',
          label: '二星'
        }, {
          value: '3',
          label: '三星'
        }, {
          value: '4',
          label: '四星'
        }, {
          value: '5',
          label: '五星'
        }, {
          value: '6',
          label: '六星'
        }
      ],
      imgShow: false
    }
  },
  methods: {
    previewImg() {
      this.imgShow = true
    },
    cancel() {
      this.$emit('cancel', {type: this.type})
      setTimeout(() => {
        this.pictureList = []
        this.message = ''
        if (this.$refs['editForm']) {
          this.$refs['editForm'].clearValidate()
        }
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  /deep/ .el-input,
  /deep/ .el-textarea {
    width: 260px;
  }
  /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  .info-form-row {
    display: flex;

    .el-form-item:first-child {
      margin-right: 60px;
    }
  }
}
</style>
