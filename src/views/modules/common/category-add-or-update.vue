<template>
  <el-dialog :title="dialogTitle"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="30%">
    <el-form :model="this.category"
             ref="dataForm"
             @keyup.enter.native="submitData()">
      <el-form-item label="分类名称">
        <el-input placeholder="请输入分类名称"
                  v-model="category.name" />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-input v-model="this.category.parentName"
                  v-popover:dataListPopover
                  :readonly="true"
                  placeholder="点击选择上级分类"></el-input>
        <el-popover ref="dataListPopover"
                    placement="bottom-start"
                    trigger="click">
          <el-tree :data="dataList"
                   :props="dataListTreeProps"
                   node-key="catId"
                   ref="dataListTree"
                   @current-change="dataListTreeCurrentChangeHandle"
                   :default-expand-all="false"
                   :highlight-current="true"
                   :expand-on-click-node="false">
          </el-tree>
        </el-popover>
      </el-form-item>
      <el-form-item label="图标">
        <el-input type=""
                  placeholder="请输入图标"
                  v-model="category.icon" />
      </el-form-item>
      <el-form-item label="计量单位">
        <el-input placeholder="请输入计量单位"
                  v-model="category.productUnit" />
      </el-form-item>
    </el-form>

    <span slot="footer"
          class="dialog-footer">
      <el-button @click="() => {this.dialogVisible = false;  this.category = JSON.parse(JSON.stringify(this.defaultCategory))}">取 消</el-button>
      <el-button type="primary"
                 @click="submitData()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/product/category';
export default {
  data () {
    return {
      dialogTitle: '',
      dialogVisible: false,
      category: { parentName: '' },
      defaultCategory: {
        name: '',
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        icon: '',
        productUnit: '',
        sort: 0
      },
      dataList: [],
      dataListTreeProps: {
        label: 'name',
        children: 'children'
      }
    };
  },
  methods: {
    init (catId) {
      api.getCategoryTree({}).then((data) => {
        this.dataList = data.data.listWithTree || [];
      });
      if (catId) {
        // update
        this.dialogVisible = true;
        this.dialogTitle = '修改';
        api.getCategoryById(catId).then((data) => {
          if (data && data.data.code === 0) {
            this.category = JSON.parse(JSON.stringify(data.data.category));

            // this.$refs.dataListTree.setCurrentKey(this.category.parentCid);
            let { data: ndata } = this.$refs.dataListTree.getNode(this.category.parentCid) || { data: { name: '一级目录' } };
            this.category.parentName = ndata.name;
          } else {
            this.$message({
              message: '数据有更新, 已重新加载',
              type: 'warning',
              duration: 1500,
              onClose: () => {
                this.dialogVisible = false;
                this.$emit('refreshDataList');
              }
            });
          }
        });
      } else {
        // add
        this.dialogVisible = true;
        this.dialogTitle = '新增';
      }
    },
    dataListTreeCurrentChangeHandle (data, node) {
      this.category.parentName = data.name;
      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel + 1;
    },
    submitData () {
      if (this.dialogTitle === '新增') {
        this.addCategory();
      }
      if (this.dialogTitle === '修改') {
        this.editCategory();
      }
    },
    editCategory () {
      api.updateCategoryById(this.category).then((data) => {
        if (data && data.data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.dialogVisible = false;
              this.$emit('refreshDataList', [this.category.parentCid || []]);
            }
          });
        } else {
          this.$message({
            message: '操作失败',
            type: 'error'
          });
        }
      });
    },
    addCategory () {
      api.saveCategory(this.category)
        // this.$http({
        //   url: this.$http.adornUrl('/mall-product/category/save'),
        //   method: 'post',
        //   data: this.$http.adornData(this.category)
        // })
        .then((data) => {
          if (data && data.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogVisible = false;
                this.$emit('refreshDataList', [this.category.parentCid]);
              }
            });
          } else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }
        });
    }
  }
};
</script>

<style>
</style>