<template>
  <el-menu :default-active="$route.path" theme="dark" class="el-menu-vertical-demo"  router v-show="!collapsed" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
      <el-submenu :index="index+''" v-if="!item.leaf">
        <template slot="title">
          <i :class="item.iconCls"></i>{{item.name}}</template>
        <el-menu-item class="el-menu-bg" v-for="(child,index) in item.children" :index="child.path" :key="item.id" v-if="!child.hidden">{{child.name}}</el-menu-item>
      </el-submenu>
      <el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
        <i :class="item.iconCls"></i>{{item.children[0].name}}
        </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
export default {
    name:"leftnav",
    data() {
        return {
          collapsed: false,
        };
    }
};
</script>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    border: none;
    text-align: left;
}
.el-menu-bg{
    background-color: #1f2d3d !important;
}
</style>