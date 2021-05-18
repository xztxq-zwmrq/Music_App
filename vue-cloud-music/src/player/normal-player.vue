<!--全屏的大播放器-->
<template>
  <div class="normal-player-container">
    <!-- 背景 -->
    <div class="background">
      <img
        :src="
          player.currentSong
            ? player.currentSong.al.picUrl
            : 'https://p1.music.126.net/k5r1GC-erKK4WcDmzyrsIw==/109951165648878421.jpg'
        "
        alt=""
        width="100%"
        height="100%"
      />
    </div>
    <!-- 蒙层 -->
    <div class="background layer"></div>
    <!-- 头部 -->
    <div class="top">
      <div class="back">
        <i class="iconfont icon-arrow_down" @click="outerFullScreen"></i>
      </div>
      <h1 class="title">
        {{ player.currentSong ? player.currentSong.name : "四季予你" }}
      </h1>
      <h2 class="subtitle">
        {{ player.currentSong ? player.currentSong.ar : "程响" }}
      </h2>
    </div>
    <!-- 中间的唱片 -->
    <div class="middle">
      <div class="CD-wrapper">
        <img
          :src="
            player.currentSong
              ? player.currentSong.al.picUrl
              : 'https://p1.music.126.net/k5r1GC-erKK4WcDmzyrsIw==/109951165648878421.jpg'
          "
          alt=""
          class="image"
          :class="{ pause: !player.play }"
        />
      </div>
    </div>
    <!-- 底部操作按钮 -->
    <div class="bottom">
      <barProgress
        :currentTime="currentTime"
        :duration="duration"
        @changeProgressAction="changeProgressAction"
      />
      <div class="operators">
        <div class="icon i-left">
          <i
            class="iconfont"
            :class="playModeIcon"
            @click="changePlayModeAction"
          ></i>
        </div>
        <div class="icon i-left">
          <i class="iconfont icon-shangyishou" @click="preSong"></i>
        </div>
        <div class="icon i-center">
          <i
            class="iconfont"
            @click="changAction"
            :class="{
              'icon-bofang': player.play,
              'icon-zanting': !player.play
            }"
          ></i>
        </div>
        <div class="icon i-right">
          <i class="iconfont icon-xiayishou" @click="nextSong"></i>
        </div>
        <div class="icon i-right">
          <i class="iconfont icon-yinleliebiao"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import barProgress from "./children/bar-progress";
import axios from "axios";
export default {
  props: { currentTime: Number, duration: Number },
  components: {
    barProgress
  },
  computed: {
    ...mapState(["player"]),
    // currentSong() {
    //   return this.$store.state.player.currentSong;
    // },
    // mode() {
    //   if (this.player.mode === 0) {
    //     return "icon-shunxubofang";
    //   } else if (this.player.mode === 1) {
    //     return "icon-xunhuanbofang";
    //   } else {
    //     return "icon-suijibofang";
    //   }
    // }
    mode() {
      return this.player.mode;
    },
    //当前播放模式图标
    playModeIcon() {
      switch (this.mode) {
        case 0:
          return "icon-shunxubofang";
        case 1:
          return "icon-xunhuanbofang";
        case 2:
          return "icon-suijibofang";
      }
    }
  },
  methods: {
    changAction() {
      this.$store.dispatch("changeAction");
    },
    outerFullScreen() {
      this.$store.commit({
        type: "setFullScreen",
        value: false
      });
    },
    preSong() {
      if (this.$store.state.player.currentIndex > 0) {
        let index = this.$store.state.player.currentIndex - 1;
        let song = this.$store.state.player.playList[index];
        axios.get(`http://localhost:3000/song/url?id=${song.id}`).then(
          data => {
            let url = data.data.data[0].url;
            // console.log(url);
            // this.$store.dispatch("previousSong", { url });
            this.$store.commit({
              type: "previousSong",
              value: url
            });
          },
          reason => console.log(reason)
        );
      }
    },
    nextSong() {
      if (this.$store.state.player.currentIndex < 49) {
        let index = this.$store.state.player.currentIndex + 1;
        let song = this.$store.state.player.playList[index];
        axios.get(`http://localhost:3000/song/url?id=${song.id}`).then(
          data => {
            let url = data.data.data[0].url;
            // console.log(url);
            // this.$store.dispatch("previousSong", { url });
            this.$store.commit({
              type: "nextSong",
              value: url
            });
          },
          reason => console.log(reason)
        );
      }
    },
    //进度条组件，修改进度的事件
    changeProgressAction(value) {
      // console.log(value);
      this.$emit("changeProgressAction", value);
    },
    //修改播放模式
    changePlayModeAction() {
      this.$store.commit({
        type: "changePlayModeAction"
      });
    }
  }
};
</script>
<style scoped>
.normal-player-container {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #eee;
}
.background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.5;
  /* 设置模糊 */
  filter: blur(15px);
}
.layer {
  background: #aaa;
  opacity: 0.2;
  filter: none;
}
.top {
  position: relative;
  margin-bottom: 25px;
}
.back {
  position: absolute;
  top: 0;
  left: 6px;
}
.back .iconfont {
  display: block;
  padding: 9px;
  font-size: 24px;
  color: #333;
  font-weight: 700;
}
.title {
  width: 70%;
  margin: 0 auto;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  color: #333;
}
.subtitle {
  line-height: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
}
.middle {
  position: absolute;
  margin: auto;
  top: 85px;
  left: 0;
  right: 0;
  width: 80%;
  /* 设置高为屏幕宽的80% */
  height: 80vw;
  box-sizing: border-box;
}
.CD-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 50%;
  border: 50px solid #000;
  animation: rotate 20s linear infinite;
}
.pause {
  animation-play-state: paused;
}
.bottom {
  position: absolute;
  left: 0;
  bottom: 50px;
  width: 100%;
}
.operators {
  display: flex;
  align-items: center;
  text-align: center;
}
.icon {
  font-weight: 700;
  flex: 1;
  color: #2e3030;
}
.icon i {
  font-size: 30px;
}
.icon .icon-yinleliebiao {
  font-size: 40px;
}
</style>
