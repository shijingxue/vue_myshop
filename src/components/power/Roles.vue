<template>
  <div>
    <!-- 面包屑 -->
    <Mbx nav1="权限管理" nav2="角色列表"></Mbx>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 添加展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bbuttom','vcenter',i1===0?'btop':'']"
              v-for="(item,i1) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级 三级-->
              <el-col :span="19">
                <!-- 二级 -->
                <el-row
                  :class="[i2 === 0? '':'btop']"
                  v-for="(item2,i2) in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeTag(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  分配权限对话框 -->
    <el-dialog title="修改权限" :visible.sync="setDialogVisible" width="50%" center @close="clearAll">
      <!-- 树状图 -->
      <el-tree
        :data="treeList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  角色列表
      rolesList: [],
      //   修改角色对话框显示与隐藏
      setDialogVisible: false,
      //    权限树数据
      treeList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // 通过label设置树形节点文本展示authName
        label: 'authName',
        // 设置通过children属性展示子节点信息
        children: 'children'
      },
      // 设置树形控件中默认选中的内容
      defKeys: [],
      // 保存正在操作的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    //  删除角色指定权限
    async removeTag(row, rightId) {
      const isConfirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (isConfirm !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${row.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      // 只需要对现有的角色权限进行更新即可
      row.children = res.data
      //   this.getRolesList()
    },
    //  分配权限事件
    async showSetRightDialog(role) {
      //  把role.id保存起来供保存权限使用
      this.roleId = role.id
      //   获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message('获取权限列表失败')
      }
      this.treeList = res.data
      // 调用getLeafKeys进行递归，将三级权限添加到数组中
      this.getthird(role, this.defKeys)
      this.setDialogVisible = true
    },
    //  获取所有三级权限 并添加到defKeys中
    getthird(node, arr) {
      // 该函数会获取到当前角色的所有三级权限id并添加到defKeys中
      // 如果当前节点不包含children属性，则表示node为三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归调用
      node.children.forEach(item => this.getthird(item, arr))
    },
    //  对话框关闭的时候清除树形图选中内容
    clearAll() {
      this.defKeys = []
    }
  }
}
</script>

<style lang="less" scoped>
.bbuttom {
  border-bottom: 1px solid #ccc;
}
.btop {
  border-top: 1px solid #ccc;
}
.el-col {
  padding: 5px;
}
.el-tag {
  margin-right: 5px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
