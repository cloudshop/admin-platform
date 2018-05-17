<template>
  <div class="goodcontent" style="margin:20px 0;" ref="classiFication">
    <div class="goods" style="margin-bottom:20px;">
      <span>您选择的商品分类为：</span><span v-if="category1name">{{category1name}}<i class="el-icon-arrow-right"></i></span><span v-if="category2name">{{category2name}}<i class="el-icon-arrow-right"></i></span><span v-if="category3name">{{category3name}}</span>
    </div>
    <el-row type="flex" :gutter="20" justify="center">
      <div class="grid-content">
        <ul>
          <li v-for="(item,index) in firstCategory" class="goodlist " :class="{'chociseactive':category1name ==item.firstidname}" :key="index" @click="choiseCategory1(item.firstidname,item.firstid)">
            <span>{{item.firstidname}}</span>
            <i v-show="category1name == item.firstidname" class="el-icon-d-arrow-right"></i></li>
        </ul>
      </div>
      <div class="grid-content " style="margin:0 60px">
        <ul>
          <li v-for="(item,index) in secondCategory" class="goodlist " :class="{'chociseactive':category2name ==item.secondName}" :key="index" @click="choiseCategory2(item.secondName,item.secondId,index)">
            <span>{{item.secondName}}</span>
            <i v-show="category2name == item.secondName" class="el-icon-d-arrow-right"></i></li>
        </ul>
      </div>
      <div class="grid-content ">
        <ul>
          <li v-for="(item,index) in thirdCategory" class="goodlist " :class="{'chociseactive':category3name ==item.thirdName}" :key="index" @click="choiseCategory3(item.thirdName,item.thirdid)">
            <span>{{item.thirdName}}</span>
            <i v-show="category3name == item.thirdName" class="el-icon-d-arrow-right"></i>
          </li>
        </ul>
      </div>
    </el-row>
    
  </div>
</template>
<script type="text/ecmascript-6">
// 导入富文本编辑器模板

export default {
  name: "classiFication",
  props: ['type1', 'type2', 'type3'],
  data() {
    return {

      category1name: '',
      category2name: '',
      category3name: '',
      category1: '', //选择一级分类
      category2: '', //选择二级分类
      category3: '', //选择三级分类
      firstCategory: '', //一级分类
      secondCategory: '', //二级&&三级分类
      secondIndex: '', //二级分类下标
      thirdCategory: '', //二级&&三级分类      
    };
  },
  // 数据发生改变
  watch: {
    category1name(val) {
      this.$axios.get('product/api/categoryTree/subnode/' + this.category1)
        .then((response) => {
          this.secondCategory = response.data.secondCategory;
          this.thirdCategory = this.secondCategory[0].thirdCategory;
          // console.log(this.secondCategory)
          this.category2name = this.secondCategory[0].secondName;
          this.category2 = this.secondCategory[0].secondId;
          this.secondIndex = 0;
          this.category3name = this.secondCategory[0].thirdCategory[0].thirdName;
          this.category3 = this.secondCategory[0].thirdCategory[0].parentid;
          this.thirdCategory = this.secondCategory[0].thirdCategory;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    category2name(val) {
      this.thirdCategory = this.secondCategory[this.secondIndex].thirdCategory;
      // console.log(this.thirdCategory);
      this.category3name = this.secondCategory[this.secondIndex].thirdCategory[0].thirdName;
      // console.log(this.category3name);
      this.category3 = this.secondCategory[this.secondIndex].thirdCategory[0].thirdid;

    }
  },
  // 创建完毕状态(里面是操作)
  created() {

  },
  mounted() {
    // this.getcategoryTree()
    this.getcategoryTree();
    this.getSecondCategory();
  },
  computed: {

  },
  // 里面的函数只有被调用才会执行
  methods: {

    choiseCategory1(name, id) {
      this.category1name = name;
      this.category1 = id;
      this.$emit('update:type1', id);
    },
    choiseCategory2(name, id, index) {
      this.category2name = name;
      this.category2 = id;
      this.secondIndex = index
      this.$emit('update:type2', id);
    },
    choiseCategory3(name, id) {
      this.category3name = name;
      this.category3 = id;
      this.$emit('update:type3', id);
    },
    getcategoryTree() {
      this.$axios.get('product/api/categoryTree/subnode/1').then((res) => {
        this.firstCategory = res.data.firstCategory;
        this.category1name = this.firstCategory[0].firstidname;
        this.category1 = this.firstCategory[0].firstid;
      }).catch((err) => {
        console.log(err)
      })
    },
    getSecondCategory() {
      this.$axios.get('product/api/categoryTree/subnode/' + 35)
        .then((response) => {
          this.secondCategory = response.data.secondCategory;
          this.category2name = this.secondCategory[0].secondName;
          this.category2 = this.secondCategory[0].secondId;
          this.secondIndex = 0;
          this.category3name = this.secondCategory[0].thirdCategory[0].thirdName;
          this.category3 = this.secondCategory[0].thirdCategory[0].parentid;
          this.thirdCategory = this.secondCategory[0].thirdCategory;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};

</script>
<style scoped>
.goodcontent {
  padding: 0 20px;
}

.goodcontent h3 {
  border-bottom: 1px solid #a7a7a7;
  padding-bottom: 6px;
  margin: 20px 0;
}

.grid-content {
  max-width: 280px;
  min-width: 280px;
  border-radius: 4px;
  min-height: 36px;
  padding: 20px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background: #f5f5f5;
}

.goodsinput {
  width: 40%;
}

.grid-content ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}

.grid-content ul {
  height: 340px;
  overflow: hidden;
  overflow-y: scroll;
  box-sizing: border-box;
  background: #fff;
}

.grid-content li span {
  flex: 2;
  text-align: center;
}

.goodlist {
  padding: 10px;
  /* background: #ececec; */
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chociseactive {
  background: #8792af;
  color: #fff;
}

.goods {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  padding: 0 20px;
}

.goodsdescribe {
  display: flex;
  margin-bottom: 20px;
  position: relative;
  align-items: top;
}

.goods span {
  display: inline-block;
  min-width: 80px;
  padding-right: 20px;
}

</style>
