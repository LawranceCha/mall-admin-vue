<template>
  <div class="mod-category">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary"
                   @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :border="true"
              :data="data"
              :lazy="true"
              :load="lazyLoadTree"
              row-key="catId"
              :stripe="true"
              :fit="true"
              :expand-row-keys="expendKey"
              :tree-props="{children: 'children', hasChildren: 'children'}"
              style="width: 100%;">
      <el-table-column prop="name"
                       header-align="center"
                       sortable
                       label="名称">
      </el-table-column>
      <el-table-column prop="productUnit"
                       header-align="center"
                       sortable
                       label="计量单位">
      </el-table-column>
      <el-table-column prop="icon"
                       header-align="center"
                       sortable
                       label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       header-align="center"
                       width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row.catId)">修改</el-button>
          <el-button type="text"
                     size="small"
                     @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-tree :data="data"
             :props="defaultProps"
             :expand-on-click-node="false"
             @node-click="handleNodeClick"
             :show-checkbox="true"
             node-key="catId"
             :default-expanded-keys="expendKey"
             draggable
             :allow-drop="allowDrop"
             :allow-drag="allowDrag"
             @node-drop="handleDrop">
      <span class="custom-tree-node"
            slot-scope="{node, data}">
        <span>{{node.label}}</span>
        <span>
          <el-button v-if="node.level <= 2"
                     type="text"
                     size="mini"
                     @click="() => append(node, data)">Append</el-button>
          <el-button v-if="node.level"
                     type="text"
                     size="mini"
                     @click="() => edit(node, data)">Edit</el-button>
          <el-button v-if="data.children.length === 0 "
                     type="text"
                     size="mini"
                     @click="() => remove(node, data)">Delete</el-button>
        </span>
      </span>
    </el-tree> -->
    <category-add-or-update v-if="dialogVisible"
                            ref="categoryAddOrUpdate"
                            @refreshDataList="getMenus"></category-add-or-update>

  </div>
</template>

<script>
import * as api from '@/api/product/category';
import CategoryAddOrUpdate from '@/views/modules/common/category-add-or-update';
export default {
  components: { CategoryAddOrUpdate },
  data () {
    return {
      data: [],
      dialogVisible: false,
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
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  created () {
    this.getMenus();
  },
  methods: {
    getMenus (expandKeys) {
      api.getCategoryFirst({}).then((data) => {
        this.data = data.data.listFirstNodes || [];
      });
      this.expendKey = expandKeys || [];
    },
    lazyLoadTree (row, treeNode, resolve) {
      api.getCategoryChild(row.catId).then((data) => {
        resolve(data.data.listChildNodes || []);
      });
    },
    addOrUpdateHandle (catId) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.categoryAddOrUpdate.init(catId);
      });
    },
    // allowDrop (draggingNode, dropNode, type) {
    //   this.countChildrenLevel(draggingNode.data);
    //   let deep = this.maxLevel - draggingNode.data.catLevel + 1;
    //   if (type === 'inner') {
    //     return (deep + dropNode.level) <= 3;
    //   } else {
    //     return (deep + dropNode.parent.level) <= 3;
    //   }
    // },
    // countChildrenLevel (data) {
    //   if (data.children != null && data.children.length > 0) {
    //     for (let i = 0; i < data.children.length; i++) {
    //       if (data.children[i].catLevel > this.maxLevel) {
    //         this.maxLevel = data.children[i].catLevel;
    //       }
    //       this.countChildrenLevel(data.children[i]);
    //     }
    //   }
    // },
    // allowDrag (draggingNode) {
    //   return draggingNode.parent.childNodes.length > 1;
    // },
    // handleDrop (draggingNode, dropNode, dropType, event) {
    //   console.log('tree drop:', draggingNode, dropNode, dropType);
    // },

    append (node, data) {
      this.dialogVisible = true;
      this.dialogTitle = '新增';
      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel + 1;
    },
    edit (node, data) {
      this.dialogVisible = true;
      this.dialogTitle = '修改';
      api.getCategoryById(data.catId).then((data) => {
        if (data && data.data.code === 0) {
          this.category = JSON.parse(JSON.stringify(data.data.category));
        } else {
          this.$message({
            message: '数据有更新, 已重新加载',
            type: 'warning'
          });
          this.getMenus();
          this.dialogVisible = false;
        }
      });
    },

    deleteHandle (data) {
      let ids = [data.catId];
      this.$confirm(`是否删除[ ${data.name} ]菜单`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'wraning'
      }).then(() => {
        // this.$http({
        //   url: this.$http.adornUrl('/mall-product/category/delete'),
        //   method: 'post',
        //   data: this.$http.adornData(ids, false)
        // })
        api.deleteCategory(ids).then((data) => {
          if (data && data.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }
          this.getMenus();
          this.expendKey = [data.parentCid];
        });
      }).catch(() => {
        this.category = JSON.parse(JSON.stringify(this.defaultCategory));
      });
    }
  }
};
</script>
