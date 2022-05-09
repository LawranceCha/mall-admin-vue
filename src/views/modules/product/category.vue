<template>
  <div>
    <el-tree :data="data" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick"
             :show-checkbox="true" node-key="catId"
             :default-expanded-keys="expendKey"
             draggable
             :allow-drop="allowDrop"
             :allow-drag="allowDrag"
             @node-drop="handleDrop"
    >
    <span class="custom-tree-node" slot-scope="{node, data}">
      <span>{{node.label}}</span>
      <span>
        <el-button v-if="node.level <= 2" type="text" size="mini" @click="() => append(node, data)">Append</el-button>
        <el-button v-if="node.level" type="text" size="mini" @click="() => edit(node, data)">Edit</el-button>
        <el-button v-if="data.children.length === 0 " type="text" size="mini"
                   @click="() => remove(node, data)">Delete</el-button>
      </span>
    </span>
    </el-tree>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal=false
      width="30%">
      分类名称
      <el-input placeholder="请输入分类名称" v-model="category.name" />
      图标
      <el-input type="" placeholder="请输入图标" v-model="category.icon" />
      计量单位
      <el-input placeholder="请输入计量单位" v-model="category.productUnit" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="() => {this.dialogVisible = false;  this.category = JSON.parse(JSON.stringify(this.defaultCategory))}">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        data: [],
        dialogTitle: '',
        expendKey: [],
        maxLevel: 0,
        defaultCategory: {
          name: '',
          parentCid: 0,
          catLevel: 0,
          showStatus: 1,
          icon: '',
          productUnit: '',
          sort: 0
        },
        category: {
          name: '',
          parentCid: 0,
          catLevel: 0,
          showStatus: 1,
          icon: '',
          productUnit: '',
          sort: 0
        },
        dialogVisible: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created () {
      this.getMenus()
    },
    methods: {
      getMenus () {
        this.$http({
          url: this.$http.adornUrl('/mallproduct/category/listWithTree'),
          method: 'get'
        }).then((data) => {
          this.data = data.data.listWithTree || []
        })
      },
      allowDrop (draggingNode, dropNode, type) {
        this.countChildrenLevel(draggingNode.data)
        let deep = this.maxLevel - draggingNode.data.catLevel + 1
        if (type === 'inner') {
          return (deep + dropNode.level) <= 3
        } else {
          return (deep + dropNode.parent.level) <= 3
        }
      },
      countChildrenLevel (data) {
        if (data.children != null && data.children.length > 0) {
          for (let i = 0; i < data.children.length; i++) {
            if (data.children[i].catLevel > this.maxLevel) {
              this.maxLevel = data.children[i].catLevel
            }
            this.countChildrenLevel(data.children[i])
          }
        }
      },
      allowDrag (draggingNode) {
        return draggingNode.parent.childNodes.length > 1
      },
      handleDrop (draggingNode, dropNode, dropType, event) {
        console.log('tree drop:', draggingNode, dropNode, dropType)
      },
      submitData () {
        if (this.dialogTitle === '新增') {
          this.addCategory()
        }
        if (this.dialogTitle === '修改') {
          this.editCategory()
        }
      },
      append (node, data) {
        this.dialogVisible = true
        this.dialogTitle = '新增'
        this.category.parentCid = data.catId
        this.category.catLevel = data.catLevel + 1
      },
      edit (node, data) {
        this.dialogVisible = true
        this.dialogTitle = '修改'
        this.$http({
          url: this.$http.adornUrl(`/mallproduct/category/info/${data.catId}`),
          method: 'get'
        }).then((data) => {
          if (data && data.data.code === 0) {
            this.category = JSON.parse(JSON.stringify(data.data.category))
          } else {
            this.$message({
              message: '数据有更新, 已重新加载',
              type: 'warning'
            })
            this.getMenus()
            this.dialogVisible = false
          }
        })
      },
      editCategory () {
        this.$http({
          url: this.$http.adornUrl('/mallproduct/category/update'),
          method: 'post',
          data: this.$http.adornData(this.category)
        }).then((data) => {
          if (data && data.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.dialogVisible = false
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
          this.getMenus()
          this.expendKey = [this.category.parentCid]
          this.category = JSON.parse(JSON.stringify(this.defaultCategory))
        })
      },
      addCategory () {
        this.$http({
          url: this.$http.adornUrl('/mallproduct/category/save'),
          method: 'post',
          data: this.$http.adornData(this.category)
        }).then((data) => {
          if (data && data.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.dialogVisible = false
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
          this.getMenus()
          this.expendKey = [this.category.parentCid]
          this.category = JSON.parse(JSON.stringify(this.defaultCategory))
        })
      },
      remove (node, data) {
        let ids = [data.catId]
        this.$confirm(`是否删除[${data.name}]菜单`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'wraning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/mallproduct/category/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then((data) => {
            if (data && data.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
            }
            this.getMenus()
            this.expendKey = [node.parent.data.catId]
          })
        }).catch(() => {
          this.category = JSON.parse(JSON.stringify(this.defaultCategory))
        })
      },
      handleNodeClick (data) {
      }
    }
  }
</script>
