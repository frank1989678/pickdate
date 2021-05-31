<template>
  <div class="action-wrap action-sheet">
    <div 
      :class="['action-mask', maskCls]"
      @click="maskClick"
    ></div>
    <div :class="['action-body', bodyCls]">
      <slot>
        <div class="action-ul">
          <div 
            v-if="confirmText" 
            class="action-flex action-confirm"
          >
            <span>{{ confirmText }}</span>
          </div>
          <div 
            v-for="item in menu"
            :key="item.value"
            :style="item.color ? `color:${item.color}` : ''"
            class="action-flex action-li"
            @click="tapItem(item)"
          >
            <span>{{ item.label }}</span>
          </div>
        </div>
      </slot>

      <div 
        v-if="cancelText"
        class="action-ul action-cancel"
      >
        <span 
          class="action-flex action-li" 
          @click="onClose"
        >{{ cancelText }}</span>
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
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bodyCls: '',
      maskCls: '',
      lockBtn: true
    };
  },
  computed: {
  },
  created() {
    this.maskCls = 'fixed-fadeIn-enter-active';
    this.bodyCls = 'fixed-slideIn-enter-active';
    setTimeout( () => {
      this.lockBtn = false;
    }, 320);
  },
  methods: {
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
    tapItem(item) {
      this.$emit('click:item', item);
      this.onClose();
    },
  }
};
</script>