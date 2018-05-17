<template>
  <div>
    <input class="base-input" ref="input" v-bind:value="value" v-on:input="updateValue($event.target.value)" v-on:focus="selectAll" v-on:blur="formatValue"   placeholder="请输入金额" />
  </div>
</template>
<script>
import {currencyValidator}  from '../components/currencyValidator'
export default {
  name: "BaseInput",
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  mounted: function() {
    this.formatValue()
  },
  methods: {
    updateValue: function(value) {
      var result = currencyValidator.parse(value, this.value)
      if (result.warning) {
        this.$refs.input.value = result.value
      }
      this.$emit('input', result.value)
    },
    formatValue: function() {
      console.log(this.$refs.input.value)
        if(this.$refs.input.value.length>9){
            this.$message.error('商品价格不能超过7位数!');
            this.$refs.input.value = 0;
            return false
        }
      this.$refs.input.value = currencyValidator.format(this.value)
    },
    selectAll: function(event) {
      // Workaround for Safari bug
      // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
      setTimeout(function() {
        event.target.select()
      }, 0)
    }
  }
  // ,
  //  watch: {
  //   value(val){
  //     console.log(val)
  //   }
  // }
};

</script>
<style scoped>
.base-input{
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc; 
}
</style>
