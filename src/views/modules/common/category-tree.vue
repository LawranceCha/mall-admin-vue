<template>
  <el-tree :data="data"
           :props="defaultProps"
           :expand-on-click-node="false"
           :lazy="true"
           :load="lazyLoadTree"
           @node-click="handleNodeClick"
           node-key="catId">
  </el-tree>
</template>

<script>
import * as api from '@/api/product/category';
export default {
  data () {
    return {
      data: [],
      dialogVisible: false,
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
        label: 'name',
        isLeaf: this.hasChildren,
      }
    };
  },
  methods: {
    getMenus () {
      api.getCategoryFirst({}).then((data) => {
        this.data = data.data.listFirstNodes || [];
      });
    },
    handleNodeClick (data, node, component) {
      this.$emit("tree-node-click", data, node, component);
    },
    hasChildren (data, node) {
      return !data.hasChildren;
    },
    lazyLoadTree (node, resolve) {
      api.getCategoryChild(node.data.catId || 0).then((data) => {
        resolve(data.data.listChildNodes || []);
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

  }
};
</script>

<style>
</style>