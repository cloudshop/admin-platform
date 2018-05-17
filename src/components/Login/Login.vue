<template>
  <div class="login-wrap" :style ="imgs">
    <el-form label-position="left" :model="ruleForm" ref="ruleForm" label-width="0px" class="demo-ruleForm login-container">
      <h2 class="title">贡融积分<span class="logtitle"></span>商家管理平台</h2>
      <el-form-item prop="PassName">
        <el-input type="text" v-model="ruleForm.PassName" auto-complete="off" @blur="upperCase" placeholder="请输入手机号"></el-input>
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
      imgs:{
        backgroundImage: "url(" + require("../../assets/img/bg.png") + ")",
      },
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
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-top: 15%;
  background-color: #112346;
  background-repeat: no-repeat;
  background-position: center right;
}

.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
}

.login-container h2 {
  margin-bottom: 20px;
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.remember {
  margin: 0px 0px 35px 0px;
}

.logoncont {
  display: flex;
  justify-content: space-between;
}

.logtitle {
  padding: 0 20px;
}

.yanzheng {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.yanzma {
  width: 35%;
}

.shuaxin span {
  display: inline-block;
  border: 1px solid #ccc;
  font-size: 22px;
  width: 80px;
  text-align: center;
  height: 40px;
  vertical-align: top;
  line-height: 40px;
  box-sizing: border-box;
  border-radius: 4px;
  margin-right: 10px;
}

</style>
