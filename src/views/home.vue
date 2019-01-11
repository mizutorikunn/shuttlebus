<template>
  <div id="home">
    <div id="header">
      <!--日期组件-->
      <mt-button @click="open('picker')" size="large">{{display}}</mt-button>
      <mt-datetime-picker
        ref="picker"
        type="date"
        v-model="value"
        @confirm="handleChange"
        :startDate="startDate"
        :endDate="endDate"
      ></mt-datetime-picker>
    </div>
    <!-- 展示组件 -->
    <div class="page-tabbar">
      <div class="page-wrap">
        <mt-tab-container class="page-tabbar-container" v-model="selected">
          <mt-tab-container-item id="福田">
            <mt-spinner type="fading-circle" color="#409EFF" :size="60" v-if="loading"></mt-spinner>
            <ul>
              <li>
                <h3>往長安</h3>
                <mt-cell
                  v-for="(item,index) in ftpassengerToCA"
                  :key="index"
                  :title="index+1 +'.'+ item[0]+'  '+item[1]"
                />
              </li>
              <li>
                <h3>返香港</h3>
                <mt-cell
                  v-for="(item,index) in ftpassengerToHK"
                  :key="index"
                   :title="index+1 +'.'+ item[0]+'  '+item[1]"
                />
              </li>
            </ul>
          </mt-tab-container-item>
          <mt-tab-container-item id="皇岗">
            <h1 v-if="loading" id="loading">加載中</h1>
            <ul>
              <li>
                <h3>往長安</h3>
                <mt-cell
                  v-for="(item,index) in hgpassengerToCA"
                  :key="index"
                   :title="index+1 +'.'+ item[0]+'  '+item[1]"
                />
              </li>
              <li>
                <h3>返香港</h3>
                <mt-cell
                  v-for="(item,index) in hgpassengerToHK"
                  :key="index"
                   :title="index+1 +'.'+ item[0]+'  '+item[1]"
                />
              </li>
            </ul>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>

      <mt-tabbar v-model="selected" fixed>
        <mt-tab-item id="福田">
          <mt-button id="ft" @click="selectedFT()">福田</mt-button>
        </mt-tab-item>
        <mt-tab-item id="皇岗">
          <mt-button id="hg" @click="selectedHG()">皇岗</mt-button>
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      //展示组件
      selected: "皇岗",
      ftpassengerToCA: [],
      hgpassengerToCA: [],
      ftpassengerToHK: [],
      hgpassengerToHK: [],
      loading: true,
      startDate: new Date(),
      endDate: new Date(),
      //日期组件
      value: new Date(
        new Date().getFullYear() +
          "/" +
          (new Date().getMonth() + 1) +
          "/" +
          new Date().getDate()
      ),

      display: "選擇日期"
    };
  },
  methods: {
    //日期组件
    open() {
      this.$refs.picker.open();
    },
    //每选一次日期都会发一次请求
    handleChange() {
      this.ftpassengerToCA = [];
      this.hgpassengerToCA = [];
      this.ftpassengerToHK = [];
      this.hgpassengerToHK = [];
      this.requestDate();
    },
    //内容组件
    selectedHG() {
      document.getElementById("ft").style.background = "white";
      document.getElementById("hg").style.background = "lightblue";
      this.selected = "皇岗";
    },
    selectedFT() {
      document.getElementById("ft").style.background = "lightblue";
      document.getElementById("hg").style.background = "white";
      this.selected = "福田";
    },
    requestDate() {
      //出现加载图标
      this.loading = true;
      //判断当前日期
      let date = new Date(this.value);
      let selectedDate =
        date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
      //判断当天星期几
      let today = date.getDay();
      if (today == 1) {
        today = "星期一";
      } else if (today == 2) {
        today = "星期二";
      } else if (today == 3) {
        today = "星期三";
      } else if (today == 4) {
        today = "星期四";
      } else if (today == 5) {
        today = "星期五";
      } else if (today == 6) {
        today = "星期六";
      } else {
        today = "星期日";
      }
      this.display = selectedDate + " " + today;
      //定义两个请求，第一个请求TOCA的人数，第二个请求TOHK的人数
      function request1() {
        return axios.get(
          "../weChartService/get.asmx/getTransportCA?sDate=" + selectedDate
          // "http://www.rototechgroup.com/weChartService/get.asmx/getTransportCA?sDate=" +
          //   selectedDate
        );
      }
      function request2() {
        return axios.get(
          // "http://www.rototechgroup.com/weChartService/get.asmx/getTransportHK?sDate=" +
          //   selectedDate
          "../weChartService/get.asmx/getTransportHK?sDate=" + selectedDate
        );
      }
      //同个请求同时发出，当两个都完成时才到下一步
      if (today != "星期日") {
        axios.all([request1(), request2()]).then(
          axios.spread((res1, res2) => {
            console.log(res1);
            console.log(res2);
            for (let item of res1.data) {
              if (item.location == "皇岗") {
                if (
                  item.dTime != "09:00" &&
                  item.dTime != "17:30" &&
                  item.dTime != "17:00"
                ) {
                  this.hgpassengerToCA.push([item.Display_name, item.dTime]);
                } else {
                  this.hgpassengerToCA.push([item.Display_name, ""]);
                }
              } else {
                if (
                  item.dTime != "09:00" &&
                  item.dTime != "17:30" &&
                  item.dTime != "17:00"
                ) {
                  this.ftpassengerToCA.push([item.Display_name, item.dTime]);
                } else {
                  this.ftpassengerToCA.push([item.Display_name, ""]);
                }
              }
              this.hgpassengerToCA.sort();
              this.ftpassengerToCA.sort();
            }
            for (let item of res2.data) {
              if (item.location == "皇岗") {
                if (
                  item.dTime != "09:00" &&
                  item.dTime != "17:30" &&
                  item.dTime != "17:00"
                ) {
                  this.hgpassengerToHK.push([item.Display_name, item.dTime]);
                } else {
                  this.hgpassengerToHK.push([item.Display_name, ""]);
                }
              } else {
                if (
                  item.dTime != "09:00" &&
                  item.dTime != "17:30" &&
                  item.dTime != "17:00"
                ) {
                  this.ftpassengerToHK.push([item.Display_name, item.dTime]);
                } else {
                  this.ftpassengerToHK.push([item.Display_name, ""]);
                }
              }
              this.hgpassengerToHK.sort();
              this.ftpassengerToHK.sort();
            }
            //隐藏加载图标
            this.loading = false;
          })
        );
        this.setBGC();
      } else {
        this.loading = false;
        alert("不适用");
      }
    },
    //为展示出来的数据增加边框
    setBGC() {
      setTimeout(() => {
        let elements = document.getElementsByClassName("mint-cell");
        for (let i = 0; i < elements.length; i++) {
          if (i % 2 == 0) {
            elements[i].style.border = "thin solid #E4E7ED";
          } else {
            elements[i].style.border = "thin solid #E4E7ED";
          }
        }
      }, 1000);
    },
    // 控制可选择的日期范围
    getEndDate() {
      let startMon = this.startDate.getMonth();
      console.log(startMon);
      if (startMon == 0) {
        this.startDate = new Date(new Date().getFullYear() - 1 + "/12/1");
      }
      if (12 - startMon >= 2) {
        this.endDate = new Date(
          new Date().getFullYear() + "/" + (new Date().getMonth() + 2) + "/28"
        );
      } else {
        this.endDate = new Date(new Date().getFullYear() + 1 + "/1/31");
      }
    }
  },
  mounted() {
    //因为页面加载时会自动发出一个今天从皇岗TOCA的请求，所以先默认把皇岗变成蓝色
    document.getElementById("hg").style.background = "lightblue";
    this.getEndDate();
    this.requestDate();
    console.log(`startDate:${this.startDate}`);
    console.log(`endDate:${this.endDate}`);
  }
};
</script>


<style lang="scss">
.page-tabbar {
  overflow: hidden;
  /* height: 100vh; */
}

.page-wrap {
  overflow: auto;
  height: 100%;
}

.mint-button {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.mint-tabbar {
  .mint-tab-item {
    padding: 0;
  }
}

//背景
body {
  // background-color: #E6E6E6 !important;
  margin: 0;
  padding: 0;
  border: thin solid #dcdfe6;
}
* {
  color: #303133;
}

ul {
  list-style-type: none !important;
  margin: 0 !important;
  padding: 0 !important;
  li {
    margin: 0 !important;
    padding: 0 !important;
    width: 50% !important;
    display: inline-grid !important; //如设置为inline-block则会以底边对齐。 设置成inline-grid就会以顶边对齐
    top: 0 !important;
  }
}
h3 {
  text-align: center !important;
  background-color: whitesmoke !important;
  margin: 0 !important;
  padding: 0 !important;
  color: #409eff;
}
#loading {
  text-align: center !important;
  color: lightcoral !important;
}
button {
  height: 4em !important;
}
#hg,
#ft {
  height: 3em !important;
}

.picker-item {
  font-size: 1.38rem !important;
}
</style>