<template>
  <div class="header-table">
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="填写商品基本信息"></el-step>
          <el-step title="上传商品图片"></el-step>
          <el-step title="商品发布成功"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <div class="goodcontent" style="margin:20px 0;" v-show="active === 0">
      <h3>商品基本信息</h3>
      <classi-fication :type1.sync="type1" :type2.sync="type2" :type3.sync="type3"> </classi-fication>
      <!--  <div class="goods" style="margin:20px 0;">
        <span>商品品牌：</span>
        <el-input class="goodsinput" v-model="goodsBrand" placeholder="请输入商品名称"></el-input>
      </div> -->
      <div class="goods">
        <span>商品名称：</span>
        <el-input class="goodsinput" v-model.trim="goodsName" placeholder="请输入商品名称"></el-input>
      </div>
      <div class="goods">
        <span>商品价格：</span>
        <base-input v-model="goodsPrice"  @keyup.up="IsNumberCheck(goodsPrice)" ></base-input>
        <span style="margin-left:20px;">元</span> <span style="font-size:12px;color:rgb(162, 162, 162);">此价格必须是0.01-9999999之间的数字，且不能大于市场价，此价格为商品的实际销售价。</span>
      </div>
      <div class="goods" style="align-items: flex-start;" v-for="(item,index) in goodsClass">
        <span style="margin-top:8px;">商品规格：</span>
        <el-input class="goodsspec" v-model.trim="item.attr" @change="createGoodsList(item.attr)" @blur="checkInput(item.attr)" clearable placeholder="如颜色"></el-input>
        <div class="goodstages">
          <el-tag style="margin-right:10px;margin-bottom:10px;" :key="tag" v-for="tag in item.attrValue" closable :disable-transitions="false" @close="removeTag(index,tag)">
            {{tag}}
          </el-tag>
          <el-input style="margin-bottom:10px;width:100px" class="input-new-tag" v-if="item.flag" v-model.trim="item.inputValue" placeholder="请输入内容" size="small" @keyup.enter.native="addNewTag(index,item.inputValue)" @blur="addNewTag(index,item.inputValue)">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput(index)">+ 添加标签</el-button>
        </div>
        <el-button type="danger" size="small" style="margin:0 20px;" @click="deleteSpec(index)">删除规格</el-button>
      </div>
      <el-row type="flex" class="row-bg" justify="center">
        <el-button type="primary" :disabled="goodsClass.length===2" @click="addSpec">添加商品规格</el-button>
      </el-row>
      <div class="goods">
        <table class="newclass" width="100%">
          <thead align=center>
            <tr>
              <th width="14%" v-for="(item,index) in goodsClass" v-show="item.attr || item.attr != ''">{{item.attr }}</th>
              <th width="18%">商品价格</th>
              <th width="18%">服务费(%)</th>
              <th width="18%">库存</th>
              <th width="18%">商品编号</th>
            </tr>
          </thead>
          <tbody>
            <!-- 商品单价、服务费、库存、货号列表 -->
            <tr v-for="(item,index) in goodsList">
              <td>{{item.attrValue}}</td>
              <td v-if="item.AnotherValue ">{{item.AnotherValue}}</td>
              <td>
                <!-- <input v-model.trim="goodsPrice" style="width:200px;" class="base-input" :keyup.up="IsNumberCheck(goodsPrice)" placeholder="请输入金额"  /> -->
                <input type="text" class="goodsinput" v-model.trim="item.skuPrice" @keyup.stop="CheckSkuPrice(index,item.skuPrice)" @blur="checkPrice(index,item.skuPrice)" placeholder="商品单价" />
              </td>
              <td>
                <input type="text" class="goodsinput" v-model.trim="item.transfer" @keyup.stop="CheckTransfer(index,item.transfer)" @blur="CheckTransfer2(index,item.transfer)" placeholder="请输入百分比" />
              </td>
              <td>
                <input type="text" class="goodsinput" v-model.trim="item.skuCount"  @keyup.stop="CheckCount(index,item.skuCount)"  @blur="checkNum(index,item.skuCount)" placeholder="商品库存" />
              </td>
              <td>
                <input type="text" class="goodsinput" v-model.trim="item.skuCode" placeholder="商品货号" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="goods">
        <span>商品库存：</span>
        <el-input style="width:240px;" v-model="goodsNumber" :disabled="true">
          <template slot="append">件</template>
        </el-input>
      </div>
      <div class="goods">
        <span>商品图片：</span>
        <el-upload class="avatar-uploader"   :action="ossUploadUrl" :with-credentials="true" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="showMainimage" :src="showMainimage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <p class="mainds">上传商品默认主图，如多规格值时默认使用该图或分规格上传各规格主图；支持jpg、jif、png格式上传或从图片空间中选择，<span>建议使用尺寸800×800像素以上、大小不超过1M的正方形图片，</span>上传后的图片将会自动保存在图片空间的默认分类中。</p>
      <h3>商品详情描述</h3>
      <div class="goods">
        <span>商品描述：</span>
        <div class="imgrule">
          <p>1、基本要求</p>
          <li>(1)手机详情总体大小：图片+文字，图片不超过20张，文字不超过500字；</li>
          <li>建议：所有图片都是宝贝相关图片。</li>
          <p style="margin-top:10px;">2、图片大小要求：</p>
          <li>(1)建议使用宽度480～620像素、高度小于960像素的图片；</li>
          <li>(2)格式为：JPG\JPEG\GIF\PNG；</li>
          <li>举例：可以上传一张宽度为480，高度为960像素，格式为JPEG的图片</li>
        </div>
      </div>
      <div class="goodimg ">
        <quill-editor ref="newEditor" :options="newOption" style="height: 300px; margin-bottom: 54px" v-model="editorContent">
        </quill-editor>
        <div class="addimage">
          <el-upload class="avatar-uploader" style="border:none!important" :action="ossUploadUrl" :with-credentials="true" :show-file-list="false" :on-success="uploadDescribe" :before-upload="beforeUploadDescribe">
            <el-button type="primary">添加图片</el-button>
          </el-upload>
        </div>
      </div>
      <!--  <h3>支付方式</h3>
      <div class="goods">
        <el-checkbox-group v-model="payList">
          <el-checkbox label="余额支付"></el-checkbox>
          <el-checkbox label="微信" disabled></el-checkbox>
          <el-checkbox label="支付宝" disabled></el-checkbox>
        </el-checkbox-group>
      </div> -->
      <h3>商品物流信息</h3>
      <!-- <div class="goods"> -->
      <!-- <span>所在地：</span> -->
      <!-- <el-cascader :options="options" v-model="goodsAddrs" @change="selectAddrs"> -->
      <!-- <el-cascader  v-model="goodsAddrs" > -->
      <!-- </el-cascader> -->
      <!-- </div> -->
      <div class="goods">
        <span>运费：</span>
        <el-input-number class="goodsinput" :min="0" label="描述文字" v-model="goodsFreight">
        </el-input-number>
        <span style="margin-left:20px;">元</span>
      </div>
      <!--  <h3>其他信息</h3>
      <div class="goods">
        <span>商品其他信息：</span>
        <el-input class="goodsinput" v-model="goodsOther" placeholder="请填写内容"></el-input>
      </div> -->
    </div>
    <div class="goodcontent" v-show="active === 1" > 
      <h3>上传商品图片</h3>
      <p style="margin-left: 70px;color: #f54d4d;font-weight: bold;margin: 40px 0 40px 60px;">每个商品最多可以上传5张图片！</p>
      <div class="goods" v-for="(item,index) in goodsImgList" :key="index">
      <!-- <div class="goods" > -->
        <span>{{item.skuName}}</span>
        <el-upload  :action="ossUploadUrl" :with-credentials="true" accept="image" list-type="picture-card" :auto-upload="true" :limit="5" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeAvatarUpload" @change.native="popup(index)">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
     <div class="goodcontent" v-show="active === 3"> 
      <p style="text-align:center">上传商品图片</p>
    </div>
    <el-row type="flex" class="row-bg" justify="center" style="padding: 20px 0;">
      <el-button class="selfbtn" type="primary" @click="submitForm" v-show="active === 0">下一步</el-button>
      <el-button class="selfbtn" type="primary" @click="prev" v-show="active === 1">上一步</el-button>
      <el-button class="selfbtn"  type="primary" @click="subImage" v-show="active === 1">提交</el-button>
      <el-button class="selfbtn"  type="primary" @click="tiaozhuan" v-show="active === 3">商品列表</el-button>
      <el-button class="selfbtn"  type="primary" @click="fabu" v-show="active === 3">继续发布</el-button>
    </el-row>
  </div>
