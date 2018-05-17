<template>
  <div class="header-table">
    <!--列表-->
    <el-table :data="listData" highlight-current-row stripe v-loading="loading" element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column prop="skuCode" label="商品编号" width="120">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="320">
      </el-table-column>
      <el-table-column prop="price" label="商品单价" width="100">
        <template slot-scope="scope">{{scope.row.price+'元'}}</template>
      </el-table-column>
      <el-table-column prop="transfer" label="服务费 %" width="80">
        <template slot-scope="scope">{{scope.row.transfer * 100}}</template>
      </el-table-column>
      <el-table-column prop="count" label="库存" width="80">
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" width="100">
      </el-table-column>
      <el-table-column prop="STATUS" label="状态" width="140">
        <template slot-scope="scope"><span v-if="scope.row.STATUS==='0'">已上架</span>
          <span v-if="scope.row.STATUS==='1'">已下架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
            <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" :current-page="pageNum" @current-change="handleCurrentChange" @size-change="handleSizeChange" style="text-align:center;margin-top:10px;">
            </el-pagination>
        </el-col>
    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <div class="goods">
        <span>商品名称</span>
        <span>{{editForm.skuName}}</span>
      </div>
      <div class="goods">
        <span>商品编号</span>
        <span>{{editForm.skuCode}}</span>
      </div>
      <div class="goods">
        <span>商品单价</span>
        <input type="text" class="goodsinput" v-model.trim="editForm.price" @keyup.stop="CheckSkuPrice(editForm.price)" @blur="checkPrice(editForm.price)" placeholder="商品单价" />
      </div>
      <div class="goods">
        <span>服务费 %</span>
        <input type="text" class="goodsinput" v-model.trim="editForm.transfer" @keyup.stop="CheckTransfer(editForm.transfer)" @blur="CheckTransfer2(editForm.transfer)" placeholder="商品服务费" />
      </div>
      <div class="goods">
        <span>库存</span>
        <input type="text" class="goodsinput" v-model.trim="editForm.count" @keyup.stop="CheckCount(editForm.count)"  @blur="checkNum(editForm.count)" placeholder="商品库存" />
      </div>
      <div class="goods">
        <span>发布时间</span>
        <span>{{editForm.publishTime}}</span>
      </div>
      <div class="goods">
        <span>状态</span>
        <span v-if="editForm.STATUS==='0'">已上架</span><span v-if="editForm.STATUS==='1'">已下架</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading" class="title1">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  name: "goodsListPage",
  data() {
    return {
      listData: [],
      loading: false, //是显示加载
      searchName: "", //搜索的名字
      editFormVisible: false, //控制编辑页面显示与隐藏
      total: 0, //总页数
      pageNum:1,
      pageSize:10,
      //新增编辑字段
      editForm: { }
    };
  },
  filters: {
    // addPrice(userData){
    // } 
  },
  // 数据发生改变
  watch: {
    // editForm: function() {
    //     alert(JSON.stringify(this.editForm))
    // }
  },
  // 创建完毕状态(里面是操作)
  created() {
    this.getAlllist();
  },
  methods: {
      CheckSkuPrice(val){
      let reg = /^[0-9]+(.[0-9]{0,2})?$/g;
      if(!reg.test(val)){
        this.$message.error('商品价格只能为数字!');
        this.editForm.price='';
        return false
      }else if( Number.isNaN(Number(val))){
        this.$message.error('商品价格只能为数字!');
        this.editForm.price='';
        return false
      }
      let num =Math.trunc(val).toString();
      if (num.length > 7) {
        this.$message.error('商品价格不能超过7位数!');
        this.editForm.price='';
        return false
      }
    },
    CheckTransfer(val){
      let reg = /[^\d]+$/g;
      this.editForm.transfer=this.editForm.transfer.replace(reg,'');
      if (this.editForm.transfer.length>=3) {
        this.$message.error('商品服务费不能超过100%!');
        this.editForm.transfer='';
      }
    },
    CheckTransfer2(val){
      if(Number.isNaN(Math.trunc(val))){
        this.$message.error("请填写数字!");
        this.editForm.transfer ='';
        return false
      }else if(Math.trunc(val)>98){
        this.$message.error("不能大于98%!");
        this.editForm.transfer ='';
      }
    },
    checkPrice(val) {
      if(Number.isNaN(Math.trunc(val))){
        this.$message.error("请填写数字!");
        this.editForm.price ='';
        return false
      }
    },
    CheckCount(val){
      let test = Math.trunc(val)
      if(Number.isNaN(test)){
        this.$message.error("请填写数字!");
        this.editForm.count ='';
        return false
      }
      if(this.editForm.count.length>8){
         this.$message.error("库存超过最大限制！");
         this.editForm.count = '';
         return false
      }
      this.editForm.count= test
    },
    checkNum(val){
      if(Number.isNaN(Math.trunc(val))){
        this.$message.error("请填写数字!");
        this.editForm.count ='';
        return false
      }
    },
    getAlllist() {
      this.loading = true;
      const url = 'product/api/product/skuStore'
      this.$axios.post(url,{pageNum: this.pageNum, pageSize:this.pageSize})
        .then((res) => {
          this.listData = res.data.skuList;
          this.total = res.data.totalCount;
          this.loading = false;
        })
        .catch((error)=> {
          this.$message("获取信息失败");
          this.loading = false;
        })
    },
    // 编辑页面取消方法（隐藏编辑页面）
    close() {
      this.editFormVisible = false;
    },
    //显示编辑界面
    handleEdit(index,row) {
      this.editFormVisible = true;
      // 深拷贝并赋值
      this.editForm = Object.assign({}, row); //合并对象操作
      this.editForm.transfer *=100;
      console.log(this.editForm)
    },
    // 删除方法
    handleDelete(index, row) {
      const status = 1;
      const url = 'product/api/product/handle/'
      const data = row.skuId;
      // console.log(data)
      this.$confirm("确认下架商品吗?", "提示", {}).then(() => {
        this.loading = true;
        this.$axios.post(url+status, {"id":data},{headers:{'Content-Type': 'application/json'}}).then((res) => {
          setTimeout(() => {
            this.$message({ message: "提交成功！",type: "success"});
            this.getAlllist();
            this.loading = false;
          }, 2000);
        }).catch((err) => {
          let msg = err.response.data.title
          this.$message.error(msg);
          this.loading = false;
        })

      });
    },
    // 编辑、新增弹窗 提交方法
    submit() {
      let status = 0;
      let data = Object.create(null);
      data.id = this.editForm.skuId;
      data.price = this.editForm.price;
      data.count = this.editForm.count;
      data.profit = (Number(this.editForm.transfer) >=12 ) ? (Number(this.editForm.transfer)-2) : 10

      const url = 'product/api/product/handle/'
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.loading = true;
        // 此处应该请求数据
        this.$axios.post(url + status, data).then((res) => {
          setTimeout(() => {
            this.$message({
              message: "提交成功！",
              type: "success"
            });
            this.loading = false;
            this.getAlllist();
          }, 2000);
          this.editFormVisible = false;
        }).catch((err) => {
          this.$message.error(err.response.data.title);
          this.editFormVisible = false;
          this.loading = false;
        })
      });
    },
    // 搜索方法
    // search: function() {
    //     this.searchdata = [];
    //     let searchName = this.searchName;
    //     if (searchName == "") {
    //         this.$message("请输入姓名");
    //         return false;
    //     }
    //     let dayValue = this.dayValue;
    //     this.loading = true;
    //     const res = getTableData();
    //     for (let o of res.data.userData) {
    //         if (o.name == searchName) {
    //             this.searchdata.push(o);
    //         }
    //     }
    //     this.loading = false;
    //     this.userData = this.searchdata;
    // },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val)
      this.pageNum = val;
      this.getAlllist()
    }
  }
};

</script>
<style scoped>
.title1 {
  font-size: 12px;
}

.header-table {
  text-align: left;
}

.goodsinput {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.goods {
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  padding: 0 20px;
}

.goods span {
  display: inline-block;
  min-width: 80px;
  padding-right: 20px;
}

</style>
