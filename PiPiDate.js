(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();
    else if (typeof define === 'function' && define.amd) define([], factory);
    else if (typeof exports === 'object') exports["PiPiDate"] = factory();
    else root["PiPiDate"] = factory()
})(this, function() {
    return (function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = { exports: {}, id: moduleId, loaded: false };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.loaded = true;
            return module.exports
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.p = "";
        return __webpack_require__(0)
    })([function(module, exports, __webpack_require__, m0) {
        'use strict';
        Object.defineProperty(exports, "__esModule", { value: true });
        var _picker = __webpack_require__(1);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj }
        }
        exports.default = {
            picker: _picker.picker,
            datePicker: _picker.datePicker
        };
        module.exports = exports['default'];

    }, function(module, exports, __webpack_require__, m1) {
        'use strict';
        Object.defineProperty(exports, "__esModule", { value: true });
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj
        } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        };
        var _util = __webpack_require__(2);
        var _util2 = _interopRequireDefault(_util);
        __webpack_require__(6);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj }
        }

        function _depthOf(object) {
            var depth = 1;
            if (object.children && object.children[0]) { depth = _depthOf(object.children[0]) + 1 }
            return depth
        }

        function Result(item) {
            if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) != 'object') { item = { label: item, value: item } }
            _util2.default.extend(this, item)
        }
        Result.prototype.toString = function() {
            return this.value
        };
        Result.prototype.valueOf = function() {
            return this.value
        };
        var _sington = void 0;
        var temp = {};


        function picker() {
            // if (_sington) return _sington; // 这个代码会导致插件必须被销毁后才能再次初始化，会导致组件如果没有被销毁时，无法再次使用
            var options = arguments[arguments.length - 1];
            var defaults = _util2.default.extend({ id: 'default', className: '', container: 'body', onChange: _util2.default.noop, onConfirm: _util2.default.noop, onClose: _util2.default.noop }, options);
            var items = void 0;
            var isMulti = false;
            if (arguments.length > 2) {
                var i = 0;
                items = [];
                while (i < arguments.length - 1) { items.push(arguments[i++]) }
                isMulti = true
            } else { items = arguments[0] }
            temp[defaults.id] = temp[defaults.id] || [];
            var result = [];
            var lineTemp = temp[defaults.id];
            var wrapHtml = '<div class=picker-date-bd>  </div>';
            var $picker = (0, _util2.default)(_util2.default.render(wrapHtml, defaults));
            var depth = options.depth || (isMulti ? items.length : _depthOf(items[0])),
                groups = '';

            function show() {
                (0, _util2.default)(defaults.container).append($picker);
                _util2.default.getStyle($picker[0], 'transform');
            }

            function _hide(callback) {
                _hide = _util2.default.noop;
                $picker.remove();
                _sington = false;
                defaults.onClose();
                callback && callback()
            }

            function hide(callback) { _hide(callback) }

            function scroll(items, level) {
                if (lineTemp[level] === undefined && defaults.defaultValue && defaults.defaultValue[level] !== undefined) {
                    var defaultVal = defaults.defaultValue[level];
                    var index = 0,
                        len = items.length;
                    if (_typeof(items[index]) == 'object') {
                        for (; index < len; ++index) {
                            if (defaultVal == items[index].value) break
                        }
                    } else {
                        for (; index < len; ++index) {
                            if (defaultVal == items[index]) break
                        }
                    }
                    if (index < len) { lineTemp[level] = index } else { console.warn('Picker has not match defaultValue: ' + defaultVal) }
                }
                $picker.find('.picker-date-group').eq(level).scroll({
                    items: items,
                    temp: lineTemp[level],
                    onChange: function onChange(item, index) {
                        if (item) { result[level] = new Result(item) } else { result[level] = null }
                        lineTemp[level] = index;
                        if (isMulti) {
                            if (result.length == depth) { defaults.onChange(result) }
                        } else {
                            if (item.children && item.children.length > 0) { $picker.find('.picker-date-group').eq(level + 1).show();!isMulti && scroll(item.children, level + 1) } else {
                                var $items = $picker.find('.picker-date-group');
                                $items.forEach(function(ele, index) {
                                    if (index > level) {
                                        (0, _util2.default)(ele).hide()
                                    }
                                });
                                result.splice(level + 1);
                                defaults.onChange(result)
                            }
                        }
                    },
                    onConfirm: defaults.onConfirm
                })
            }
            var _depth = depth;
            var groupHtml = '<div class=picker-date-group> <div class=picker-date-ul></div> <div class=picker-date-unit></div> </div>'
            while (_depth--) { groups += groupHtml }
            $picker.html(groups);
            show();
            if (isMulti) { items.forEach(function(item, index) { scroll(item, index) }) } else { scroll(items, 0) }
            _sington = $picker[0];
            _sington.hide = hide;
            return _sington
        }

        function datePicker(options) {
            var nowDate = new Date();

            var defaults = _util2.default.extend({
                id: 'datePicker',
                onChange: _util2.default.noop,
                onConfirm: _util2.default.noop,
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

            var findBy = function findBy(array, key, value) {
                for (var i = 0, len = array.length; i < len; i++) {
                    var _obj = array[i];
                    if (_obj[key] == value) {
                        return _obj;
                    }
                }
            };

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
            for (var hh = 0; hh < 24; hh ++) {
                hours.push({label: '时', value: hh });
            }
            var obj2 = [];
            for (var year = start.year; year <= end.year; year ++) {
                var item_0 = { label: '年', value: year, children: [], cls: 'picker-date-wide_unit' };
                var curr_year = year == end.year;

                var max_month = curr_year ? end.month : 12;
                for (var month = start.month; month <= max_month; month ++) {
                    var item_1 = { label: '月', value: month, children: [] };
                    var curr_month = curr_year && month == end.month;

                    var max_date = defaults.dd ? curr_month ? end.date : new Date(year, month, 0).getDate() : 0;
                    for (var date = start.date; date <= max_date; date ++) {
                        var item_2 = { label: '日', value: date, children: [] };

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
        exports.default = { picker: picker, datePicker: datePicker };
        module.exports = exports['default']

    }, function(module, exports, __webpack_require__, m2) {
        'use strict';
        Object.defineProperty(exports, "__esModule", { value: true });
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj
        } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        };
        var _objectAssign = __webpack_require__(4);
        var _objectAssign2 = _interopRequireDefault(_objectAssign);
        var _balajs = __webpack_require__(5);
        var _balajs2 = _interopRequireDefault(_balajs);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj }
        }

        function _detect(ua) {
            var os = this.os = {},
                android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            if (android) {
                os.android = true;
                os.version = android[2]
            }
        }
        _detect.call(_balajs2.default, navigator.userAgent);
        (0, _objectAssign2.default)(_balajs2.default.fn, {
            append: function append($child) {
                if (!($child instanceof HTMLElement)) { $child = $child[0] }
                this.forEach(function($element) { $element.appendChild($child) });
                return this
            },
            remove: function remove() {
                this.forEach(function($element) { $element.parentNode.removeChild($element) });
                return this
            },
            find: function find(selector) {
                return (0, _balajs2.default)(selector, this)
            },
            addClass: function addClass(className) {
                if (!className) return this;
                this.forEach(function($element) { $element.classList.add(className) });
                return this
            },
            removeClass: function removeClass(className) {
                this.forEach(function($element) { $element.classList.remove(className) });
                return this
            },
            eq: function eq(index) {
                return (0, _balajs2.default)(this[index])
            },
            show: function show() {
                this.forEach(function($element) { $element.style.display = 'block' });
                return this
            },
            hide: function hide() {
                this.forEach(function($element) { $element.style.display = 'none' });
                return this
            },
            html: function html(_html) {
                this.forEach(function($element) { $element.innerHTML = _html });
                return this
            },
            css: function css(obj) {
                var _this = this;
                Object.keys(obj).forEach(function(key) { _this.forEach(function($element) { $element.style[key] = obj[key] }) });
                return this
            },
            on: function on(eventType, selector, handler) {
                var isDelegate = typeof selector === 'string' && typeof handler === 'function';
                if (!isDelegate) { handler = selector }
                this.forEach(function($element) {
                    eventType.split(' ').forEach(function(event) {
                        $element.addEventListener(event, function(evt) {
                            if (isDelegate) {
                                if (this.contains(evt.target.closest(selector))) { handler.call(evt.target, evt) }
                            } else { handler.call(this, evt) }
                        })
                    })
                });
                return this
            },
            off: function off(eventType, selector, handler) {
                if (typeof selector === 'function') {
                    handler = selector;
                    selector = null
                }
                this.forEach(function($element) {
                    eventType.split(' ').forEach(function(event) {
                        if (typeof selector === 'string') { $element.querySelectorAll(selector).forEach(function($element) { $element.removeEventListener(event, handler) }) } else { $element.removeEventListener(event, handler) }
                    })
                });
                return this
            },
            index: function index() {
                var $element = this[0];
                var $parent = $element.parentNode;
                return Array.prototype.indexOf.call($parent.children, $element)
            },
            offAll: function offAll() {
                var _this2 = this;
                this.forEach(function($element, index) {
                    var clone = $element.cloneNode(true);
                    $element.parentNode.replaceChild(clone, $element);
                    _this2[index] = clone
                });
                return this
            },
            val: function val() {
                var _arguments = arguments;
                if (arguments.length) {
                    this.forEach(function($element) { $element.value = _arguments[0] });
                    return this
                }
                return this[0].value
            },
            attr: function attr() {
                var _arguments2 = arguments,
                    _this3 = this;
                if (_typeof(arguments[0]) == 'object') {
                    var _ret = function() {
                        var attrsObj = _arguments2[0];
                        var that = _this3;
                        Object.keys(attrsObj).forEach(function(attr) { that.forEach(function($element) { $element.setAttribute(attr, attrsObj[attr]) }) });
                        return { v: _this3 }
                    }();
                    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v
                }
                if (typeof arguments[0] == 'string' && arguments.length < 2) {
                    return this[0].getAttribute(arguments[0])
                }
                this.forEach(function($element) { $element.setAttribute(_arguments2[0], _arguments2[1]) });
                return this
            }
        });
        (0, _objectAssign2.default)(_balajs2.default, {
            extend: _objectAssign2.default,
            noop: function noop() {},
            render: function render(tpl, data) {
                var code = 'var p=[];with(this){p.push(\'' + tpl.replace(/[\r\t\n]/g, ' ').split('<%').join('\t').replace(/((^|%>)[^\t]*)'/g, '$1\r').replace(/\t=(.*?)%>/g, '\',$1,\'').split('\t').join('\');').split('%>').join('p.push(\'').split('\r').join('\\\'') + '\');}return p.join(\'\');';
                return new Function(code).apply(data)
            },
            getStyle: function getStyle(el, styleProp) {
                var value, defaultView = (el.ownerDocument || document).defaultView;
                if (defaultView && defaultView.getComputedStyle) {
                    styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();
                    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp)
                } else if (el.currentStyle) {
                    styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                        return letter.toUpperCase()
                    });
                    value = el.currentStyle[styleProp];
                    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                        return function(value) {
                            var oldLeft = el.style.left,
                                oldRsLeft = el.runtimeStyle.left;
                            el.runtimeStyle.left = el.currentStyle.left;
                            el.style.left = value || 0;
                            value = el.style.pixelLeft + 'px';
                            el.style.left = oldLeft;
                            el.runtimeStyle.left = oldRsLeft;
                            return value
                        }(value)
                    }
                    return value
                }
            }
        });
        exports.default = _balajs2.default;
        module.exports = exports['default']

    }, function(module, exports) {
    }, function(module, exports, m5) {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var propIsEnumerable = Object.prototype.propertyIsEnumerable;

        function toObject(val) {
            if (val === null || val === undefined) {
                throw new TypeError('Object.assign cannot be called with null or undefined');
            }
            return Object(val)
        }

        function shouldUseNative() {
            try {
                if (!Object.assign) {
                    return false
                }
                var test1 = new String('abc');
                test1[5] = 'de';
                if (Object.getOwnPropertyNames(test1)[0] === '5') {
                    return false
                }
                var test2 = {};
                for (var i = 0; i < 10; i++) { test2['_' + String.fromCharCode(i)] = i }
                var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
                    return test2[n]
                });
                if (order2.join('') !== '0123456789') {
                    return false
                }
                var test3 = {};
                'abcdefghijklmnopqrst'.split('').forEach(function(letter) { test3[letter] = letter });
                if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
                    return false
                }
                return true
            } catch (e) {
                return false
            }
        }
        module.exports = shouldUseNative() ? Object.assign : function(target, source) {
            var from;
            var to = toObject(target);
            var symbols;
            for (var s = 1; s < arguments.length; s++) {
                from = Object(arguments[s]);
                for (var key in from) {
                    if (hasOwnProperty.call(from, key)) { to[key] = from[key] }
                }
                if (Object.getOwnPropertySymbols) {
                    symbols = Object.getOwnPropertySymbols(from);
                    for (var i = 0; i < symbols.length; i++) {
                        if (propIsEnumerable.call(from, symbols[i])) { to[symbols[i]] = from[symbols[i]] }
                    }
                }
            }
            return to
        }
    }, function(module, exports, __webpack_require__, m6) {
        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        (function(root, $) {
            $ = (function(document, s_addEventListener, s_querySelectorAll) {
                function $(s, context, bala) {
                    bala = Object.create($.fn);
                    s && bala.push.apply(bala, s[s_addEventListener] ? [s] : "" + s === s ? /</.test(s) ? ((context = document.createElement(context || s_addEventListener)).innerHTML = s, context.children) : context ? ((context = $(context)[0]) ? context[s_querySelectorAll](s) : bala) : document[s_querySelectorAll](s) : typeof s == 'function' ? document.readyState[7] ? s() : document[s_addEventListener]('DOMContentLoaded', s) : s);
                    return bala
                }
                $.fn = [];
                $.one = function(s, context) {
                    return $(s, context)[0] || null
                };
                return $
            })(document, 'addEventListener', 'querySelectorAll');
            if (true) {
                !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
                    return $
                }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
            } else if (typeof module == 'object' && module.exports) { module.exports = $ } else { root.$ = $ }
        })(this)
    }, function(module, exports, __webpack_require__, m7) {
        'use strict';
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj
        } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        };
        var _util = __webpack_require__(2);
        var _util2 = _interopRequireDefault(_util);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj }
        }
        var setTransition = function setTransition($target, time) {
            return $target.css({ '-webkit-transition': 'all ' + time + 's', 'transition': 'all ' + time + 's' })
        };
        var setTranslate = function setTranslate($target, diff) {
            return $target.css({ '-webkit-transform': 'translate3d(0, ' + diff + 'px, 0)', 'transform': 'translate3d(0, ' + diff + 'px, 0)' })
        };
        var getDefaultIndex = function getDefaultIndex(items) {
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
        var getDefaultTranslate = function getDefaultTranslate(offset, rowHeight, items) {
            var currentIndex = getDefaultIndex(items);
            return (offset - currentIndex) * rowHeight
        };
        var getMax = function getMax(offset, rowHeight) {
            return offset * rowHeight
        };
        var getMin = function getMin(offset, rowHeight, length) {
            return -(rowHeight * (length - offset - 1))
        };
        _util2.default.fn.scroll = function(options) {
            var _this = this;
            var defaults = _util2.default.extend({ items: [], scrollable: '.picker-date-ul', offset: 3, rowHeight: 34, onChange: _util2.default.noop, temp: null, bodyHeight: 7 * 34 }, options);
            var items = defaults.items.map(function(item) {
                return '<div class="picker-date-item' + (item.disabled ? ' picker-date-item_disabled' : '') + '">' + ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object' ? item.value : item) + '</div>'
            }).join('');
            var $this = (0, _util2.default)(this);
            var obj = defaults.items[0];
            $this.find('.picker-date-ul').html(items);
            $this.find('.picker-date-unit').html(obj.label).addClass(obj.cls);
            var $scrollable = $this.find(defaults.scrollable);
            var start = void 0;
            var end = void 0;
            var startTime = void 0;
            var translate = void 0;
            var points = [];
            var windowHeight = window.innerHeight;
            var currItemLight = function(index) {
                $scrollable.find('.picker-date-item').removeClass('picker-date-item-light').eq(index).addClass('picker-date-item-light');
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
                if (translate > max) { translate = max }
                if (translate < min) { translate = min }
                var index = defaults.offset - translate / defaults.rowHeight;
                while (!!defaults.items[index] && defaults.items[index].disabled) { diff > 0 ? ++index : --index }
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
                var index = Math.round(defaults.offset - (translate + diff) / defaults.rowHeight);
                currItemLight(index);
                setTransition($scrollable, 0);
                setTranslate($scrollable, translate + diff);
                startTime = +new Date();
                points.push({ time: startTime, y: end });
                if (points.length > 40) { points.shift() }
            }

            function _end(pageY) {
                if (!start) return;
                var endTime = new Date().getTime();
                var relativeY = windowHeight - defaults.bodyHeight / 2;
                end = pageY;
                if (endTime - startTime > 100) {
                    if (Math.abs(end - start) > 10) { stop(end - start) } else { stop(relativeY - end) }
                } else {
                    if (Math.abs(end - start) > 10) {
                        var endPos = points.length - 1;
                        var startPos = endPos;
                        for (var i = endPos; i > 0 && startTime - points[i].time < 100; i--) { startPos = i }
                        if (startPos !== endPos) {
                            var ep = points[endPos];
                            var sp = points[startPos];
                            var t = ep.time - sp.time;
                            var s = ep.y - sp.y;
                            var v = s / t;
                            var diff = v * 150 + (end - start);
                            stop(diff)
                        } else { stop(0) }
                    } else { stop(relativeY - end) }
                }
                start = null
            }
            $scrollable = $this.offAll().on('touchstart', function(evt) { _start(evt.changedTouches[0].pageY) }).on('touchmove', function(evt) {
                _move(evt.changedTouches[0].pageY);
                evt.preventDefault()
            }).on('touchend', function(evt) { _end(evt.changedTouches[0].pageY) }).find(defaults.scrollable);
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
    }])
});
