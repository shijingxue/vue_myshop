<template>
  <div>
    <!-- 面包屑导航 -->
    <Mbx nav1="用户管理" nav2="用户管理"></Mbx>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getusersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getusersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addUsers">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="usersList" style="width: 100%" border stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
              active-color="#13ce66"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--  添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeDialog">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="100px">
        <el-form-item label="用户" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsersBtn()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return cb()
      }
      // 返回一个错误提示
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      //   用户列表数据
      usersList: [],
      // 分页
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //  添加用户对话框显示与隐藏
      addDialogVisible: false,
      //  添加用户信息
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //  添加用户规则
      addUserRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 2, max: 10, message: '长度在2 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在6 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机', trigger: 'blur' }, { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getusersList()
  },
  methods: {
    //  获取用户信息
    async getusersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // console.log(res)

      if (res.meta.status !== 200) {
        return this.$message('获取用户列表失败')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    //  监听页面size
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getusersList()
    },
    //  监听页面变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getusersList()
    },
    //  用户状态改变触发
    async userStateChanged(row) {
      const { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('获取用户状态失败')
      }
      this.$message.success('更新状态成功')
    },
    //  添加用户按钮
    async addUsers() {
      this.addDialogVisible = true
    },
    //  关闭对话框时重置表单
    closeDialog() {
      this.$refs.addUserRef.resetFields()
    },
    //  添加用户表单确定
    addUsersBtn() {
      //  表单预验证
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写完整信息')
        }
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.getusersList()
        this.addDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
