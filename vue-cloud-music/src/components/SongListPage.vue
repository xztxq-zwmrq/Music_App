<template>
  <div class="song-list-page">
    <ul>
      <li
        v-for="(item, index) in data"
        :key="item.id"
        @click="songClickAction(item, index)"
      >
        <p class="index">{{ index + 1 }}</p>
        <div class="content">
          <h3 class="name">{{ item.name }}</h3>
          <p class="info">
            <!-- <span v-for="(singer, index) in item.ar" :key="index"
              >{{ singer.name }}
              <i v-show="index !== item.ar.length - 1">/</i>
            </span> -->
            <span>{{ item.ar }}</span>
            <span> - </span>
            <span>{{ item.al.name }}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    data: Array,
  },
  methods: {
    songClickAction(item, index) {
      let _this = this;
      //   console.log(JSON.stringify(item));
      axios.get(`http://localhost:3000/song/url?id=${item.id}`).then(
        (data) => {
          // console.log(data);
          let url = data.data.data[0].url;
          // console.log(data.data.data[0].url);
          //将用户点击的歌曲下标和当前的歌曲列表传递给store
          // console.log(url);
          _this.$store.dispatch("setCurrentSong", { item, index, url });
          // this.$store.commit({
          //   type:'player/selectSongByIndex',//commit的事件名
          //   index:index,//参数，点击的下标
          //   list:this.data//参数，整个歌单列表
          // });
        },
        (reason) => console.log(reason)
      );
    },
  },
};
</script>
<style scoped>
.song-list-page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}
li {
  border-bottom: 1px solid #ededed;
  overflow: hidden;
}
.index,
.content {
  float: left;
}
.index {
  margin: 10px 0 0 0px;
  width: 40px;
  height: 50px;
  text-align: center;
  font-size: 23px;
  line-height: 50px;
}
.content {
  margin: 10px;
  width: 290px;
}
.content .info {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
