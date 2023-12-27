<template>
  <el-dialog :title="!dataForm.brandId ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="140px">
      <el-form-item label="品牌名"
                    prop="name">
        <el-input v-model="dataForm.name"
                  placeholder="品牌名"></el-input>
      </el-form-item>
      <el-form-item label="品牌logo地址"
                    prop="logo">
        <single-upload ref="dupload"
                       :url='uploadUrl'
                       @succeed="(url) => {dataForm.logo = url}"></single-upload>
      </el-form-item>
      <el-form-item label="介绍"
                    prop="descript">
        <el-input v-model="dataForm.descript"
                  placeholder="介绍"></el-input>
      </el-form-item>
      <el-form-item label="显示"
                    prop="showStatus">
        <el-switch v-model="dataForm.showStatus"
                   :active-value="1"
                   :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="检索首字母"
                    prop="firstLetter">
        <el-input v-model="dataForm.firstLetter"
                  placeholder="检索首字母"></el-input>
      </el-form-item>
      <el-form-item label="排序"
                    prop="sort">
        <el-input v-model="dataForm.sort"
                  placeholder="排序"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DirectUpload from '@/components/upload/directUpload.vue';
import SingleUpload from '@/components/upload/singleUpload.vue';
import * as api from '@/api/product/brand';
export default {
  components: { SingleUpload, DirectUpload },
  destroyed () {
    this.$refs.dupload.$refs.dupload.clearFiles();
  },
  data () {
    return {
      uploadUrl: api.uploadUrl,
      visible: false,
      dataForm: {
        brandId: '',
        name: '',
        logo: '',
        descript: '',
        showStatus: '',
        firstLetter: '',
        sort: ''
      },
      dataRule: {
        name: [
          { required: true, message: '品牌名不能为空', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '品牌logo地址不能为空', trigger: 'blur' }
        ],
        descript: [
          { required: true, message: '介绍不能为空', trigger: 'blur' }
        ],
        showStatus: [
          { required: true, message: '显示状态[0-不显示；1-显示]不能为空', trigger: 'blur' }
        ],
        firstLetter: [
          { required: true, message: '检索首字母不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    visible (val) {
      if (!val) {
        this.$refs.dupload.$refs.dupload.clearFiles();
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.brandId = id;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.brandId) {
          // this.$http({
          // url: this.$http.adornUrl(`/mall-product/brand/info/${this.dataForm.brandId}`),
          //   url: api.getBrandInfo,
          //   method: 'get',
          //   params: this.$http.adornParams()
          // })
          api.getBrandInfo(this.dataForm.brandId).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.brand.name;
              this.dataForm.logo = data.brand.logo;
              this.dataForm.descript = data.brand.descript;
              this.dataForm.showStatus = data.brand.showStatus;
              this.dataForm.firstLetter = data.brand.firstLetter;
              this.dataForm.sort = data.brand.sort;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/mall-product/brand/${!this.dataForm.brandId ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'brandId': this.dataForm.brandId,
              'name': this.dataForm.name,
              'logo': this.dataForm.logo,
              'descript': this.dataForm.descript,
              'showStatus': this.dataForm.showStatus,
              'firstLetter': this.dataForm.firstLetter,
              'sort': this.dataForm.sort
            })
          }).then((res) => {
            if (res.data && res.status === 200) {
              this.visible = false;
              this.$refs.dupload.$refs.dupload.clearFiles();
              this.$emit('refreshDataList');
            }
          });
        }
      });
    }
  }
};
</script>
