<template>
  <div>
    <!-- 头部按钮 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <el-button type="primary" plain>全部</el-button>
          <el-button type="primary" plain>待付款</el-button>
          <el-button type="primary" plain>待发货</el-button>
          <el-button type="primary" plain>已发货</el-button>
          <el-button type="primary" plain>已完成</el-button>
          <el-button type="primary" plain>已取消</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="top-row">
      <!-- 条件选择 -->
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
          <el-input placeholder="请输入内容" v-model="input5" class="input-with-select selfpinput-serch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
    </el-row>
    <!-- 表单展现 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <table class="newclass" width="100%">
            <thead align=center>
              <tr>
                <th width="10%">序号</th>
                <th width="10%">店铺名称</th>
                <th width="10%">订单编号</th>
                <th width="10%">总价</th>
                <th width="10%">运费</th>
                <th width="10%">订单金额</th>
                <th width="10%">订单状态</th>
                <th width="10%">物流信息</th>
                <th width="10%">操作</th>
              </tr>
            </thead>
            <tbody>
              <!-- 商品单价、让利、库存、货号列表 -->
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>3</td>
                <td>3</td>
                <td>3</td>
                <td>3</td>
                <td>3</td>
                <td><span>删除</span><span>修改</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "allOrder",
  data() {
    return {
      input2: '',
      input21: '',
      input5: '',
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
      }
    };
  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  computed: {

  },
  methods: {

  }
};

</script>
<style>
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
  width: 200px!important;
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

</style>
