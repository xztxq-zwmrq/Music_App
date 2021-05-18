const playMode = {
  sequence: 0,//顺序播放
  loop: 1,//循环播放
  random: 2,//随机播放
}
//音乐播放器相关的状态
export default {
  // namespace: true,//定义一个命名空间
  state: {
    //是否全屏播放
    fullScreen: false,
    //是否在播放
    play: false,
    // 播放进度
    progress: 0,
    //播放歌曲列表
    playList: [],
    //顺序歌曲列表
    sequencePlayList: [],
    //播放模式
    mode: playMode.sequence,
    //当前歌曲下标
    currentIndex: -1,
    //当前音乐信息
    currentSong: {},
    //表示子组件bar-progress滑动进度条的事件是否结束
    flag: true,
  },
  getters: {

  },
  actions: {
    setCurrentSong ({ commit }, song) {
      commit('SET_CURRENT_SONG', song);
    },
    changeAction ({ commit }) {
      commit('CHANGE_ACTION');
    },
    changeProgress ({ commit }, { newValue, url }) {
      commit('CHANGE_PROGRESS', { newValue, url });
    },
    setSequencePlayList ({ commit }, newData) {
      commit('SET_SEQUENCE_PLAY_LIST', { newData });
    }
  },
  mutations: {
    SET_CURRENT_SONG (state, song) {
      state.currentSong = song.item;
      state.currentIndex = song.index;
      state.currentSong.url = song.url;
      // state.playList.push(song.item);
      // state.play = true;
    },
    CHANGE_ACTION (state) {
      //当歌曲播放至列表的最后一首时
      if (state.mode === 0 || state.mode === 2) {
        state.play = !state.play;
      }
      else {
        state.progress = 0;
        // state.play = !state.play;
      }
    },
    CHANGE_PROGRESS (state, { newValue, url }) {
      state.progress = newValue;
      if (newValue === 1) {
        //顺序播放音乐
        if (state.mode === 0 || state.mode === 2) {
          state.currentIndex++;
          state.currentSong = state.playList[state.currentIndex];
          state.progress = 0;
          // state.playList.push(state.currentSong);
          state.currentSong.url = url;
        }
        else if (state.mode === 1) {
          state.progress = 0;
        }
      }
    },
    SET_SEQUENCE_PLAY_LIST (state, { newData }) {
      state.sequencePlayList = newData;
      state.playList = newData;
      // state.currentIndex = 0;
      // state.currentSong = newData[0];
    },
    // selectSongByIndex(state, payload) {
    //     state.currentIndex = payload.index;
    // 歌单列表的原始数据需要一直保留，不能被其他事件影响到歌单数据
    //     state.sequencePlayList = [...payload.list];
    // }
    // setPlaying(state,payload) {
    //     state.play = payload.value;
    // }

    // changeProgress(state, payload) {
    //     console.log(payload);
    //     state.progress = payload.value;
    // }
    //修改是否全屏播放
    setFullScreen (state, payload) {
      state.fullScreen = payload.value;
    },
    previousSong (state, payload) {
      state.currentIndex--;
      state.currentSong = state.playList[state.currentIndex];
      state.progress = 0;
      state.currentSong.url = payload.value;
    },
    nextSong (state, payload) {
      state.currentIndex++;
      state.currentSong = state.playList[state.currentIndex];
      state.progress = 0;
      state.currentSong.url = payload.value;
    },
    changePlayModeAction (state) {
      state.mode = ++state.mode % 3;
      //修改播放列表
      if (state.mode === playMode.sequence) {
        state.playList = [...state.sequencePlayList];
      }
      else if (state.mode === playMode.loop) {
        state.playList = [...state.sequencePlayList];
      }
      else if (state.mode === playMode.random) {
        state.playList = [];
        state.sequencePlayList.forEach((item) => {
          let random = Math.floor(Math.random() * (state.playList.length + 1));
          if (random === state.playList.length) {
            state.playList.push(item);
          }
          else {
            let tmp = state.playList[random];
            state.playList[random] = item;
            state.playList.push(tmp);
          }
        });
      }
      state.playList.forEach((item, index) => {
        if (item.name === state.currentSong.name) {
          // console.log(index);
          return state.currentIndex = index;
        }
      })
      state.currentIndex = state.playList.findIndex(item => {
        return item.id === state.currentSong.id;
      })
    }
  }
}