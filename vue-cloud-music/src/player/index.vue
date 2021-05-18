<!--播放器的整体结构-->
<template>
  <div class="player-wrap">
    <!-- <MiniPlayer :progress="progress" /> -->
    <MiniPlayer v-show="!fullScreen" />
    <NormalPlayer
      v-if="fullScreen"
      :duration="duration"
      :currentTime="currentTime"
      @changeProgressAction="changeProgressAction"
    />
    <!-- 注意下面的写法报错 -->
    <!-- <audio
      refs="audio"
      :src="`https://music.163.com/song/media/outer/url?id=${id}.mp3`"
    ></audio> -->
    <audio ref="audio" :src="url"></audio>
  </div>
</template>
<script>
import MiniPlayer from "./mini-player";
import NormalPlayer from "./normal-player";
import { mapGetters, mapState } from "vuex";
import axios from "axios";
export default {
  components: {
    MiniPlayer,
    NormalPlayer
  },
  data() {
    return {
      //audio当前的时长
      currentTime: 0,
      //audio的总时长
      duration: 0
    };
  },
  computed: {
    //从仓库中获得仓库的计算属性，转换为组件的计算属性
    // ...mapGetters({
    //   //获取仓库模块player的getters中的currentSong函数的返回值
    //   currentSong: "player/currentSong",
    // }),
    currentSong() {
      return this.$store.state.player.currentSong;
    },
    //从仓库中获得仓库的state，转化为组件的计算属性
    ...mapState({
      play: state => state.player.play,
      fullScreen: state => state.player.fullScreen
    }),
    //计算歌曲id
    url() {
      return this.currentSong.url;
    },
    //进度百分比
    progress() {
      let result = isNaN(this.currentTime / this.duration)
        ? 0
        : this.currentTime / this.duration;
      // console.log(result);
      // this.$store.commit({
      //   type: "player/changeProgress",
      //   result,
      // });
      return result;
    }
  },
  watch: {
    //监听播放状态
    play(newValue) {
      //等待dom渲染好后在执行
      this.$nextTick(() => {
        // console.log(newValue, this.audio, this);
        if (newValue) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      });
    },
    // currentSong(newValue) {
    //   this.$nextTick(() => {
    //     // console.log(newValue, this.audio, this);
    //     if (this.play) {
    //       this.audio.play();
    //     } else {
    //       this.audio.pause();
    //     }
    //   });
    // },
    // currentSong() {这里监听的currentSong是对象(数据更新无法监听到)
    url() {
      //判断是否播放
      if (!this.play) {
        return;
      }
      this.$nextTick(() => {
        this.audio.load(); //当音乐url改变时重新加载歌曲数据
        this.audio.play();
      });
    },
    progress(newValue) {
      //下面写法报错
      // this.$store.commit({
      //   type: "player/changeProgress",
      //   newValue,
      // });
      if (newValue === 1) {
        if (this.$store.state.player.currentIndex < 49) {
          let index = this.$store.state.player.currentIndex + 1;
          let song = this.$store.state.player.playList[index];
          // state.playList.push(state.currentSong);
          axios.get(`http://localhost:3000/song/url?id=${song.id}`).then(
            data => {
              let url = data.data.data[0].url;
              // console.log(url);
              this.$store.dispatch("changeProgress", { newValue, url });
            },
            reason => console.log(reason)
          );
        } else {
          this.$store.dispatch("changeAction");
        }
        if (this.play) {
          this.$nextTick(() => {
            // this.audio.load(); //当循环模式时,不需要重新加载歌曲数据,url没变；写了会报错
            this.audio.play();
          });
        }
      } else {
        let url = "";
        this.$store.dispatch("changeProgress", { newValue, url });
      }
    }
  },
  mounted() {
    //组件挂载好后，dom渲染完毕，获得audio标签，设置在this上，方便以后访问
    this.audio = this.$refs.audio;
    // console.log(this, this.audio);

    this.audio.addEventListener("canplay", () => {
      //audio可以播放时，获取音乐总时长
      this.duration = this.audio.duration;
    });

    //音乐播放的过程中时间的更新事件
    // this.audio.addEventListener("timeUpdate", () => {
    this.audio.addEventListener("timeupdate", () => {
      // console.log(this.audio.currentTime);
      this.currentTime = this.audio.currentTime;
    });
  },
  methods: {
    changeProgressAction(value) {
      this.audio.currentTime = value * this.audio.duration;
    }
  }
};
</script>
<style></style>