</template>
<script type="text/ecmascript-6">
// 导入富文本编辑器模板
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'
import classiFication from '../components/classiFication'
import BaseInput from '../components/BaseInput'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: "goodsAddNew",
  components: { quillEditor, classiFication, BaseInput},
  data() {
    return {
      ossUploadUrl: 'http://app.grjf365.com/api/file/api/ossUpload', //上传图片服务器地址
      // goodsBrand: '', //商品品牌
      //选择商品分类
      type1: 0, //一级分类id
      type2: 0, //二级分类id
      type3: 0, //三级分类id
      // firstCategory: '', //一级分类(数据)
      // secondCategory: '', //二级&&三级分类(数据)
      // secondIndex: '', //二级分类下标
      // thirdCategory: '', //二级&&三级分类(数据)
      goodsList: [],
      /*/创建商品规格所生成的列表"attr": "颜色","attrValue": "白色","attrAnother": "内存","AnotherValue": "128G","skuPrice": "22元","transfer": "服务费",skuCount": "库存",skuCode": "商品编码"*/
      goodsName: '', //商品名
      goodsPrice: 0, //商品价格
      goodsNumber: 0, //商品货号
      showMainimage: '', //上传完毕商品图片 回显链接
      mainimageUrl: '', //商品图片 默认主图链接
      // payList: ['余额支付'], //商品支付方式
      // goodsAddrs: [], //商品所在地
      goodsFreight: 0, //商品运费
      // goodsOther: '', //商品其他信息
      //商品规格 标签
      goodsClass: [{
        attr: '',
        flag: '',
        attrValue: []
      }],
      flag: 0,
      active: 0,
      //商品图片列表
      goodsImgList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      progress: false,
      editorContent: '', //商品图文描述文本(富文本编辑器里面的值)
      newOption: {
        placeholder: '请输添加商品图、文描述',
        history: {
          delay: 100,
          maxStack: 100,
          userOnly: false
        },
        modules: {
          toolbar: [
            [{ 'size': ['small', 'large', 'huge'] }],
            ['bold', 'italic', 'underline'],
            ['blockquote'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }]
          ]
        }
      }
    }
  },
  // 数据发生改变
  watch: {
    // goodsPrice(val){
    //   console.log(val)
    // }
  },
  // 创建完毕状态(里面是操作)
  created() {

  },
  mounted() {

  },
  computed: {

  },
  // 里面的函数只有被调用才会执行
  methods: {

    IsNumberCheck(val){
      // console.log(this.goodsPrice)
      var reg = /^[0-9]+(.[0-9]{0,2})?$/;
      if(!reg.test(val)){
        this.$message.error('商品价格只能为数字!');
        this.goodsPrice=''
      }
      if(val.length>7){
        this.$message.error('商品价格只能为数字!');
        this.goodsPrice=''
      }
    },
    uploadDescribe(res, file) {
      let length = this.$refs.newEditor.quill.getSelection();
      var index = 0;
      if (length != null) {
        index = length.index
      }
      this.$refs.newEditor.quill.insertEmbed(index, 'image', res[0])
    },
    beforeUploadDescribe(file) {
      const isJPEG = file.type === 'image/jpeg';
      const isJPG = file.type === 'image/jpg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPEG && !isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPEG、JPG、PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      // return isJPEG && isJPG && isPNG && isLt2M;
    },

    
    CheckSkuPrice(index,val){
      var reg = /^[0-9]+(.[0-9]{0,2})?$/g;
      if(!reg.test(val)){
        this.$message.error('商品价格只能为数字!');
        this.goodsList[index].skuPrice='';
        return false
      }else if( Number.isNaN(Number(val))){
        this.$message.error('商品价格只能为数字!');
        this.goodsList[index].skuPrice='';
        return false
      }
      var num =Math.trunc(val).toString();
      if (num.length > 7) {
        this.$message.error('商品价格不能超过7位数!');
        this.goodsList[index].skuPrice='';
        return false
      }
    },
    CheckTransfer(index,val){
      var reg = /^[\d]+$/g;
      if(!reg.test(val)){
        this.$message.error('只能填写数字!');
        this.goodsList[index].transfer='';
        return false
      }else if( Number.isNaN(Number(val))){
        this.$message.error('只能填写数字!');
        this.goodsList[index].transfer='';
        return false
      }
      var num =Math.trunc(val).toString();
      if (num.length > 2) {
        this.$message.error('商品服务费不能超过100%!');
        this.goodsList[index].transfer='';
        return false
      }
    },
    CheckTransfer2(index,val){
      if(Number.isNaN(Math.trunc(val))){
        this.$message.error("请填写数字!");
        this.goodsList[index].transfer ='';
        return false
      }else if(Math.trunc(val)>98){
        this.$message.error("不能大于98%!");
        this.goodsList[index].transfer ='';
        return false
      }
    },
    checkPrice(index,val) {

      if(Number.isNaN(Math.trunc(val))){
        this.$message.error("请填写数字!");
        this.goodsList[index].skuPrice ='';
        return false
      }
    },
    CheckCount(index,val){
      var reg = /^[0-9]+$/g;
      var test = Math.trunc(val)
      if(!reg.test(val)){
         this.$message.error("请填写数字!");
        this.goodsList[index].skuCount ='';
        return false
      }else if(Number.isNaN(test)  ){
        this.$message.error("请填写数字!");
        this.goodsList[index].skuCount ='';
        return false
      }
      if(this.goodsList[index].skuCount.length>8){
         this.$message.error("库存超过最大限制！");
         this.goodsList[index].skuCount = '';
         return false
      }
      this.goodsList[index].skuCount= test
    },
    checkNum(index,val){

      if(Number.isNaN(Math.trunc(val))){
        this.$message.error("请填写数字!");
        this.goodsList[index].skuCount ='';
        return false
      }
      this.goddsTotal()
    },
    //商品库存总和
    goddsTotal() {
      let num = this.goodsList.reduce((total, item) => {
        var nums = Number.parseInt(item.skuCount)
        if (Number.isNaN(nums)) {
          nums = 0;
        }
        total += nums
        return total
      }, 0)
      this.goodsNumber = num
    },
    checkInput(val) {
      const reg = /^\s*|\s*/g;
      let values = val.replace(reg, '');
      if (!values) {
        this.$message.error("请填写商品规格");
        return false
      }
    },
    // 生成商品列表
    createGoodsList(val) {
      let that = this;
      let arr = [];
      if (that.goodsClass.length === 1) {
        let val = that.goodsClass[0].attrValue;
        for (let i = 0; i < val.length; i++) {
          let obj = Object.create(null);
          obj.attr = that.goodsClass[0].attr;
          obj.attrAnother = '';
          obj.AnotherValue = '';
          obj.skuCount = '',
          obj.skuPrice = '';
          obj.transfer = 12;
          obj.skuCode = '';
          obj.attrValue = val[i];
          arr.push(obj)
          obj = {}
        }
      } else if (that.goodsClass.length === 2) {
        let val = that.goodsClass[0].attrValue;
        let val2 = that.goodsClass[1].attrValue;
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < val2.length; j++) {
            let obj = Object.create(null);
            obj.attr = that.goodsClass[0].attr;
            obj.attrAnother = that.goodsClass[1].attr;
            obj.AnotherValue = val2[j];
            obj.skuCount = '',
            obj.skuPrice = '';
            obj.transfer = 12;
            obj.skuCode = '';
            obj.attrValue = val[i];
            arr.push(obj)
            obj = {}
          }
        }
      }
      that.goodsList = arr;
      // console.log(that.goodsList)
      arr = []
    },
    //删除标签
    removeTag(index, tag) {
      this.goodsClass[index].attrValue.splice(this.goodsClass[index].attrValue.indexOf(tag), 1);
      // console.log(this.goodsClass[index].attrValue);
      this.createGoodsList();
    },
    //添加标签
    addNewTag(index, val) {
      let inputValue = val;
      if (inputValue && !this.goodsClass[index].attrValue.includes(inputValue)) {
        this.goodsClass[index].attrValue.push(inputValue);
        // console.log(this.goodsClass[index].attrValue)
      }
      this.createGoodsList();
      this.goodsClass[index].flag = false;
      this.goodsClass[index].inputValue = '';
    },
    //显示添加新标签输入框
    showInput(index) {
      this.goodsClass[index].flag = true
    },
    //删除规格
    deleteSpec(index) {
      this.goodsClass.splice(index, 1);
      this.createGoodsList();
    },
    //添加规则
    addSpec() {
      this.goodsClass.push({
        attr: '',
        flag: '',
        attrValue: []
      })
    },
    //上传商品主图成功回调
    handleAvatarSuccess(res, file) {
      this.showMainimage = URL.createObjectURL(file.raw);
      this.mainimageUrl = res[0];
      // console.log(this.mainimageUrl)
    },
    //上传商品主图之前操作
    beforeAvatarUpload(file) {
      const isJPEG = file.type === 'image/jpeg';
      const isJPG = file.type === 'image/jpg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPEG && !isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPEG、JPG、PNG 格式!');
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
        return false
      }
      // return isJPG && isLt2M;
    },
    //选择商品地址
    // selectAddrs(value) {
    //   this.goodsAddrs = value;
    //   // console.log(this.goodsAddrs);
    // }, 
    handleRemove(file, fileList) {
      // console.log(list,"123");
      // console.log(file,"123");
      // console.log(fileList,"456");
    },
    handlePreview(file) {
      // console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      // console.log(this.dialogImageUrl,'789')
      this.dialogVisible = true;
    },
    handleSuccess(response) {
      // console.log(response)
      this.goodsImgList[this.flag].skuImage.push(response[0])
    },
    popup(index) {
      this.flag = index;
    },
    changeFile(file, filelist) {
     
    },
    // 点击下一步进行提交校验 、通过->步骤条加一
    submitForm() {
      
      //提交前 对所有的数据进行校验
      // if(!this.type1 && !this.type2 && !this.type3){
      //   this.$message.error("请选择商品分类！");
      //   return false
      // }
      if (!this.type3) {
        this.$message.error("请选择商品分类！");
        return false
      } else if (!this.goodsName) {
        this.$message.error("请填写商品名称！");
        return false
      } else if (!this.goodsPrice && typeof(this.goodsPrice) === 'number') {
        this.$message.error("请填写商品价格！");
        return false
      } else if (!this.mainimageUrl) {
        this.$message.error("请填加商品默认主图！");
        return false
      }
      if (this.goodsClass[0].attrValue.length === 0) {
        this.$message.error("请添加商品标签！");
        return false
      }
      if (this.goodsList.length === 0) {
        this.$message.error("商品列表不能为空！");
        return false
      }
      // 图文描述暂时可以为空
      // else if (!this.editorContent) {
      //   this.$message.error("请填填写图文描述！");
      //   return false
      // }
      //api 地址
     
      let result= this.goodsList.map((item)=>{
        item.transfer =( Number(item.transfer)>=12)?(Number(item.transfer)-2):10
        return item
      })
      console.log(result,'res')
      console.log(this.goodsList,'abc')
      let url = 'product/api/product/publish';
      //创建提交data对象
      let data = Object.create(null);

      // data.shopId = '5' //商家id(写死的一个数值)
      data.productName = this.goodsName; //商品名称
      data.listPrice = this.goodsPrice; //商品价格
      data.mainImage = this.mainimageUrl; //商品默认主图链接
      data.description = this.editorContent; //商品图图文描述
      data.categoryId = this.type3 //商品分类
      data.brandId = '1'; //商品品牌
      // data.paymentType = this.payList.join(',')    //商品支付方式
      // data.freight     = this.goodsFreight ;       //商品物流信息 （运费）
      data.address = ""; //商品所在地
      data.attr = result; //商品列表
      console.log(data,123);
      this.$axios.post(url, data, ).then((res) => {
        // console.log(res.data)
        let data = res.data;
        let length = res.data.length;
        let skuImage = [];
        for (let i = 0; i < length; i++) {
          data[i].skuImage = skuImage
        }
        this.goodsImgList = data;
        this.$message.success('商品基本信息上传成功！');
        this.next();
      }) .catch((error)=> {
        if(error.response.status == 500){
           this.$message.error("账号超时，请重新登录！");
           setTimeout(() => {
            // this.logining = false;
            this.$router.push({ path: "/login" });
          }, 2000);
        }else {
            this.$message.error("商品基本信息上传失败，请检查填写内容！");
            return false
          }
        })  
    },
    //提交图片
    subImage() {
      let data = Object.create(null);
      data = this.goodsImgList
      const url = 'product/api/product/skuImage';
      this.$axios.post(url, data, ).then((res) => {
        this.$message.success('商品图片上传成功！');
        this.next()
        if (res.data === 'success') {
          setTimeout(() => {
            this.logining = false;
            this.next()
            // this.$router.push({ path: "/goodsListPage" });
          }, 2000);
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error("商品图片上传失败，请检查图片是否合规！");
        return false
      })
    },
    tiaozhuan(){
      this.$router.push({ path: "/goodsListPage" });
    },
    fabu(){
      window.location.reload()
    },
    //stape 进度条 下一步
    next() {
      if (this.active++ > 2) { this.active = 0 };
      // console.log(this.active)
    },
    //stape 进度条 上一步
    prev() {
      if (this.active <= 0) {
        this.active = 0
      } else {
        this.active -= 1;
        this.goodsImgList =[];
      }
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

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.goodcontent {
  padding: 0 20px;
}

.goodcontent h3 {
  border-bottom: 1px solid #a7a7a7;
  padding-bottom: 6px;
  margin: 20px 0;
}

.onlist {
  background: #c8d8fd;
  border-radius: 6px;
}

.goods {
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

.goodsspec {
  width: 120px;
  margin-right: 20px;
  flex: 0 0 120px;
}

.goodstages {
  /*margin-right: 20px;*/
}

.goodsspec input {
  width: 100px;
}

.goodsinput {
  width: 40%;
}

.goodstextarea {
  width: 60%;
}

.goodimg {
  margin-left: 100px;
  margin-bottom: 20px;
  position: relative;
  padding: 0 20px;
}

.uploadimg {
  box-sizing: border-box;
  padding: 20px;
  width: 350px;
  height: 480px;
  border: 1px solid #ccc;
  margin-left: 100px;
  border-radius: 4px;
  /*overflow-y: scroll;*/
  margin-bottom: 40px;
  position: relative;
}

.imgrule {
  width: 100%;
  padding: 20px;
  border-radius: 6px;
  background: #e8e8e8;
}

.imgrule p {
  padding: 0;
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.imgrule li {
  list-style: none;
  font-size: 14px;
  margin-top: 10px;
  text-indent: 24px;
}

.maining {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.maining input {
  width: 100%;
  height: 100%;
}

.mainds {
  padding: 0;
  margin-left: 120px;
  text-indent: 24px;
  font-size: 14px;
  width: 600px;
  background: #e8e8e8;
  padding: 20px;
  border-radius: 6px;
}

.mainds span {
  color: #ff6161
}

.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.chociseactive {
  background: #8792af;
  color: #fff;
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
.base-input{
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

.addimage {
  width: 100%;
  /*height: 30px;*/
  text-align: center;
  /*line-height: 30px;*/
  /*background: #ccc;*/
  margin: 0 auto;
}

.addimage .avatar-uploader {
  border: none;
  display: inline-block;
  /*width: 100%!important;*/
  /*height: 100%!important;*/
}

.selfbtn {
  margin: 0 20px;
}

.skuphoto {
  margin: 0 20px;
  text-align: center;
}

.skuphoto .avatar-uploader-icon {
  width: 120px;
  height: 120px;
  line-height: 120px;
}

</style>
