import Vue from 'vue';
import Vuex from 'vuex';
import player from './modules/player'

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,//此时状态state只能通过mutations进行修改
    //设置仓库的子模块
    modules: {
        player,
    }
})