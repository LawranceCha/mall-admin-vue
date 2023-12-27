<template>
  <div>
    <el-upload class="upload-demo"
               ref="dupload"
               action=""
               :drag="true"
               :limit="1"
               :http-request="uploadFunc"
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

  data () {
    return {
      fileList: []
    };
  },
  methods: {
    uploadFunc (data) {
      let file = data.file;
      let fileName = new Date().getTime() + '-' + file.name;
      this.minioPreSignedUrl(fileName).then((data) => {
        if (data.data || data.data.code === 0) {
          let address = data.data.address;
          this.$http({
            url: data.data.url,
            headers: { 'Content-Type': 'application/octet-stream' },
            method: 'put',
            data: file
          }).then(data => {
            if (data.status === 200) {
              this.handleSuccess(data, file, this.fileList, address);
            }
          });
        }
      });
    },
    handleSuccess (response, file, fileList, address) {
      console.log('handleSuccess', response);
      this.$emit('succeed', address);
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handlePreview (file) {
      console.log('handlePreview', file);
    },
    handleExceed (files, fileList) {
      console.log('handleExceed', files);
      console.log('handleExceed2', fileList);
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