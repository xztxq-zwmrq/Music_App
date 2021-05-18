<template>
  <div id="app">
    <SongListPage :data="dataSource" :class="{ hasPadding: showPlay }" />
    <!-- <Player v-show="currentIndex !== -1" /> -->
    <Player v-show="showPlay" />
  </div>
</template>

<script>
import SongListPage from "./components/SongListPage";
import Player from "./player/index";
import axios from "axios";
import { mapState } from "vuex";
export default {
  components: { SongListPage, Player },
  data() {
    return {
      dataSource: []
    };
  },
  computed: {
    // ...mapState(["currentIndex"]),
    ...mapState({
      showPlay: state => state.player.currentIndex !== -1
    })
  },
  //在created时，已经可以操作数据属性
  created() {
    //获取歌手的歌曲列表
    axios
      //7424歌手程响id；3684林俊杰；张杰6472
      .get("http://localhost:3000/artists?id=3684")
      .then(data => {
        //数据过滤
        const newData = data.data.hotSongs.map(item => ({
          id: item.id,
          name: item.name,
          // ar: item.ar,
          ar: item.ar.map(arItem => arItem.name).join("/"),
          al: {
            name: item.al.name,
            picUrl: item.al.picUrl
          }
        }));
        //将数据赋值给当前组件的属性
        this.dataSource = newData;
        // console.log(this.dataSource);
        this.$store.dispatch("setSequencePlayList", newData);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.hasPadding {
  padding-bottom: 60px;
}
</style>
