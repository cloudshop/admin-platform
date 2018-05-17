<template>
    <div class="login-wrap">
        <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm login-container">
            <h2 class="title">贡融积分<span class="logtitle"></span>新用户注册</h2>
            <el-form-item prop="username">
                <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <div class="yanzheng">
                <div class="yanzma">
                    <el-input placeholder="请输入验证码" v-model="ruleForm.validateCode" clearable> </el-input>
                </div>
                <div class="shuaxin">
                    <span>1234</span>
                    <el-button type="primary">刷新</el-button>
                </div>
            </div>
             <div class="titlemsg">
                <el-checkbox v-model="checked">我同意并已经阅读《贡融积分服务协议》</el-checkbox>
            </div>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;"  :loading="logining">提交</el-button>
            </el-form-item>
           
        </el-form>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
    name: "register",
    data() {
        return {
            checked: true,
            //定义loading默认为false
            logining: false,
            ruleForm: {
                //username和password默认为空
                username: "",
                password: "",
                validateCode: '',
                user:''
            },
            //rules前端验证
            rules: {
                username: [
                    { required: true, message: "请输入账号", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" }
                ]
            }
        };
    },
    watch:{
        ruleForm (val){
            console.log(val)
        }
    },
    // 里面的函数只有调用才会执行
    methods: {
      
    }
};
</script>

<style scoped>
.login-wrap {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-top: 15%;
    background-image: url("../assets/img/bg.png");
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
.login-container h2{
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
.titlemsg {
    margin-bottom: 10px;
    font-size: 12px;
}
.logtitle{
    padding: 0 20px;
}
.yanzheng{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
.yanzma{
        width: 35%;
}
.shuaxin span{
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