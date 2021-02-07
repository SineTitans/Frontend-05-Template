import HelloWorld from './HelloWorld.vue';
import Vue from "vue";

new Vue({
  el: "#app",
  render: v => v(HelloWorld),
});
