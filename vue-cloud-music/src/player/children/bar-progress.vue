<template>
  <div class="bar-progress">
    <span class="text">{{ currentTime | formatTime }}</span>
    <div class="bar" ref="bar" :style="backgroundStyle">
      <span class="icon" ref="icon"></span>
    </div>
    <span class="text">{{ duration | formatTime }}</span>
    <!-- <audio
      src="https://music.163.com/song/media/outer/url?id=1807537867.mp3"
      autoplay
      controls
    ></audio> -->
  </div>
</template>
<script>
export default {
  props: { currentTime: Number, duration: Number },
  //过滤器声明
  filters: {
    //格式化时间的过滤器，原来的数据不会修改
    formatTime(value) {
      let mins = Math.floor(value / 60);
      let secend = Math.floor(value % 60);
      secend = secend < 10 ? "0" + secend : secend;
      return `${mins}:${secend}`;
    }
  },
  watch: {
    progress: {
      handler() {
        this.$refs.icon.style.transform = `translate(${this.progress *
          this.maxScroll}px,-50%)`;
      }
      // immediate: true,
    }
  },
  mounted() {
    this.$nextTick(() => {
      //操作dom，添加移动端的触摸事件
      const bar = this.$refs.bar;
      const icon = this.$refs.icon;
      const maxScroll = (this.maxScroll = bar.offsetWidth - icon.offsetWidth);
      // console.log(maxScroll, bar.offsetWidth, icon.offsetWidth, bar);
      let offsetX = 0;
      //设置icon的初始位置
      this.$refs.icon.style.transform = `translate(${this.progress *
        this.maxScroll}px,-50%)`;

      //添加icon事件
      //基于触摸开始的事件开始监听触摸移动和结束的事件
      icon.addEventListener("touchstart", ev => {
        let x = this.progress * maxScroll;
        // console.log("touchstart..." + this.progress);
        //记录开始的位置
        let startX = ev.changedTouches[0].clientX;
        let touchmoveCallback = ev => {
          // console.log("touchmove..");
          //计算偏移量
          offsetX = ev.changedTouches[0].clientX - startX + x;
          //限制偏移量
          if (offsetX < 0) {
            offsetX = 0;
          } else if (offsetX > maxScroll) {
            offsetX = maxScroll;
          }
          // this.progress = offsetX / maxScroll;
          icon.style.transform = `translate(${offsetX}px,-50%)`;
        };

        let touchendCallback = ev => {
          //移除监听
          // console.log("touchend...");
          // x = offsetX;
          this.progress = offsetX / maxScroll;
          document.removeEventListener("touchmove", touchmoveCallback);
          document.removeEventListener("touchend", touchendCallback);
        };
        //添加监听
        icon.addEventListener("touchmove", touchmoveCallback);
        icon.addEventListener("touchend", touchendCallback);
      });
    });
  },
  computed: {
    progress: {
      get() {
        return this.$store.state.player.progress;
      },
      set(newValue) {
        // let url = "";
        // this.$store.dispatch("changeProgress", { newValue, url });
        this.$emit("changeProgressAction", newValue);
      }
    },
    //设置进度条的渐变样式
    //根据progress的变化修改背景，线性渐变效果
    backgroundStyle() {
      return `background-image:linear-gradient(to right, #d44439 0%, #d44439 ${this
        .progress * 100}%, #495a66 ${this.progress * 100}%, #495a66 100%;`;
    }
  }
};
</script>
<style scoped>
.bar-progress {
  /* width: 100%; */
  margin: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bar {
  position: relative;
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 3px;
}
.bar .icon {
  position: absolute;
  top: 50%;
  left: 0;
  /* transform: translate(0, -50%); */
  display: block;
  width: 10px;
  height: 10px;
  border: 5px solid #fff;
  background: #d44439;
  border-radius: 50%;
}
.icon::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}
.text {
  color: #666;
  font-size: 12px;
  margin: 0 5px;
}
</style>
