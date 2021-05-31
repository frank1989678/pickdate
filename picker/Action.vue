<template>
  <div class="action-wrap action-picker">
    <div 
      :class="['action-mask', maskCls]"
      @click="maskClick"
    ></div>
    <div :id="pickerId" :class="['action-body', bodyCls]">
      <div class="action-picker-hd">
        <span class="cancel" @click="onClose">取消</span>
        <span>{{ title }}</span>
        <span class="ok" @click="onChoose">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import './style.vw1080.css';

export default {
  name: 'ActionSheet',
  props: {
    // 点击遮罩关闭
    onMaskClose: {
      type: Boolean,
      default: true
    },
    menu: {
      type: Array,
      default: function() {
        return [];
      }
    },
    defaultValue: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pickerId: '',
      bodyCls: '',
      maskCls: '',
      lockBtn: true
    };
  },
  computed: {
  },
  created() {
    this.pickerId = 'pciker' + Date.now();
    this.maskCls = 'fixed-fadeIn-enter-active';
    this.bodyCls = 'fixed-slideIn-enter-active';
    setTimeout( () => {
      this.init();
    }, 10);
    setTimeout( () => {
      this.lockBtn = false;
    }, 320);
  },
  methods: {
    init() {
      let that = this;
      window.MPicker.picker(this.menu, {
        container: document.getElementById(this.pickerId),
        defaultValue: that.defaultValue,
        onChange: function(arr) {
          that.currItem = arr;
        }
      });
    },
    maskClick() {
      this.onMaskClose && this.onClose();
    },
    // 关闭弹框
    onClose() {
      if (this.lockBtn) return;
      this.lockBtn = true;
      this.maskCls = 'fixed-fadeIn-leave-active';
      this.bodyCls = 'fixed-slideIn-leave-active';
      setTimeout( () => {
        this.$emit('click:close');
      }, 300);
    },
    onChoose() {
      this.$emit('click:ok', this.currItem);
      this.onClose();
    },
  }
}
</script>