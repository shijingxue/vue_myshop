<template>
  <div class="login_container">
    <!-- 登陆盒子 -->
    <div class="login_box">
      <!-- 用户头像 -->
      <div class="avatar_box">
        <img src="../assets/18.jpg" alt />
      </div>
      <!-- 表单 -->
      <el-form :model="loginlist" :rules="loginFormRules" ref="loginFormRef" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginlist.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginlist.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="loginBtn">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //  用户名和密码
      loginlist: {
        username: '',
        password: ''
      },
      //   规则
      loginFormRules: {
        username: [{ required: true, message: '请输入账户名', trigger: 'blur' }, { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
      }
    }
  },
  created () {},
  methods: {
    //   登录
    loginBtn () {
      // 在登陆前 先验证表单内容填写是否有误
      this.$refs.loginFormRef.validate(async valid => {
        //  如果验证参数为true就通过
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.loginlist)
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        //  保存token
        window.sessionStorage.setItem('token', res.data.token)
        //  导航值home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 8px;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #ddd;
  padding: 8px;
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  float: right;
}
</style>
