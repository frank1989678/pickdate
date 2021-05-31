import dayjs from 'dayjs';

const data = function() {
  return {
    filterForm: {
      startMonth: dayjs().format('YYYY-MM'),
      startTime: dayjs().format('YYYY-MM-DD 00:00:00'),
      endTime: dayjs()
        .add(1, 'hour')
        .format('YYYY-MM-DD HH:59:59'),
      dateMode: 'day',
    },
    dateText: dayjs().format('YYYY年M月D日'),
  };
};
const methods = {
  // 格式化时间格式 2000-01-01 => 2000年1月1日
  formatData(time) {
    return time
      .replace(/(\d{4})-0?(\d+)/, '$1年$2月')
      .replace(/-0?(\d+)/, '$1日')
      .replace(/ 0?(\d+):\d{2}:\d{2}/, '$1时');
  },
  // 切换日期
  onDateChoose(timeArr, dateMode, strArr, hideChoose) {
    const { filterForm } = this;
    if (hideChoose === false && timeArr.length === 2) {
      filterForm.startTime = timeArr[0];
      filterForm.endTime = timeArr[1];
      this.dateText = this.formatData(timeArr[0]) + '-' + this.formatData(timeArr[1]);
    } else {
      filterForm.startMonth = timeArr[0];
      this.dateText = this.formatData(timeArr[0]);
    }
    filterForm.dateMode = dateMode;
    this.searchReset();
  },
  mergeParaDate(para, key1, key2, today) {
    const { startMonth, startTime, endTime, dateMode } = this.filterForm;
    if (dateMode === 'day') {
      para[key1] = startTime;
      para[key2] = endTime;
    } else if (dateMode === 'month') {
      const arr = startMonth.split('-');
      const lastDay = new Date(arr[0], arr[1], 0).getDate();
      para[key1] = startMonth + '-01 00:00:00';
      para[key2] = startMonth + '-' + lastDay + ' 23:59:59';
    } else if (today === 'today') {
      const date = new Date();
      const yymmdd = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        .map(num => {
          return num < 10 ? '0' + num : num;
        })
        .join('-');
      para[key1] = yymmdd;
      para[key2] = yymmdd;
    }
  },
};

export default {
  methods,
  data,
};
