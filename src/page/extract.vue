<template>
  <div>
    <!-- 头部按钮 -->
     <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <span class="navtabs" :class="{on:flat === index}" v-for="(item,index) in navs" @click="filterOrder(index)">{{item}}</span> 
          <span class="derive" @click="derive()">
            <a href="#" @click="download" id="myId">全部导出</a>
          </span>
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
                <th width="17%">银行卡号</th>
                <th width="12%">开户银行</th>
                <th width="12%">金额</th>
                <th width="18%">日期</th>
                <th width="12%">状态</th>
                <th width="17%">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in listData">
                <td v-text="item.cardholder"></td>   
                <td v-text="item.bankcardNumber"></td>
                <td v-text="item.openingBank"></td>
                <td>{{item.money + ' 元'}}</td>
                <td v-text="item.createdTime"></td>
                <td v-text="item.statusString"></td>
                <td>
                  <el-button type="primary" size="medium" :disabled="item.statusString === '提现成功' || item.statusString === '提现失败'" @click="handleSeccess(item)">允许</el-button>
                  <el-button type="danger" size="medium" :disabled="item.statusString === '提现成功' || item.statusString === '提现失败'" @click="handleFailed(item)">拒绝</el-button>
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
      navs: ['全部', '申请中', '失败', '成功'],
      total: 0, //总页数
      page:1,
      pageNum: 0,
      pageSize: 10,
      status: 0,
      loading: false,
      editForm: {},
      editFormVisible: false,
      listData: [],
      input2: '',
      input21: '',
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
      bol:true,
      time:'',
      totals:''
    }
  },
  watch: {

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
    //时间过滤
    timeFilter(){
      const dates1 = new Date(this.value1);  
      const dates2 = new Date(this.value2);
      const date_values1 = dates1.getFullYear() + '-' + (dates1.getMonth() + 1) + '-' + dates1.getDate();
      const date_values2 = dates2.getFullYear() + '-' + (dates2.getMonth() + 1) + '-' + dates2.getDate();
      var that = this;
      this.$axios.get('wallet/api/withdraw-deposits-sub/' + date_values1 + '/' + date_values2 + '/' + 0 +'/' + 10)
        .then(function(res) {   
          that.listData = res.data;  
          console.log(that.listData);
          for (var i = 0; i < that.listData.length; i++) {
            that.listData[i].createdTime = that.listData[i].createdTime.split('T')[0];
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
    //导出
    download(){
      //导出 下载
      const date1 = new Date(this.value1);  
      const date2 = new Date(this.value2);
      const date_value1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
      const date_value2 = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate();

      if (date_value1 =='NaN-NaN-NaN' && date_value2 == 'NaN-NaN-NaN') {
        document.getElementById("myId").setAttribute("href","http://app.grjf365.com:9080/wallet/api/wallet/withdawDetil"); 
      }else if (date_value1 =='NaN-NaN-NaN' && date_value2 != 'NaN-NaN-NaNN') {
        document.getElementById("myId").setAttribute("href","http://app.grjf365.com:9080/wallet/api/wallet/subwithdawDetil/" + '' + '/' + date_value2); 
      }else if (date_value2 =='NaN-NaN-NaN' && date_value1 != 'NaN-NaN-NaN'){
        document.getElementById("myId").setAttribute("href","http://app.grjf365.com:9080/wallet/api/wallet/subwithdawDetil/" + date_value1 + '/' + ''); 
      }else{
        document.getElementById("myId").setAttribute("href","http://app.grjf365.com:9080/wallet/api/wallet/subwithdawDetil/" + date_value1 + '/' + date_value2); 
      }

      //window.open 下载
      // const date2 = new Date(this.value2);
      // window.open('http://app.grjf365.com:9080/wallet/api/wallet/withdawDetil');
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
      }
    },
    filterOrder(index) {
      console.log(4444)
      // this.serchOrderNo = '';
      this.flat = index;
      this.pageNum = 0;
      this.status = index;
      this.getAllData();
    },
    // 获取所有的提现操作数据
    getAllData() {
      this.loading = true;
      const url = 'wallet/api/withdraw-deposits';
      if(this.status === 0 ){
        this.$axios.get(url+`?page=${this.pageNum}&size=${ this.pageSize}`)
        .then((res) => {
          this.listData = res.data;  
          this.totals = res.headers['x-total-count'];
          // console.log(this.listData);
          for (var i = 0; i < this.listData.length; i++) {
            this.listData[i].createdTime = this.listData[i].createdTime.split('T')[0];
          }

          this.total = Number(this.totals);
          this.loading = false;
          if (Number(this.totals) === 0) {
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
          this.listData = res.data;
          this.totals = res.headers['x-total-count'];
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
    handleFailed(row) {
      this.editFormVisible = true;
      // 深拷贝并赋值
      this.editForm = Object.assign({}, row); //合并对象操作
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
      const content = this.editForm.reason;
      const id = this.editForm.id;
     
      console.log(this.editForm)
      const url = 'wallet/api/put-forward/refuse'
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
          // console.log(err)
          this.$message.error(err.response.data.title);
          this.editFormVisible = false;
          this.loading = false;
        })
      });
    },
    // 审核成功方法
    handleSeccess(row) {
      console.log(row)
      const url = 'wallet/api/put-forward/adopt/'
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
a{
  text-decoration: none;
  color: #000;
}
.block{
  display: inline;
  float: right;
  border-radius: 8px;
}
el-date-picker{
  /* outline: none; */
}
.block:last-child{
  margin-right: 10px;
}

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
  margin-top: 5px;
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
  margin-top: 15px;
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
  margin-bottom: 20px;
  position: relative;
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
  margin: 0 10px;
  border-radius: 8px;
  cursor: pointer;
}

.navtabs:hover {
  color: #fff;
  border-color: #3a8ee6;
  background: #3a8ee6;
}

.derive{
  display: inline-block;
  padding: 8px 20px;
  border: 1px solid #ccc;
  margin: 0 10px;
  border-radius: 8px;
  cursor: pointer;
  float: right;
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
