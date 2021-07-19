<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" class="dictItemAddForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-input v-model="dataForm.type" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据值" prop="value">
            <el-input v-model="dataForm.value" placeholder="数据值"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标签名" prop="label">
            <el-input v-model="dataForm.label" placeholder="标签名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述" prop="description">
            <el-input v-model="dataForm.description" placeholder="描述"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="dataForm.sort"
              :min="0"
              controls-position="right"
              placeholder="排序"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注信息" prop="remarks">
            <el-input v-model="dataForm.remarks" placeholder="备注信息"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          dictId: undefined,
          type: undefined,
          value: undefined,
          description: undefined,
          sort: undefined,
          remarks: undefined
        },
        dataRule: {
          value: [
            { required: true, message: '数据值不能为空', trigger: 'blur' }
          ],
          label: [
            { required: true, message: '标签名不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (item) {
        this.visible = true
        this.dataForm = item
      },
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = {
              'id': this.dataForm.id || undefined,
              'dictId': this.dataForm.dictId,
              'type': this.dataForm.type,
              'value': this.dataForm.value,
              'description': this.dataForm.description,
              'sort': this.dataForm.sort,
              'remarks': this.dataForm.remarks,
              'label': this.dataForm.label
            }
            let tick = !this.dataForm.id ? API.dict.addItem(params) : API.dict.updateItem(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList', this.dataForm.dictId)
                  }
                })
              }
            }).catch((error) => {
              this.$message.error(error.msg)
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .dictItemAddForm {
    .el-form-item {
      .el-input-number {
        .el-input-number__decrease {
          line-height: 12px;
          bottom: 7px
        }

        .el-input-number__increase {
          top: 6px;
          position: absolute;
          line-height: 12px;
        }
      }
    }
  }
</style>
