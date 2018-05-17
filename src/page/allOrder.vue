<template>
  <div>
    <!-- 头部按钮 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <span class="navtabs" :class="{on:flat === index}" v-for="(item,index) in navs" @click="filterOrder(index)">{{item}}</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="top-row">
      <!-- 条件选择 -->
      <div class="grid-content ">
        <!-- <div class="block blockin">
          <span class="demonstration">下单时间:</span>
          <el-date-picker class="selfpinput" v-model="value2" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
        <div class="block blockin">
          <span style="padding:0 10px;">-</span>
          <el-date-picker class="selfpinput" v-model="value2" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
          </el-date-picker>
        </div> -->
        <!--  <div class="blockin">
          <span class="demonstration">买家:</span>
          <el-input class="selfpinput" placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input21">
          </el-input>
        </div> -->
        <div class="blockin">
          <span class="demonstration">订单编号:</span>
          <el-input placeholder="请输入内容" v-model.trim="serchOrderNo" class="input-with-select selfpinput-serch">
            <el-button slot="append" @click="serching(serchOrderNo)" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
    </el-row>
    <p class="nodata" v-show="noData">暂无数据！</p>
    <!-- 表单展现 -->
    <el-row  v-show="!noData">
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <table class="newclass" width="100%" v-loading="loading" element-loading-text="拼命加载中">
            <thead align=center>
              <tr>
                <!-- <th width="8%">序号</th> -->
                <!-- <th width="10%">店铺名称</th> -->
                <th width="17%">订单编号</th>
                <th width="12%">总价</th>
                <th width="12%">运费</th>
                <th width="14%">订单状态</th>
                <th width="15%">物流信息</th>
                <th width="15%">快递单号</th>
                <th width="15%">操作</th>
              </tr>
            </thead>
            <tbody>
              <!-- 商品单价、让利、库存、货号列表 -->
              <tr v-for="(item,index) in listData">
                <td v-text="item.orderNo"></td>
                <td>{{item.payment + '元'}}</td>
                <td>{{item.postFee + '元'}}</td>
                <td>
                  <span v-if="item.status === 1">未支付订单</span>
                  <span v-else-if="item.status === 2">已付款订单(未发货)</span>
                  <span v-else-if="item.status === 3">已发货</span>
                  <span v-else-if="item.status === 4">交易完成(已收货)</span>
                  <span v-else-if="item.status === 5">该交易已关闭</span>
                </td>
                <td>
                  <span v-if="item.shippingName === null">暂无信息</span>
                  <span v-else="item.shippingName !=== null">{{item.shippingName}}</span>
                </td>
                <td>
                  <span v-if="item.shipingCode === null">暂无信息</span>
                  <span v-else="item.shipingCode !== null">{{item.shipingCode}}</span>
                </td>
                <td>
                  <!-- <el-button type="primary" :disabled="item.status !== 2" size="small" @click="handleEdit(item)">修改</el-button> -->
                  <el-button type="primary" :disabled="item.status !== 2"   size="small" @click="handleEdit(item)">修改</el-button>
                  <el-button type="danger" :disabled="item.status !== 4 && item.status !== 5" size="small" @click="handleDelete(item)">删除</el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
    <el-col :span="24" class="toolbar" v-show="!noData">
      <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="total" :current-page="pageNum" @current-change="handleCurrentChange" @size-change="handleSizeChange" style="text-align:center;margin-top:10px;">
      </el-pagination>
    </el-col>
    <el-dialog title="编辑" :visible.sync="editFormVisible">
      <div class="goods">
        <span>订单编号：</span>
        <span>{{editForm.orderNo}}</span>
      </div>
      <div class="goods">
        <span>总价：</span>
        <span>{{editForm.payment + '元'}}</span>
      </div>
      <div class="goods">
        <span>运费：</span>
        <span>{{editForm.postFee + '元'}}</span>
      </div>
      <div class="goods">
        <span>订单状态：</span>
        <span v-if="editForm.status === 1">未支付订单</span>
        <span v-else-if="editForm.status === 2">已付款订单(未发货)</span>
        <span v-else-if="editForm.status === 3">已发货</span>
        <span v-else-if="editForm.status === 4">交易完成(已收货)</span>
        <span v-else-if="editForm.status === 5">该交易已关闭</span>
      </div>
      <div class="goods">
        <span>物流信息：</span>
        <el-select v-model="editForm.shippingName" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value"  :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- <input type="text" class="goodsinput" v-model.trim="editForm.shippingName" placeholder="请填写物流公司名称！" /> -->
      </div>
      <div class="goods">
        <span>快递单号：</span>
        
        <input type="text" class="goodsinput" v-model.trim="editForm.shipingCode" placeholder="请填写快递单号！" />
      </div>
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
      noData:false,
      flat: 0,
      navs: ['全部', '待付款', '待发货', '已发货', '已完成', '已取消'],
      total: 0, //总页数
      pageNum: 1,
      pageSize: 10,
      status:0,
      loading: false,
      editForm: {},
      editFormVisible: false,
      listData: [],
      input2: '',
      input21: '',
      serchOrderNo: '',
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
      options:[
          {value:'顺丰',label:'顺丰'},
          {value:'韵达快运',label:'韵达快运'},
          {value:'申通',label:'申通'},
          {value:'圆通速递',label:'圆通速递'},
          {value:'中通速递',label:'中通速递'},
          {value:'汇通快运',label:'汇通快运'},
          {value:'德邦物流',label:'德邦物流'},
          {value:'ems快递',label:'ems快递'},
          {value:'全峰快递',label:'全峰快递'},
       ]
    };
  },
  watch: {

  },
  created() {

  },
  mounted() {
    this.getAllOrder();
  },
  computed: {

  },
  filter: {
    // serching(){
    //   this.listData = this.listData.filter()
    // }
  },
  methods: {
    serching(val) {
      if(val === ""){
        this.$message({ message: "请输入订单编号!",type: "warning"});
        return false
      }
      this.listData = this.listData.filter((item) => {
        return item.orderNo === val
      })
      if(this.listData.length === 0){
        this.noData = true;
        this.$message({ message: "订单编号不存在!",type: "warning"});
      }
    },
    filterOrder(index) {
      this.serchOrderNo = '';
      this.flat = index;
      this.pageNum=1;
      this.status=index;
      this.getAllOrder();
    },
    getAllOrder() {
      this.loading = true;
      const url = 'order/api/manage/findMercuOrderByStatus'
      this.$axios.post(url,{"page":this.pageNum,"size":this.pageSize,"status":this.status})
        .then((res) => {
          // console.log(res)
          this.listData = res.data.proOrder;
          this.total = res.data.proOrderAmount;
          this.loading = false;
          if(res.data.proOrderAmount == 0){
            this.noData = true;
          }else{
            this.noData = false;
          }
        })
        .catch((error) => {
          console.log(error);
        })
    },
    handleEdit(row) {
      this.editFormVisible = true;
      // 深拷贝并赋值
      this.editForm = Object.assign({}, row); //合并对象操作
    },
    close() {
      this.editFormVisible = false;
    },
    // 编辑、新增弹窗 提交方法
    submit() {
      if(this.editForm.shippingName === null){
        this.$message.error('请选择快递公司！');
        return false
      }
      if(this.editForm.shipingCode === null){
        this.$message.error('请填写快递单号!');
        return false
      }
      let data = Object.create(null);
      data.orderNo = this.editForm.orderNo;
      data.shippingName = this.editForm.shippingName;
      data.shipingCode = this.editForm.shipingCode;

      const url = 'order/api/updateOrderByShip'
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.loading = true;
        this.editFormVisible = false;
        // 此处应该请求数据
        this.$axios.post(url, data).then((res) => {
          setTimeout(() => {
            this.$message({message: "提交成功！",type: "success"});
            this.loading = false;
            this.getAllOrder();
          }, 2000);
        }).catch((err) => {
          this.$message.error(err.response.data.title);
          this.editFormVisible = false;
          this.loading = false;
        })
      });
    },
    // 删除方法
    handleDelete(row) {
      const url = 'order/api/manage/deleteOrder/'
      const data = row.id;
      this.$confirm("确认删除吗?", "提示", {}).then(() => {
        this.loading = true;
        this.$axios.get(url+data).then((res) => {
          setTimeout(() => {
            this.$message({ message: "删除成功！",type: "success"});
            this.getAllOrder();
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
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getAllOrder()
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
  padding: 0 20px;
}

.goods span {
  display: inline-block;
  min-width: 80px;
  padding-right: 20px;
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

.on {
  color: #fff;
  border-color: #3a8ee6;
  background: #3a8ee6;
}
.nodata{
  text-align:center;
  margin:30px 0;
}
</style>
