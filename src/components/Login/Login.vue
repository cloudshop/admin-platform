<template>
  <div class="login-wrap" >
    <el-form label-position="left" :model="ruleForm" ref="ruleForm" label-width="0px" class="login-form ">
      <h2 class="title">贡融积分管理员后台</h2>
      <el-form-item prop="PassName">
        <el-input  type="text" v-model="ruleForm.PassName" auto-complete="off" @blur="upperCase" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="PassWord">
        <el-input type="password" v-model="ruleForm.PassWord" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="btn" :loading="logining">登录</el-button>
      </el-form-item>
      <!-- <div class="logoncont">
        <el-button type="text" @click.native="register">注册</el-button>
        <el-button type="text">忘记密码</el-button>
      </div> -->
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
// 导入登录接口方法
import * as types from '../../store/types';
export default {
  name: "login",
  data() {
    return {
     
      iphoneYN: false,
      logining: false,
      ruleForm: {
        PassName: "",
        PassWord: ""
      }
    }
  },
  watch: {
    // ruleForm(val) {
    //   console.log(val)
    // }
  },
  methods: {
    upperCase() {
      var theinput = this.ruleForm.PassName;
      var p1 = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
      if (p1.test(theinput) == false) {
        this.$message.error("请填写正确电话号码!");
        this.ruleForm.PassName = "";
        return false
      } else {
        this.iphoneYN = true;
      }
    },
    btn() {
      if(this.iphoneYN !== true) {
        alert('手机号输入错误')
        return
      }
      if(this.PassName == '' || this.PassWord =='') {
        alert('请输入用户名或密码')
        return
      }
      if (this.iphoneYN == true) {
      this.$store.dispatch(types.LOGIN, {username: this.ruleForm.PassName, password: this.ruleForm.PassWord})
         .then((res) => {
            window.sessionStorage.setItem('name',this.ruleForm.PassName)
            setTimeout(() => {
              this.$router.push({ path: "/extract" });
            }, 2000);

          })
          .catch((error) => {
            if (error.response.status === 400) {
              this.$message.error(error.response.data.title);
              this.ruleForm.PassName = '';
              this.ruleForm.PassWord = '';
            }else if(error.response.status === 500){
              this.$message.error("服务器繁忙，请耐心等待");
            }
            return false;
          });
      } else {
        this.$message.error("请填写正确电话号码!");
        return false
      }
    }
  }
};

</script>
<style scoped>
.login-wrap {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color:  #2d3a4b;
  box-sizing: border-box;
  
}
.login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }

.title {
  font-size: 30px;
  font-weight: 400;
  color: #eee;
  text-shadow: 0px 8px 10px #0c0b13;
  margin: 0px auto 30px auto;
  text-align: center;
  font-weight: bold;
}

.el-form-item {
    box-shadow: 0px 6px 14px #242233
  }

/*.el-input input {
    background: transparent!important;
    color: #fff;
    height: 50px;
    line-height: 50px;
    border: 1px solid #a5a5a5;
    font-size: 18px;
      
    }*/



</style>
