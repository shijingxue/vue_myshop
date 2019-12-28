<template>
  <!--  布局 -->
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="layout">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!--  伸缩侧边栏按钮 -->
        <div class="toggle-button" @click="toggleBtn">| | |</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="navActive"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in asideList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item
              :index="'/' + item1.path"
              v-for="item1 in item.children"
              :key="item1.id"
              @click="toPath('/'+item1.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item1.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //  侧边栏数据
      asideList: null,
      //   侧边栏图标
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      // 被激活的链接地址
      navActive: ''
    }
  },
  created() {
    this.getAsideList()
    //  获取链接的激活状态
    this.navActive = window.sessionStorage.getItem('navActive')
  },
  methods: {
    //    退出功能
    layout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //  请求侧边栏数据
    async getAsideList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.asideList = res.data
    },
    //  切换侧边栏状态按钮
    toggleBtn() {
      this.isCollapse = !this.isCollapse
    },
    //  跳转页面  保存链接的激活状态
    toPath(navActive) {
      window.sessionStorage.setItem('navActive', navActive)
      this.navActive = navActive
      console.log(navActive)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 22px;
  padding: 0;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  box-sizing: border-box;
  // height: 100%;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 15px;
}
.toggle-button {
  text-align: center;
  background-color: #4a5064;
  padding: 8px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
}
</style>
