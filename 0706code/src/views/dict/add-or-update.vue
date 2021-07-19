<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="type">
            <el-input v-model="dataForm.type" placeholder="类型"></el-input>
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
          <el-form-item label="字典类型" size="mini" prop="systemFlag" style="margin-top: 6px;">
            <el-radio-group v-model="dataForm.systemFlag">
              <el-radio :label="'0'">业务类</el-radio>
              <el-radio :label="'1'">系统类</el-radio>
            </el-radio-group>
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
          type: '',
          description: '',
          remarks: '',
          systemFlag: '',
          delFlag: '',
          createDate: ''
        },
        dataRule: {
          type: [
            { required: true, message: '类型不能为空', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          systemFlag: [
            { required: true, message: '字典类型不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            API.dict.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.type = data.data.type
                this.dataForm.description = data.data.description
                this.dataForm.remarks = data.data.remarks
                this.dataForm.systemFlag = data.data.systemFlag
                this.dataForm.delFlag = data.data.delFlag
                this.dataForm.createDate = data.data.createDate
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = {
              'id': this.dataForm.id || undefined,
              'type': this.dataForm.type,
              'description': this.dataForm.description,
              'remarks': this.dataForm.remarks,
              'systemFlag': this.dataForm.systemFlag,
              'delFlag': this.dataForm.delFlag,
              'createDate': this.dataForm.createDate
            }
            let tick = !this.dataForm.id ? API.dict.add(params) : API.dict.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
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
