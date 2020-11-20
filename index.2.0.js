!(function(window, document) {
    function noop() {};
    function depthOf(object) {
        var depth = 1;
        if (object.children && object.children[0]) {
            depth = depthOf(object.children[0]) + 1
        }
        return depth
    }
    function setTransition($target, time) {
        return $target.css({
            '-webkit-transition': 'all ' + time + 's',
            'transition': 'all ' + time + 's'
        })
    };
    function setTranslate($target, diff) {
        return $target.css({
            '-webkit-transform': 'translate3d(0, ' + diff + 'px, 0)',
            'transform': 'translate3d(0, ' + diff + 'px, 0)'
        })
    };
    function getDefaultIndex(items) {
        var current = Math.floor(items.length / 2);
        var count = 0;
        while (!!items[current] && items[current].disabled) {
            current = ++current % items.length;
            count++;
            if (count > items.length) {
                throw new Error('No selectable item.');
            }
        }
        return current
    };
    function getDefaultTranslate(offset, rowHeight, items) {
        var currentIndex = getDefaultIndex(items);
        return (offset - currentIndex) * rowHeight
    };
    function getMax(offset, rowHeight) {
        return offset * rowHeight
    };
    function getMin(offset, rowHeight, length) {
        return -(rowHeight * (length - offset - 1))
    };

    var $ = (function(document, s_addEventListener, s_querySelectorAll) {
        function $(s, context, bala) {
            bala = Object.create($.fn);
            s && bala.push.apply(bala, s[s_addEventListener] ? [s] : "" + s === s ? /</.test(s) ? ((context = document.createElement(context || s_addEventListener)).innerHTML = s, context.children) : context ? ((context = $(context)[0]) ? context[s_querySelectorAll](s) : bala) : document[s_querySelectorAll](s) : typeof s == 'function' ? document.readyState[7] ? s() : document[s_addEventListener]('DOMContentLoaded', s) : s);
            return bala
        }
        $.fn = [];
        $.fn.append = function append($child) {
            if (!($child instanceof HTMLElement)) {
                $child = $child[0]
            }
            this.forEach(function($element) {
                $element.appendChild($child)
            });
            return this
        };
        $.fn.remove = function remove() {
            this.forEach(function($element) {
                $element.parentNode.removeChild($element)
            });
            return this
        };
        $.fn.find = function find(selector) {
            return $(selector, this)
        };
        $.fn.addClass = function addClass(className) {
            if (!className) return this;
            this.forEach(function($element) {
                $element.classList.add(className)
            });
            return this
        };
        $.fn.removeClass = function removeClass(className) {
            this.forEach(function($element) {
                $element.classList.remove(className)
            });
            return this
        };
        $.fn.eq = function eq(index) {
            return $(this[index])
        };
        $.fn.html = function html(_html) {
            this.forEach(function($element) {
                $element.innerHTML = _html
            });
            return this
        };
        $.fn.css = function css(obj) {
            var _this = this;
            Object.keys(obj).forEach(function(key) {
                _this.forEach(function($element) {
                    $element.style[key] = obj[key]
                })
            });
            return this
        };
        $.fn.on = function on(eventType, selector, handler) {
            var isDelegate = typeof selector === 'string' && typeof handler === 'function';
            if (!isDelegate) {
                handler = selector
            }
            this.forEach(function($element) {
                eventType.split(' ').forEach(function(event) {
                    $element.addEventListener(event, function(evt) {
                        if (isDelegate) {
                            if (this.contains(evt.target.closest(selector))) {
                                handler.call(evt.target, evt)
                            }
                        } else {
                            handler.call(this, evt)
                        }
                    })
                })
            });
            return this
        };
        $.fn.offAll = function offAll() {
            var _this2 = this;
            this.forEach(function($element, index) {
                var clone = $element.cloneNode(true);
                $element.parentNode.replaceChild(clone, $element);
                _this2[index] = clone
            });
            return this
        };
        $.fn.scroll = function scroll(options) {
            var _this = this;
            var defaults = Object.assign({
                items: [],
                scrollable: '.calendar-ul',
                offset: 3,
                rowHeight: 34,
                onChange: noop,
                temp: null,
                bodyHeight: 7 * 34
            }, options);
            var items = defaults.items.map(function(item) {
                return '<div class="calendar-item">' + item.value + '</div>';
            }).join('');
            var $this = $(this);
            var obj = defaults.items[0];
            $this.find('.calendar-ul').html(items);
            $this.find('.calendar-unit').html(obj.label).addClass(obj.cls);
            var $scrollable = $this.find(defaults.scrollable);
            var start = void 0;
            var end = void 0;
            var startTime = void 0;
            var translate = void 0;
            var points = [];
            var windowHeight = window.innerHeight;
            var currItemLight = function(index) {
                $scrollable.find('.calendar-item').removeClass('calendar-item-light').eq(index).addClass('calendar-item-light');
            }
            if (defaults.temp !== null && defaults.temp < defaults.items.length) {
                var index = defaults.temp;
                defaults.onChange.call(this, defaults.items[index], index);
                translate = (defaults.offset - index) * defaults.rowHeight;
                currItemLight(index);
            } else {
                var _index = getDefaultIndex(defaults.items);
                defaults.onChange.call(this, defaults.items[_index], _index);
                translate = getDefaultTranslate(defaults.offset, defaults.rowHeight, defaults.items);
                currItemLight(_index);
            }
            setTranslate($scrollable, translate);
            var stop = function stop(diff) {
                translate += diff;
                translate = Math.round(translate / defaults.rowHeight) * defaults.rowHeight;
                var max = getMax(defaults.offset, defaults.rowHeight);
                var min = getMin(defaults.offset, defaults.rowHeight, defaults.items.length);
                if (translate > max) {
                    translate = max
                }
                if (translate < min) {
                    translate = min
                }
                var index = defaults.offset - translate / defaults.rowHeight;
                while (!!defaults.items[index] && defaults.items[index].disabled) {
                    diff > 0 ? ++index : --index
                }
                translate = (defaults.offset - index) * defaults.rowHeight;
                setTransition($scrollable, .3);
                setTranslate($scrollable, translate);
                defaults.onChange.call(_this, defaults.items[index], index);
                currItemLight(index);
            };

            function _start(pageY) {
                start = pageY;
                startTime = +new Date()
            }

            function _move(pageY) {
                end = pageY;
                var diff = end - start;
                var posY = translate + diff;
                var max = getMax(defaults.offset, defaults.rowHeight) + defaults.rowHeight;
                var min = getMin(defaults.offset, defaults.rowHeight, defaults.items.length) - defaults.rowHeight;
                if (posY > max) {
                    posY = max;
                }
                if (posY < min) {
                    posY = min;
                }
                var index = Math.round(defaults.offset - posY / defaults.rowHeight);
                currItemLight(index);
                setTransition($scrollable, 0);
                setTranslate($scrollable, posY);
                startTime = +new Date();
                points.push({
                    time: startTime,
                    y: end
                });
                if (points.length > 40) {
                    points.shift()
                }
            }

            function _end(pageY) {
                if (!start) return;
                var endTime = new Date().getTime();
                var relativeY = windowHeight - defaults.bodyHeight / 2;
                end = pageY;
                if (endTime - startTime > 100) {
                    if (Math.abs(end - start) > 10) {
                        stop(end - start)
                    } else {
                        stop(relativeY - end)
                    }
                } else {
                    if (Math.abs(end - start) > 10) {
                        var endPos = points.length - 1;
                        var startPos = endPos;
                        for (var i = endPos; i > 0 && startTime - points[i].time < 100; i--) {
                            startPos = i
                        }
                        if (startPos !== endPos) {
                            var ep = points[endPos];
                            var sp = points[startPos];
                            var t = ep.time - sp.time;
                            var s = ep.y - sp.y;
                            var v = s / t;
                            var diff = v * 150 + (end - start);
                            stop(diff)
                        } else {
                            stop(0)
                        }
                    } else {
                        stop(relativeY - end)
                    }
                }
                start = null
            }
            $scrollable = $this.offAll().on('touchstart', function(evt) {
                _start(evt.changedTouches[0].pageY)
            }).on('touchmove', function(evt) {
                _move(evt.changedTouches[0].pageY);
                evt.preventDefault()
            }).on('touchend', function(evt) {
                _end(evt.changedTouches[0].pageY)
            }).find(defaults.scrollable);
            var isSupportTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;
            if (!isSupportTouch) {
                $this.on('mousedown', function(evt) {
                    _start(evt.pageY);
                    evt.stopPropagation();
                    evt.preventDefault()
                }).on('mousemove', function(evt) {
                    if (!start) return;
                    _move(evt.pageY);
                    evt.stopPropagation();
                    evt.preventDefault()
                }).on('mouseup mouseleave', function(evt) {
                    _end(evt.pageY);
                    evt.stopPropagation();
                    evt.preventDefault()
                })
            }
        }
        return $;
    })(document, 'addEventListener', 'querySelectorAll');

    var _sington = void 0;

    function picker(items, options) {
        var defaults = Object.assign({
            id: 'default',
            className: '',
            container: 'body',
            onChange: noop,
            onClose: noop
        }, options);
        var result = [];
        var lineTemp = [];
        var $picker = $('<div class=calendar-bd></div>');

        function hide(callback) {
            hide = noop;
            $picker.remove();
            _sington = null;
            defaults.onClose();
            callback && callback()
        }
        function scroll(items, level) {
            if (lineTemp[level] === undefined && defaults.defaultValue && defaults.defaultValue[level] !== undefined) {
                var defaultVal = defaults.defaultValue[level];
                var index = 0;
                var len = items.length;
                for (; index < len; ++index) {
                    if (defaultVal == items[index].value) break
                }
                if (index < len) {
                    lineTemp[level] = index;
                } else {
                    console.warn('Picker has not match defaultValue: ' + defaultVal)
                }
            }
            $picker.find('.calendar-group').eq(level).scroll({
                items: items,
                temp: lineTemp[level],
                onChange: function onChange(item, index) {
                    result[level] = item || null;
                    lineTemp[level] = index;
                    if (item.children && item.children.length > 0) {
                        scroll(item.children, level + 1);
                    } else {
                        result.splice(level + 1);
                        defaults.onChange(result)
                    }
                }
            })
        }
        var depth = depthOf(items[0]);
        var groupHtml = '<div class=calendar-group> <div class=calendar-ul></div> <div class=calendar-unit></div> </div>';
        var groups = '';
        while (depth--) {
            groups += groupHtml
        }
        $picker.html(groups);
        $(defaults.container).append($picker);
        scroll(items, 0);
        _sington = $picker[0];
        _sington.hide = hide;
        return _sington
    }

    function datePicker(options) {
        var nowDate = new Date();

        var defaults = Object.assign({
            id: 'datePicker',
            onChange: noop,
            hh: false, // 是否有小时
            dd: true, // 是否有天
            start: nowDate.getFullYear() - 20,
            end: nowDate.getFullYear() + 20,
            defaultValue: [nowDate.getFullYear(), nowDate.getMonth() + 1, nowDate.getDate()],
            cron: '* * *'
        }, options);

        // 兼容原来的 start、end 传 Number 的用法
        if (typeof defaults.start === 'number') {
            defaults.start = new Date(defaults.start + '/01/01');
        } else if (typeof defaults.start === 'string') {
            defaults.start = new Date(defaults.start.replace(/-/g, '/'));
        }
        if (typeof defaults.end === 'number') {
            defaults.end = new Date(defaults.end + '/12/31');
        } else if (typeof defaults.end === 'string') {
            defaults.end = new Date(defaults.end.replace(/-/g, '/'));
        }

        var start = {
            year: defaults.start.getFullYear(),
            month: defaults.start.getMonth() + 1,
            date: defaults.start.getDate(),
        }
        var end = {
            year: defaults.end.getFullYear(),
            month: defaults.end.getMonth() + 1,
            date: defaults.end.getDate(),
        }
        var hours = [];
        for (var hh = 0; hh < 24; hh++) {
            hours.push({
                label: '时',
                value: hh
            });
        }
        var obj2 = [];
        for (var year = start.year; year <= end.year; year++) {
            var item_0 = {
                label: '年',
                value: year,
                children: [],
                cls: 'calendar-wide_unit'
            };
            var curr_year = year == end.year;

            var max_month = curr_year ? end.month : 12;
            for (var month = start.month; month <= max_month; month++) {
                var item_1 = {
                    label: '月',
                    value: month,
                    children: []
                };
                var curr_month = curr_year && month == end.month;

                var max_date = defaults.dd ? curr_month ? end.date : new Date(year, month, 0).getDate() : 0;
                for (var date = start.date; date <= max_date; date++) {
                    var item_2 = {
                        label: '日',
                        value: date,
                        children: []
                    };

                    if (defaults.hh) {
                        var curr_date = curr_month && date == end.date;
                        var max_hh = curr_date ? defaults.end.getHours() : 23;
                        item_2.children = hours.slice(0, max_hh + 1);
                    }
                    item_1.children.push(item_2);
                }
                item_0.children.push(item_1);
            }
            obj2.push(item_0);
        }
        return picker(obj2, defaults)
    }
    window.datePicker = datePicker;
})(window, document);