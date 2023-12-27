<template>
  <div>
    <el-upload class="upload-demo"
               ref="dupload"
               :action="url"
               :drag="true"
               :limit="1"
               :on-preview="handlePreview"
               :on-remove="handleRemove"
               :before-remove="beforeRemove"
               :on-exceed="handleExceed"
               :on-success="handleSuccess"
               :file-list="fileList"
               list-type="picture">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip"
           class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    url: String
  },
  data () {
    return {
      fileList: []
    };
  },
  methods: {
    handleSuccess (response, file, fileList) {
      console.log('handleSuccess', response);
      if (response.status === 200) {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$emit('succeed', response.fileAddress);
          }
        });
      } else {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.$emit('succeed', response.fileAddress);
          }
        });
      }
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log('handlePreview', file);
    },
    handleExceed (files, fileList) {
      this.fileList.pop();
      this.fileList.push(files[0]);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>

<style>
</style>