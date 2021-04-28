<template>
    <div class="pp-pick-date">
        <div class="mask" :class="maskCls" @click="onClose"></div>
        <div class="body" :class="bodyCls">
            <div class="toolbar">
                <span 
                    @click.stop="filterDate = item.value" 
                    v-for="item in pickerDateType" 
                    :key="item.value"
                    :class="['btn-mode', {'btn-mode-on': filterDate == item.value}]">{{item.label}}</span>
                <span class="space"></span>
                <span class="btn-ok" @click.stop="onDateChoose">确定</span>
            </div>
            <div class="date" v-if="isPickerDateByDay">
                <div class="ipt" :class="{on: filterFocus == 1}" @click.stop="filterFocus = 1">
                    <p>开始时间</p>
                    <p class="c1">{{startTime | formatData('请选择开始时间')}}</p>
                </div>
                <div class="ipt" :class="{on: filterFocus == 2}" @click.stop="filterFocus = 2">
                    <p>结束时间</p>
                    <p class="c1">{{endTime | formatData('请选择结束时间')}}</p>
                </div>
            </div>
            <div class="date" v-else>
                <div class="ipt on">
                    <p>当前选择</p>
                    <p class="c1">{{startMonth | formatData('请选择时间')}}</p>
                </div>
            </div>
            <div class="calendar" id="datePickerWrap"></div>
            <div class="btm">
                <div class="close" @click="onClose">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
import './style.css';
import utils from '@/utils'
export default {
    name: 'FilterDate',
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    filters: {
        // 格式化时间格式 2000-01-01 => 2000年1月1日
        formatData(time, str) {
            // console.log(time)
            return !time ? str : time
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
        }
    },
    data() {
        return {
            pickerDateType: [
                {label: '按月筛选', value: 'month'},
                {label: '按日筛选', value: 'day'}
            ],
            filterFocus: 1,
            filterDate: '',
            $picker: null,
            timeRange: false,
            startMonth: '',
            startTime: '',
            endTime: '',
            show: true
        }
    },
    computed: {
        isPickerDateByDay() {
            return this.filterDate === 'day';
        },
        maskCls() {
            return this.show ? 'weui-animate-fade-in' : 'weui-animate-fade-out';
        },
        bodyCls() {
            return this.show ? 'weui-animate-slide-up' : 'weui-animate-slide-down';
        }
    },
    watch: {
        // 切换按月查询、按日查询
        filterDate(val) {
            this.destoryPicker();
            let {filterFocus, startTime, endTime, startMonth} = this;
            startTime = (startTime || '').replace(':00:00', '').replace(' ', '-');
            endTime = (endTime || '').replace(':00:00', '').replace(' ', '-');
            const arr = val == 'month' ? startMonth.split('-') : filterFocus == 1 ? startTime.split('-') : endTime.split('-');
            this.onDatePicker(arr);
        },
        // 切换开始时间、结束时间
        filterFocus(val) {
            this.destoryPicker();
            let {startTime, endTime} = this;
            startTime = (startTime || '').replace(':00:00', '').replace(' ', '-');
            endTime = (endTime || '').replace(':00:00', '').replace(' ', '-');
            const arr = val === 1 ? startTime.split('-') : endTime.split('-');
            this.onDatePicker(arr);
        }
    },
    methods: {
        onClose() {
            this.show = false;
            setTimeout(() => {
                this.$emit('on-close', true);
            }, 300)
        },
        destoryPicker() {
            this.$picker && this.$picker.hide();
            this.$picker = null;
        },
        onDateChoose() {
            const {isPickerDateByDay, startTime, endTime, startMonth, filterDate, timeRange} = this;
            const arr = isPickerDateByDay ? [startTime, endTime] : [startMonth];

            if (isPickerDateByDay && !endTime) {
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
            this.$emit('on-date-choose', arr, filterDate);
            this.onClose();
        },
        onDatePicker(defaultValue) {
            const date = new Date;
            const curHours = date.getHours();
            curHours < 23 && date.setHours(curHours + 1); // 当前时间区间延后一小时
            if (defaultValue.length < 2) {
                defaultValue = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
            }
            const that = this;
            this.$picker = datePicker({
                id: 'datePicker' + date.getTime(),
                defaultValue,
                start: 2018,
                end: date,
                hh: false,
                dd: that.isPickerDateByDay,
                onChange: function(arr) {
                    const sp = arr.length == 3 ? ['-', '-', ''] : arr.length == 2 ? ['-', ''] : ['-', '-', ' ', ''];
                    const dateArr = arr.map((item, index) => {
                        const num = (item.value < 10 ? '0' : 0) + item.value;
                        return num + sp[index];
                    })
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
                container: document.getElementById('datePickerWrap')
            });
        },
        calcTimeRange() {
            const {startTime, endTime} = this;
            if (startTime && endTime) {
                const t1 = new Date(startTime.replace(/-/g, '/')).getTime();
                const t2 = new Date(endTime.replace(/-/g, '/')).getTime();
                this.timeRange = Math.abs(t1 - t2) > 182.5 * 24 * 3600 * 1000;
            } else {
                this.timeRange = false;
            }
        }
    },
    mounted() {
        this.filterDate = this.info.dateMode || 'day';
        this.startMonth = this.info.startMonth || '';
        this.startTime = this.info.startTime || '';
        this.endTime = this.info.endTime || '';
    }
}
</script>