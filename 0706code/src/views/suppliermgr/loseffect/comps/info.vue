<template>
  <div class="prodmsg-select">
    <el-dialog
      title="选择短信模板"
      :visible.sync="dialogProdmsgVisible"
      width="900px"
      :before-close="cancel"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <div style="width: 100%">
        <div class="search" style="text-align: center">
          <el-form
            :inline="true"
            :model="searchParams"
            class="demo-form-inline"
          >
            <el-form-item label="短信模板名称">
              <el-input
                v-model="searchParams.smsTemplateName"
                placeholder="请输入短信模板名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="权益渠道">
              <el-select v-model="searchParams.equityChannel" disabled>
                <el-option label="请选择" value=""></el-option>
                <el-option label="财富" value="1"></el-option>
                <el-option label="直销" value="2"></el-option>
                <el-option label="信用卡" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div style="margin-top: 31px;
      margin-bottom: 24px;
      text-align: center;">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search"
              :loading="searchLoading"
              >查询</el-button
            >
            <el-button
              icon="el-icon-refresh-right"
              :loading="resetLoading"
              @click="reset"
              >重置</el-button
            >
          </div>
        </div>
        <div class="result table">
          <el-table
            :data="datas"
            border
            style="width: 100%"
            :header-cell-style="{
              background: '#E8E8E8',
              'font-weight': '400',
              color: '#262626'
            }"
            v-loading="tableLoading"
          >
            <el-table-column label="选择" header-align="center" align="center" fixed="left">
              <template slot-scope="scope">
                <el-radio
                  :label="scope.row.id"
                  v-model="radio"
                  @change="getCurrent(scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="短信模板名称"
              width="120"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="getInfo(scope.row)"
                  class="table-botton"
                  >{{ scope.row.smsTemplateName }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="equityChannel"
              label="权益渠道"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ equityChannel[scope.row.equityChannel] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="创建时间"
              width="160"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="createEmpNo"
              label="创建人工号"
              width="120"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="createEmpName"
              label="创建人"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="modifyTime"
              label="修改时间"
              width="160"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="modifyEmpNo"
              label="创建人工号"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="modifyEmpName"
              label="修改人"
              header-align="center"
              align="center"
            >
            </el-table-column>
          </el-table>
          <v-pagination
            :total="page.total"
            :currentPageNum="page.current"
            :currentPageSize="page.size"
            @pageChange="pageChange"
          ></v-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="addPromsg" :loading="addLoading"
            >添加</el-button
          >
          <el-button @click="cancel">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <msg-info
      :dialogInfoVisible="dialogInfoVisible"
      :id="currentMsg.id"
      @cancel="closeDialog"
    ></msg-info>
  </div>
</template>
<script>
import vPagination from '@/components/pagination/pagination'
import msgInfo from '../../prod-msg/comps/msg-info'
import API from '@/api'
export default {
  components: {
    vPagination, msgInfo
  },
  props: {
    dialogProdmsgVisible: {
      type: Boolean
    }
  },
  watch: {
    dialogProdmsgVisible(value) {
      if (value) {
        // 初始化数据
        this.radio = ''
        this.getDatas()
      }
    }
  },
  data() {
    return {
      searchParams: {
        smsTemplateName: '',
        equityChannel: this.$store.state.user.channel
      },
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      radio: '',
      addLoading: false,
      equityChannel: ['', '财富', '直销', '信用卡'],
      seletedInfo: {},
      currentMsg: {},
      dialogInfoVisible: false,
      tableLoading: false
    }
  },

  methods: {
    // 分页
    pageChange(val) {
      this.radio = ''
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },
    getCurrent(row) {
      this.seletedInfo = row
    },
    getInfo(row) {
      this.currentMsg = row
      this.dialogInfoVisible = true
    },
    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(current = this.page.current) {
      this.page.current = current
      let params = Object.assign(this.page, this.searchParams)
      this.tableLoading = true
      API.prodmsg
        .queryMsgTemplate(
          Object.assign(params, {
            smsTemplateName: params.smsTemplateName.trim()
          })
        )
        .then(res => {
          this.searchLoading = false
          this.resetLoading = false
          this.datas = res.data.data.records
          this.page.total = res.data.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
          this.tableLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        smsTemplateName: '',
        equityChannel: this.$store.state.user.channel
      }
      this.resetLoading = true
      this.radio = ''
      this.getDatas(1)
    },
    // 必须选择一条数据进行操作
    getCurrentRow() {
      if (this.radio === '') {
        this.$message.info('请选择一条数据进行操作')
        return true
      } else {
        return false
      }
    },
    // 添加模板信息
    addPromsg() {
      if (this.getCurrentRow()) {
        return
      }
      this.cancel('add')
    },
    // 关闭详情弹框
    closeDialog() {
      this.dialogInfoVisible = false
    },
    cancel(operate) {
      this.$emit('cancel', { info: operate === 'add' ? this.seletedInfo : {} })
    }
  },

  created() {
  }
}
</script>

<style lang="scss" scoped>
