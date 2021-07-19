<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="bean名称" prop="beanName">
        <el-input v-model="dataForm.beanName" placeholder="spring bean名称, 如: testTask"></el-input>
      </el-form-item>
      <el-form-item label="方法名称" prop="methodName">
        <el-input v-model="dataForm.methodName" placeholder="方法名称"></el-input>
      </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input v-model="dataForm.params" placeholder="参数"></el-input>
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" placeholder="如: 0 0 12 * * ?"></el-input>
      </el-form-item>
      <el-form-item label="任务类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,index) in $root.selectOption.jobType" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
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
          beanName: '',
          methodName: '',
          params: '',
          cronExpression: '',
          remark: '',
          status: 0,
          type: ''
        },
        dataRule: {
          beanName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          methodName: [
            { required: true, message: '方法名称不能为空', trigger: 'blur' }
          ],
          cronExpression: [
            { required: true, message: 'cron表达式不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '任务类型不能为空', trigger: 'change' }
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
            API.schedule.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.beanName = data.data.beanName
                this.dataForm.methodName = data.data.methodName
                this.dataForm.params = data.data.params
                this.dataForm.cronExpression = data.data.cronExpression
                this.dataForm.remark = data.data.remark
                this.dataForm.status = data.data.status
                this.dataForm.type = data.data.type
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'jobId': this.dataForm.id || undefined,
              'beanName': this.dataForm.beanName,
              'methodName': this.dataForm.methodName,
              'params': this.dataForm.params,
              'cronExpression': this.dataForm.cronExpression,
              'remark': this.dataForm.remark,
              'status': !this.dataForm.id ? undefined : this.dataForm.status,
              'type': this.dataForm.type
            }
            var tick = !this.dataForm.id ? API.schedule.add(params) : API.schedule.update(params)
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
