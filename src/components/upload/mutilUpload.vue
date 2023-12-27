<template>
  <div>
    <el-upload action="http://192.168.31.159:9091"
               class="upload-demo"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               :file-list="fileList"
               list-type="picture">
      <el-button size="small"
                 type="primary">点击上传</el-button>
      <div slot="tip"
           class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fileList: []
    };
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log(file);
    }
  }
};
</script>

<style>
</style>