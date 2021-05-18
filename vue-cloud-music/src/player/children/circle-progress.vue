<template>
  <div class="circle-progress" @click.stop="changAction">
    <span
      class="iconfont"
      :class="{
        'icon-bofang': player.play,
        'icon-zanting': !player.play
      }"
    ></span>
    <canvas class="canvas" ref="canvas"></canvas>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    // progress: Number,
  },
  data() {
    return {
      // progress: this.$store.state["progress"],//undefined
      //进度值不会随着仓库中的值改变，只有计算属性中的变量监视属性才生效
      // progress: this.$store.state["player"].progress,
    };
  },
  computed: {
    ...mapState(["player"]),
    progress() {
      // console.log(this.$store.state["progress"]);//undefined
      // console.log(this.$store.state["player"]);
      return this.$store.state["player"].progress;
    }
  },
  methods: {
    changAction() {
      this.$store.dispatch("changeAction");
    },
    renderAction() {
      //清除上一次的绘制
      this.context.clearRect(0, 0, 60, 60);
      //绘制整个圆环
      this.context.save();
      this.context.beginPath();
      //绘制大圆
      this.context.moveTo(30, 30);
      this.context.arc(30, 30, 30, 0, 2 * Math.PI, false);
      this.context.lineTo(30, 30);
      //绘制小圆
      this.context.moveTo(30, 30);
      this.context.arc(30, 30, 24, 0, 2 * Math.PI, false);
      this.context.lineTo(30, 30);
      this.context.closePath();
      this.context.fillStyle = "rgba(212,68,57,.3)";
      this.context.fill("evenodd");
      this.context.restore();

      //绘制整个小的圆弧
      this.context.save();
      this.context.beginPath();
      //绘制大圆
      this.context.moveTo(30, 30);
      this.context.arc(
        30,
        30,
        30,
        (-1 * Math.PI) / 2,
        2 * Math.PI * this.progress - Math.PI / 2,
        // 2 * Math.PI * this.player.progress - Math.PI / 2,
        false
      );
      this.context.lineTo(30, 30);
      //绘制小圆,-1*Math.PI/2表示绘制圆弧从y轴开始
      this.context.moveTo(30, 30);
      this.context.arc(
        30,
        30,
        24,
        (-1 * Math.PI) / 2,
        2 * Math.PI * this.progress - Math.PI / 2,
        // 2 * Math.PI * this.player.progress - Math.PI / 2,
        false
      );
      this.context.lineTo(30, 30);
      this.context.closePath();
      this.context.fillStyle = "rgba(212,68,57,1)";
      this.context.fill("evenodd");
      this.context.restore();
    }
  },
  mounted() {
    const canvas = this.$refs.canvas;
    //设置画布大小
    canvas.width = 60;
    canvas.height = 60;
    //获取画布的上下文
    this.context = canvas.getContext("2d");
    this.renderAction();
  },
  watch: {
    progress() {
      this.renderAction();
    }
  }
};
</script>
<style scoped>
.circle-progress {
  width: 30px;
  height: 30px;
  position: relative;
}
.iconfont {
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  /* border-radius: 1px solid #; */
  color: #d54831;
}
.icon-bofang {
  left: 50%;
}
.canvas {
  position: absolute;
  /* 不能在css中给画布设置大小，因为设置了大小就对画布进行了拉伸 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
