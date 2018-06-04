<template>
  <div>
    <!-- 头部按钮 -->
     <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <span class="navtabs" :class="{on:flat === index}" v-for="(item,index) in navs" @click="filterOrder(index)">{{item}}</span>
          <span class="filter" @click="timeFilter()">筛选</span>
          <div class="block">
            <el-date-picker
              v-model="value2"
              align="right"
              type="date"
              placeholder="结束日期"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </div>
          <div class="block">
            <el-date-picker
              v-model="value1"
              align="right"
              type="date"
              placeholder="开始日期"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </div>
        </div>
      </el-col>
    </el-row> 
    <!-- 条件选择 -->
    <!-- <el-row class="top-row">
      <div class="grid-content ">
        <div class="block blockin">
          <span class="demonstration">下单时间:</span>
          <el-date-picker class="selfpinput" v-model="value2" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
        <div class="block blockin">
          <span style="padding:0 10px;">-</span>
          <el-date-picker class="selfpinput" v-model="value2" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
         <div class="blockin">
          <span class="demonstration">买家:</span>
          <el-input class="selfpinput" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input21">
          </el-input>
        </div>
        <div class="blockin">
          <span class="demonstration">订单编号:</span>
          <el-input placeholder="请输入内容" v-model.trim="serchOrderNo" class="input-with-select selfpinput-serch">
            <el-button slot="append" @click="serching(serchOrderNo)" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
    </el-row> -->
    <p class="nodata" v-show="noData">暂无数据！</p>
    <!-- 表单展现 -->
    <el-row v-show="!noData">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <table class="newclass" width="100%" v-loading="loading" element-loading-text="拼命加载中">
            <thead align=center>
              <tr>
                <th width="12%">姓名</th>
                <th width="15%">身份证号</th>
                <th width="30%">身份证照片</th>
                <th width="14%">日期</th>
                <th width="12%">状态</th>
                <th width="17%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in listData">
                <td v-text="item.realName"></td>
                <td v-text="item.idnuber"></td>
                <td class="imgbox">
                  <img class="imgs" :src="item.frontImg" alt="身份证正面">
                  <img class="imgs" :src="item.reverseImg" alt="身份证背面">
                  <!-- <span>查看</span> -->
                  <el-button type="primary" size="medium" @click="lookcard(item)">查看图片</el-button>
                </td>
                <td>{{item.createdTime}}</td>
                <td v-text="item.statusString"></td>
                <td>
                  <el-button type="primary" :disabled="item.statusString === '未通过审核' || item.statusString === '审核通过'" size="medium"  @click="handleSeccess(item)">允许</el-button>
                  <el-button type="danger" :disabled="item.statusString === '未通过审核' || item.statusString === '审核通过'" size="medium"  @click="handleFailed(item)">拒绝</el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <el-col :span="24" class="toolbar" v-show="!noData">
      <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" :current-page="page" @current-change="handleCurrentChange" @size-change="handleSizeChange" style="text-align:center;margin-top:10px;">
      </el-pagination>
    </el-col>
    <!-- 查看图片 -->
    <el-dialog title="查看图片" :visible.sync="lookimg" >
      <div class="showimgs">
        <img  :src="editForm.frontImg" alt="身份证正面">
      </div> 
      <div class="showimgs">
        <img  :src="editForm.reverseImg" alt="身份证背面">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookImgClose">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="失败原因" :visible.sync="editFormVisible" width="30%">
      <div class="goods">
        <span class="goodsspan1">请填写失败原因：</span>
        <span class="goodsspan2">{{editForm.reason}}</span>
      </div>
       <el-input v-model="editForm.reason" placeholder="请输入内容"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading" class="title1">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "allOrder",
  data() {
    return {
      noData: false,
      flat: 0,
      navs: ['全部', '审核中', '失败', '成功'],
      total: 0, //总页数
      page:1,
      pageNum: 0,
      pageSize: 10,
      status: 0,
      loading: false,
      editForm: {},
      editFormVisible: false,
      lookimg: false,
      listData: [],
      serchOrderNo: '',
      input2: '',
      input21: '',
      value2: '',
     pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value1: '',
      value2: '',
      date1_month:'',
      date2_month:'',
      date1_date:'',
      date2_date:'',
      createdTime:'',
    };
  },
  watch: {

  },
  created() {

  },
  mounted() {
    this.getAllData();
  },
  computed: {

  },
  filter: {
    // serching(){
    //   this.listData = this.listData.filter()
    // }
  },
  methods: {
    //按时间过滤
    timeFilter(){
      const dates1 = new Date(this.value1);  
      const dates2 = new Date(this.value2);
      const date_values1 = dates1.getFullYear() + '-' + (dates1.getMonth() + 1) + '-' + dates1.getDate();
      const date_values2 = dates2.getFullYear() + '-' + (dates2.getMonth() + 1) + '-' + dates2.getDate();
      var that = this;
      const datas = {
        'frist':date_values1,
        'last':date_values2,
        'page':0,
        'size':10
      }
      this.$axios
        .post(
          'user/api/findSubAuthentication',
          datas
        )
        .then(function(res) {   
          that.listData = res.data;  
          for (var i = 0; i < that.listData.length; i++) {
            that.listData[i].createdTime = that.listData[i].createdTime.split('T')[0] + ' ' + that.listData[i].createdTime.split('T')[1].split('Z')[0];
            // console.log(that.listData[i].createdTime);
          }
          that.totals = res.data.length;
          that.total = Number(that.totals);
          that.loading = false;
          if (Number(that.totals) === 0) {
            that.noData = true;
          } else {
            that.noData = false;
          }
        })
        .catch(function(error) {
            console.log(error);
        });
    },
    serching(val) {
      if (val === "") {
        this.$message({ message: "请输入订单编号!", type: "warning" });
        return false
      }
      this.listData = this.listData.filter((item) => {
        return item.orderNo === val
      })
      if (this.listData.length === 0) {
        this.noData = true;
        this.$message({ message: "订单编号不存在!", type: "warning" });
        this.serchOrderNo = '';
        return false
      }
    },
    filterOrder(index) {
      this.serchOrderNo = '';
      this.flat = index;
      this.pageNum = 0;
      this.status = index;
      this.getAllData();
    },
    //获取所有审核数据
    getAllData() {
      this.loading = true;
      const url = 'user/api/authentications'
      if(this.status === 0 ){
        this.$axios.get(url+`?page=${this.pageNum}&size=${ this.pageSize}`)
        .then((res) => {
          const totals = res.headers['x-total-count'];
          this.listData = res.data;
          // console.log(this.listData);
          for (var i = 0; i < this.listData.length; i++) {
            this.listData[i].createdTime = this.listData[i].createdTime.split('T')[0] + ' ' + this.listData[i].createdTime.split('T')[1].split('Z')[0];
            // console.log(this.listData[i].createdTime);
          }
          this.total = Number(totals);
          this.loading = false;
          if (Number(totals) === 0) {
            this.noData = true;
          } else {
            this.noData = false;
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }else{
        this.$axios.get(url+`?page=${this.pageNum}&size=${ this.pageSize}&status.equals=${this.status}`)
        .then((res) => {
          const totals = res.headers['x-total-count'];
          this.listData = res.data;
          this.total = Number(totals);
          this.loading = false;
          if (Number(totals) === 0) {
            this.noData = true;
          } else {
            this.noData = false;
          }
        })
        .catch((error) => {
          console.log(error);
        })
      }
    },
    lookcard(item){
       this.lookimg = true;
      // 深拷贝并赋值
      this.editForm = Object.assign({}, item); //合并对象操作
    },
    handleFailed(row) {
      this.editFormVisible = true;
      // 深拷贝并赋值
      this.editForm = Object.assign({}, row); //合并对象操作
    },
    lookImgClose(){
      this.lookimg = false;
    },
    close() {
      this.editFormVisible = false;
    },
    // 编辑、新增弹窗 提交方法
    submit() {
      if(this.editForm.reason === undefined || this.editForm.reason === ''){
         this.$message.error("请填写失败原因");
         return false
      }
      const id = this.editForm.id;
      const content = this.editForm.reason;
      const url = 'user/api/authentication/refuse'
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.loading = true;
        this.editFormVisible = false;
        // 此处应该请求数据
        this.$axios.put(url,{content,id}).then((res) => {
          setTimeout(() => {
            this.$message({message: "提交成功！",type: "success"});
            this.loading = false;
            this.getAllData();
          }, 2000);
        }).catch((err) => {
          this.$message.error(err.response.data.title);
          this.editFormVisible = false;
          this.loading = false;
        })
      });
    },
    // 完成方法
    handleSeccess(row) {
      console.log(row)
      const url = 'user/api/authentication/agree/'
      const data = row.id;
      this.$confirm("确认完成吗?", "提示", {}).then(() => {
        this.loading = true;
        this.$axios.put(url+data).then((res) => {
          setTimeout(() => {
            this.$message({ message: "操作成功！",type: "success"});
            this.getAllData();
            this.loading = false;
          }, 2000);
        }).catch((err) => {
          let msg = err.response.data.title
          this.$message.error(msg);
          this.loading = false;
        })
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    // currentPage 改变时更新数据
    handleCurrentChange(val) {
      console.log(val)
      if(val === 1){
        this.page = 1;
        this.pageNum =0
      }else{
        this.pageNum = (val-1)
         console.log(this.pageNum)
      }
      this.getAllData()
    }
  }
};

</script>
<style scoped>
.top-row {
  padding-bottom: 20px;
  border-bottom: 1px solid #989898;
  padding-top: 20px;
  border-top: 1px solid #989898;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.blockin {
  float: left;
}

.demonstration {
  padding: 0 20px;
}

.selfpinput {
  width: 160px!important;
}

.selfpinput-serch {
  width: 250px!important;
}


/* Table Head */

.newclass {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ccc;
  margin-top: 20px;
  background: #fff;
  /*box-shadow: 0px 3px 3px rgba(0,0,0,.3);*/
}

.newclass input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.newclass th,
.newclass td {
  padding: 8px 4px;
  text-align: cneter;
  border: 1px solid #ccc;
}

.newclass thead tr {
  background: #8cc253;
  color: #fff;
}

.newclass tbody tr:nth-child(even) {
  background: #eee;
}

.newclass td {
  text-align: center
}

.newclass tbody tr:hover {
  background: #80c7fe;
  color: #fff;
}
.imgbox{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.imgs{
  display: inline-block;
  width: 100px;
  height: 80px;
  background: #ccc;
  border-radius: 8px;
  overflow: hidden;
}
.showimgs{
  width: 100%;
  overflow: hidden;
  margin-bottom: 20px;
}
.showimgs img{
  display: block;
  width: 100%;
  overflow: hidden;
}

/************************/

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
}

.goods span {
  display: inline-block;
  min-width: 80px;
  padding-right: 20px;
}
.goodsspan1,.goodsspan2{
  display: inline-block;
}
.goodsspan1 {
  flex:120px 0 0;
  padding-right: 10px;
}
.navtabs {
  display: inline-block;
  padding: 8px 20px;
  border: 1px solid #ccc;
  margin: 5px 10px 0 10px;
  border-radius: 8px;
  cursor: pointer;
}

.navtabs:hover {
  color: #fff;
  border-color: #3a8ee6;
  background: #3a8ee6;
}

.filter{
  display: inline-block;
  padding: 8px 20px;
  border: 1px solid #ccc;
  margin: 0 10px;
  border-radius: 8px;
  cursor: pointer;
  float: right;
}

.block{
  display: inline;
  float: right;
  border-radius: 8px;
  margin-left: 10px;
}

.on {
  color: #fff;
  border-color: #3a8ee6;
  background: #3a8ee6;
}

.nodata {
  text-align: center;
  margin: 30px 0;
}

</style>
