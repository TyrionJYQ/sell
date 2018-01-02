<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="这是你要选购食物的图片">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @add="addFood"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :selectType="selectType"
                        :onlyContent="onlyContent" :desc="desc"
                        :ratings="food.ratings" 
                        @select="selectRating"
                        @toggle="toggleContent"
                        v-show="food.ratings && food.ratings.length">
          </ratingselect>  
          <div class="rating-wrapper">
            <ul  v-show="food.ratings && food.ratings.length">
              <li  v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" alt="用户头像" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>
                  <span class="rating-text">{{rating.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
      
    </div>
    
  </transition>
</template>

<script type='text/ecmascript-6'>
import Vue from "vue";
import BScroll from "better-scroll";
import cartcontrol from "components/cartcontrol/cartcontrol.vue";
import split from "components/split/split.vue";
import ratingselect from "components/ratingselect/ratingselect.vue"
import {formatDate} from 'common/js/date.js';
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    };
  },
  methods: {
    //show方法可以被外部组件（父组件调用，私有方法建议方法名前加"_"）
    show() {
      this.showFlag = true;
      this.seclectType = ALL;
      this.onlyContent = false;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    //点击图片返回按钮返回
    hide() {
      this.showFlag = false;
    },
    //接受cartcontrol组件emit的add然后将target $emit传递给父组件goods组件，使动画生效
    addFood(target) {
      this.$emit("add", target);
    },
    //点击“加入购物车”添加商品
    addFirst(event) {
      this.$emit("add", event.target);
      Vue.set(this.food, "count", 1);
    },
    //接受子组件ratingselect传来的select事件
    selectRating (type,event) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    //是否显示只含内容评价
    toggleContent(event) {
      this.onlyContent = !this.onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    needShow(type,text) {
      if(this.onlyContent && !text) {
        return false;
      }
      if(this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import  "../../common/stylus/mixin.styl"
.food 
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 40
  width: 100%
  background: #fff
  transform: translate3d(0, 0, 0)

  &.move-enter-active, &.move-leave-active 
    transition: all 0.2s linear
  

  &.move-enter, &.move-leave-active 
    transform: translate3d(100%, 0, 0)
  

  .image-header 
    position: relative
    width: 100%
    height: 0
    padding-bottom: 100%
    img 
      position: absolute
      top: 0
      left: 0
      height: 100%
      width: 100%
    .back 
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift 
        display: block
        padding: 10px
        font-size: 20px
        color: #fff
  .content 
    padding: 18px
    position: relative
    .title 
      font-size: 14px
      font-weight: 700
      color: rgb(7, 17, 27)
      line-height: 14px
    .detail 
      padding: 8px 0 18px 0
      font-size: 10px
      color: rgb(147, 153, 159)
      .sell-count 
        marign-right: 12px
    .price 
      font-weight: 700
      line-height: 24px
      .now 
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
        text-decoration: line-through
        font-size: 10px
        color: rgb(147, 153, 159)
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy 
      position: absolute
      right: 12px
      bottom: 18px
      z-index: 40
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      font-size: 10px
      border-radius: 12px
      color: #ffffff
      background: rgb(0, 160, 220)
      &.fade-enter-active, &.fade-leave-active 
        transition: all 0.2s;
      &.fade-enter, &.fade-leave-active 
        opacity: 0
        z-index: -1
  .info
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(7, 17, 27)
    .text
      line-height: 24px
      padding: 0 8px
      font-size: 12px
      color: rgb(77, 85, 93)
  .rating
    padding-top: 18px
    .title
      margin-left: 18px
    .rating-wrapper
      margin: 0 18px
      .rating-item
        padding: 16px 0 
        position: relative
        border-1px(rgba(7,17,27,0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 10px
          font-size: 0
          .name
            display inline-block
            margin-right: 6px
            font-size: 10px
            vertical-align: top
            color: rgb(147,153,159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          font-size: 10px
          color: rgb(147,153,159)
          line-height: 12px
        .text
          font-size: 12px
          color: rgb(7,17,27)
          line-height: 16px
          .icon-thumb_down,.icon-thumb_up
            font-size: 12px
            line-height: 16px
          .icon-thumb_down
            color: rgb(147,153,159)
          .icon-thumb_up
            color: rgb(0,160,220)
      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147, 153, 159)


          
        

          

  

</style>
