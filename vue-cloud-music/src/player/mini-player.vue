<!--底部的小播放器-->
<template>
  <div class="mini-player-container" @click="enterFullScreenAction">
    <!-- 专辑图片 -->
    <div class="icon">
      <div class="img-wrapper">
        <img
          :src="player.currentSong.al ? player.currentSong.al.picUrl : ''"
          alt=""
          class="play"
          :class="{ pause: !player.play }"
        />
      </div>
    </div>
    <!-- 歌曲信息 -->
    <div class="text">
      <h2 class="name">{{ player.currentSong.name }}</h2>
      <p class="desc">{{ player.currentSong.ar }}</p>
    </div>
    <!-- 播放图标 -->
    <!-- <circleProgress :progress="progress" /> -->
    <circleProgress />
    <!-- <circleProgress v-model="player.play"/> -->
    <!-- 如果v-model绑定的是仓库中的状态，那么不能再使用v-model;如果使用的话，就以为着修改状态，此时可以将v-model进行拆分 -->
    <!-- <circleProgress :value="player.play" @input="changePlayingAction"/> -->
    <!-- 歌曲列表图标 -->
    <!-- 设置列表的点击事件停止冒泡 -->
    <div class="control" @click.stop="">
      <span class="iconfont icon-yinleliebiao"></span>
    </div>
  </div>
</template>
<script>
import circleProgress from "./children/circle-progress";
import { mapState } from "vuex";
export default {
  props: {
    //获取进度
    // progress: Number,
  },
  components: {
    circleProgress,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["player"]),
    // currentSong() {
    //   console.log(this.$store.state["currentSong"]);
    //   return this.$store.state["currentSong"];
    // },
    // 将仓库中的状态state转换为组件的计算属性
    // ...mapState({
    //   play:(state)=>state.player.play,
    // })
  },
  methods: {
    // changePlayingAction(value) {
    //   this.$store.commit({
    //     type:'player/setPlaying',
    //     value,
    //   });
    // },
    //进入全屏播放的点击事件
    enterFullScreenAction() {
      // console.log("enter...");
      this.$store.commit({
        // type: "player/setFullScreen",报错
        type: "setFullScreen",
        value: true,
      });
    },
  },
};
</script>
<style scoped>
* {
  padding: 0;
  margin: 0;
}
.mini-player-container {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background: #fff;
}
.icon {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  padding: 0 10px 0 20px;
}
.img-wrapper {
  width: 100%;
  height: 100%;
}
img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: rotate 10s linear infinite;
}
.pause {
  animation-play-state: paused;
}
.text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 20px;
}
.name {
  margin-bottom: 2px;
  font-size: 14px;
  color: #333;
}
.desc {
  font-size: 12px;
  color: #999;
}
.control {
  flex: 0 0 30px;
  padding: 0 10px;
  color: #d44439;
}
.icon-yinleliebiao {
  font-size: 45px;
}
</style>
