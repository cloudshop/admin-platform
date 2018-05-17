<template>
    <el-menu class="el-menu-demo" mode="horizontal" background-color="#334157" text-color="#fff" active-text-color="#fff">
        <div class="logobox">
            <span class="title1">贡融积分</span>
            <span class="title2">管理员后台</span>
        </div>
        <el-submenu index="2" class="submenu">
            <template slot="title">{{name}}</template>
            <!-- <el-menu-item index="2-1">设置</el-menu-item> -->
            <!-- <el-menu-item @click="content()" index="2-2">个人中心</el-menu-item> -->
            <el-menu-item @click="exit()" index="2-3">退出</el-menu-item>
        </el-submenu>
    </el-menu>
</template>
<script>
export default {
    name: "navcon",
    data() {
        return {
            name:window.sessionStorage.getItem('name')
        };
    },
    methods: {
        // 退出登录
        exit() {
            this.$confirm("退出登录, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.$store.commit('logout')
                    window.sessionStorage.clear()
                    this.$message({ message: "已退出登录!",type: "success"});
                    setTimeout(() => {
                        this.$router.push({ path: "/login" }); 
                    }, 1000);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                });
        },
        // 测试状态管理
        // content() {
        //     this.$root.Bus.$emit("eventName", "1111");
        // }
    }
};
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    border: none;
}
.submenu {
    float:  right!important;
}
.logobox {
    position: absolute;
    top: 0px;
    left: 0px;
    height: 60px;
    line-height: 60px;
    color: #9d9d9d;
    
    padding: 0px 20px;
}
.logobox span{
    display: inline-block;
}
.title1{
    font-size: 24px;
    margin:0 60px;
}
.title2{
    font-size: 18px;
}
</style>