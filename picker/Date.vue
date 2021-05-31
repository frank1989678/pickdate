<template>
  <div class="action-wrap action-picker">
    <div 
      :class="['action-mask', maskCls]"
      @click="maskClick"
    ></div>
    <div :class="['action-body', bodyCls]">
      <div class="action-picker-hd">
        <span
          v-for="item in pickerDateType"
          :key="item.value"
          :class="['btn-mode', {'btn-mode-on': filterDate == item.value}]"
          @click.stop="filterDate = item.value"
        >{{ item.label }}</span>
        <span class="space"></span>
        <span
          class="ok"
          @click.stop="onDateChoose"
        >确定</span>
      </div>
      <!-- 不显示当前选择的 -->
      <template v-if="hideChoose"></template>
      <div
        v-else-if="isPickerDateByDay"
        class="action-picker-date"
      >
        <div
          :class="{on: filterFocus == 1}"
          class="ipt"
          @click.stop="filterFocus = 1"
        >
          <p>开始时间</p>
          <p class="c1">
            {{ startTime | formatData('请选择开始时间') }}
          </p>
        </div>
        <div
          :class="{on: filterFocus == 2}"
          class="ipt"
          @click.stop="filterFocus = 2"
        >
          <p>结束时间</p>
          <p class="c1">
            {{ endTime | formatData('请选择结束时间') }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="action-picker-date"
      >
        <div class="ipt on">
          <p>当前选择</p>
          <p class="c1">
            {{ startMonth | formatData('请选择时间') }}
          </p>
        </div>
      </div>
      <div
        id="datePickerWrap"
      ></div>

      <div 
        v-if="cancelText"
        class="btm"
        @click="onClose"
      >
        <span>{{ cancelText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import './style.vw1080.css';
import utils from '@/utils';

export default {
  name: 'FilterDate',
  filters: {
    // 格式化时间格式 2000-01-01 => 2000年1月1日
    formatData(time, str) {
      // console.log(time)
      return !time
        ? str
        : time
          .replace(/(\d{4})-0?(\d+)/, '$1年$2月')
          .replace(/-0?(\d+)/, '$1日')
          .replace(/ 0?(\d+):\d{2}:\d{2}/, '$1时');
      // if (time.length == 10) {
      //     return time.replace(/(\d{4})-0?(\d+)-0?(\d+)/, '$1年$2月$3日');
      // } else if (time.length == 7) {
      //     return time.replace(/(\d{4})-0?(\d+)/, '$1年$2月');
      // } else {
      //     return time.replace(/(\d{4})-0?(\d+)-0?(\d+) 0?(\d+):\d{2}:\d{2}/, '$1年$2月$3日$4时');
      // }
      // const len = time.length < 8 ? 4 : 8;
      // const nNow = new Date(time.replace(/-/g, '/'));
      // if (time.length == 11) {
      //     // console.log([len, time, str]);
      // }
      // return [nNow.getFullYear(), '年', nNow.getMonth() + 1, '月', nNow.getDate(), '日', nNow.getHours(), '时'].slice(0, len).join('');
      // return str;
    },
  },
  props: {
    // 点击遮罩关闭
    onMaskClose: {
      type: Boolean,
      default: true
    },
    info: {
      type: Object,
      default: () => {},
    },
    cancelText: {
      type: String,
      default: ''
    },
    hideChoose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pickerDateType: [
        { label: '按月筛选', value: 'month' },
        { label: '按日筛选', value: 'day' },
      ],
      filterFocus: 1,
      filterDate: '',
      $picker: null,
      timeRange: false,
      startMonth: '',
      startTime: '',
      endTime: '',
      bodyCls: '',
      maskCls: '',
    };
  },
  computed: {
    isPickerDateByDay() {
      return this.filterDate === 'day';
    },
  },
  watch: {
    // 切换按月查询、按日查询
    filterDate(val) {
      this.destoryPicker();
      let { filterFocus, startTime, endTime, startMonth } = this;
      startTime = (startTime || '').replace(':00:00', '').replace(' ', '-');
      endTime = (endTime || '').replace(':00:00', '').replace(' ', '-');
      const arr = val == 'month' ? startMonth.split('-') : filterFocus == 1 ? startTime.split('-') : endTime.split('-');
      this.onDatePicker(arr);
    },
    // 切换开始时间、结束时间
    filterFocus(val) {
      this.destoryPicker();
      let { startTime, endTime } = this;
      startTime = (startTime || '').replace(':00:00', '').replace(' ', '-');
      endTime = (endTime || '').replace(':00:00', '').replace(' ', '-');
      const arr = val === 1 ? startTime.split('-') : endTime.split('-');
      this.onDatePicker(arr);
    },
  },
  mounted() {
    this.maskCls = 'fixed-fadeIn-enter-active';
    this.bodyCls = 'fixed-slideIn-enter-active';
    this.filterDate = this.info.dateMode || 'day';
    this.startMonth = this.info.startMonth || '';
    this.startTime = this.info.startTime || '';
    this.endTime = this.info.endTime || '';
  },
  methods: {
    onClose() {
      this.maskCls = 'fixed-fadeIn-leave-active';
      this.bodyCls = 'fixed-slideIn-leave-active';
      setTimeout(() => {
        this.$emit('on-close', true);
      }, 300);
    },
    maskClick() {
      this.onMaskClose && this.onClose();
    },
    destoryPicker() {
      this.$picker && this.$picker.hide();
      this.$picker = null;
    },
    onDateChoose() {
      const { isPickerDateByDay, startTime, endTime, startMonth, filterDate, timeRange } = this;
      const arr = isPickerDateByDay ? [startTime, endTime] : [startMonth];

      if (this.hideChoose) {

      } else if (isPickerDateByDay && !endTime) {
        utils.toast('请选择结束时间');
        return;
      } else if (isPickerDateByDay && timeRange) {
        utils.toast('目前仅支持查找6个月跨度的账单');
        // 查询时间跨度大于6个月
        return;
      }

      // 开始时间大于结束时间时，2个时间互换
      if (arr.length == 2) {
        const t1 = new Date(startTime.replace(/-/g, '/'));
        const t2 = new Date(endTime.replace(/-/g, '/'));
        if (t1 > t2) {
          arr[0] = endTime;
          arr[1] = startTime;
        }
      }
      this.destoryPicker();
      this.$emit('on-date-choose', arr, filterDate, this.hideChoose);
      this.onClose();
    },
    onDatePicker(defaultValue) {
      const date = new Date();
      const curHours = date.getHours();
      curHours < 23 && date.setHours(curHours + 1); // 当前时间区间延后一小时
      if (defaultValue.length < 2) {
        defaultValue = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
      }
      const that = this;
      this.$picker = window.MPicker.date({
        id: 'datePicker' + date.getTime(),
        defaultValue,
        start: 2018,
        end: date,
        dd: that.isPickerDateByDay,
        hh: false,
        onChange: function (arr) {
          const sp = arr.length == 3 ? ['-', '-', ''] : arr.length == 2 ? ['-', ''] : ['-', '-', ' ', ''];
          const dateArr = arr.map((item, index) => {
            const num = (item.value < 10 ? '0' : 0) + item.value;
            return num + sp[index];
          });
          dateArr.length == 4 && dateArr.push(':00:00'); // 时间如果有小时，必须带上分和秒，否则不能正常格式化
          if (that.isPickerDateByDay) {
            if (that.filterFocus == 1) {
              that.startTime = dateArr.join('');
            } else {
              that.endTime = dateArr.join('');
            }
          } else {
            that.startMonth = dateArr.join('');
          }
          that.calcTimeRange();
        },
        container: document.getElementById('datePickerWrap'),
      });
    },
    calcTimeRange() {
      const { startTime, endTime } = this;
      if (startTime && endTime) {
        const t1 = new Date(startTime.replace(/-/g, '/')).getTime();
        const t2 = new Date(endTime.replace(/-/g, '/')).getTime();
        this.timeRange = Math.abs(t1 - t2) > 182.5 * 24 * 3600 * 1000;
      } else {
        this.timeRange = false;
      }
    },
  },
};
</script>