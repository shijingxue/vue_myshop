<template>
  <div>
    <!--  布局 -->
    <el-container >
      <el-header class="header">
          <el-button type="info" @click="layout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside">Aside</el-aside>
        <el-main class="main">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  created () {},
  methods: {
    //    退出功能
    layout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
    width: 100%;
    height: 100% !important;
}
.header {
    background-color: #373D41;
    height: 60px;
    width: 100%;
}
.aside {
    background-color: #333744;
    height: 100%;
}
.main {
    background-color: #EAEDF1;
}
</style>
