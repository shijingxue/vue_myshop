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
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editUsers(scope.row)"></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUsers(scope.row)"
            ></el-button>
            <!-- 分配角色 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="setRole(scope.row)"
            ></el-button>
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
    <!-- 编辑用户对话框 -->
    <el-dialog title="提示" :visible.sync="editUsersVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        @close="editFormClose"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUsersVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleVisible" width="30%" @close="resetDialog">
      <div>
        <p>当前用户：{{usersInfo.username}}</p>
        <p>当前角色：{{usersInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择角色">
            <!-- 角色选择下拉框 v-model：设置用户选中角色之后的id绑定数据-->
            <!-- :label 显示文本，:value 选中值 -->
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="item in rolesList"
              :key="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserBtn">确 定</el-button>
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
      },
      //  编辑用户对话框显示与隐藏
      editUsersVisible: false,
      //  编辑用户
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      //  编辑用户规则
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机', trigger: 'blur' }, { validator: checkMobile, message: '手机号码不正确，请重新输入', trigger: 'blur' }]
      },
      //  分配角色对话框
      setRoleVisible: false,
      //  保存正在操作的用户信息
      usersInfo: {},
      //  保存所有角色信息
      rolesList: [],
      //  保存用户选中的角色id
      selectRoleId: ''
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
    },
    //  编辑用户按钮
    async editUsers(row) {
      //  发送请求 获取当前用户数据
      const { data: res } = await this.$http.get(`users/${row.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data
      this.editUsersVisible = true
    },
    //  关闭编辑对话框时重置表单
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    //  点击确定 修改用户信息
    editBtn() {
      //  在发送请求前 进行表单预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写完整信息')
        }
        // 发送请求
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        this.getusersList()
        this.editUsersVisible = false
      })
    },
    //  删除按钮点击  把错误提醒捕捉 不然会报错
    async deleteUsers(row) {
      //  弹出提示框
      const isConfirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (isConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      //  调用接口删除用户
      const { data: res } = await this.$http.delete(`users/${row.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      //  如果删除的当前页只剩一条数据  在删除后就跳转到前一页
      if (this.queryInfo.pagenum !== 1) {
        if (this.usersList.length === 1) {
          this.queryInfo.pagenum -= 1
        }
      }
      this.getusersList()
    },
    //  获取分配角色列表
    async setRole(usersInfo) {
      this.usersInfo = usersInfo
      const { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
      this.setRoleVisible = true
    },
    //  点击按钮  发送请求分配角色
    async setUserBtn() {
      // 当用户点击确定按钮之后
      // 判断用户是否选择了需要分配的角色
      if (!this.selectRoleId) {
        return this.$message.error('请选择需要分配的角色')
      }
      const { data: res } = await this.$http.put(`users/${this.usersInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.getusersList()
      this.setRoleVisible = false
    },
    //  关闭对话框 重置下拉框数据
    resetDialog() {
      this.selectRoleId = ''
      this.usersInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
