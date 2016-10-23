// 首页焦点图
(function($) {
    var posterTvGrid = function(content, copy, options, data) {
        this.parent = $('#' + content);
        this.parentCopy = $('#' + copy);
        this.body = $('body');
        if (this.parent.length <= 0) {
            return false;
        }
        this.options = $.extend({}, posterTvGrid.options, options);
        this.options.width = this.parent.width();
        this.options.height = this.parent.height();
        this.reset();

    };

    posterTvGrid.prototype = {
        reset: function(options) {
            if (typeof(options) == 'object') {
                $.extend(this.options, options);
            }

            this.options.width = this.parent.width();
            this.options.height = this.parent.height();

            this.total = this.parent.find('.focus-list').children().length;
            this.pageNow = this.options.initPage;

            this.preLeft = -this.options.width;
            this.preNLeft = -this.options.width*2;

            this.nextLeft = this.options.width;
            this.nextNLeft = this.options.width * 2;
            this.nextNNLeft = this.options.width * 3;
            this.pageNowLeft = 0;
            this.drawContent();
        },
        drawContent: function() {
            this.initContent();
            this.bind();
            this.start();
        },
        initContent: function() {
            this.options.width = this.parent.width();
            this.options.height = this.parent.height();
            this.mask = this.parent.find('.bottomnews-mask');
            this.mask.css({
                opacity: 0.5
            });
            contentHolderUnit = this.parent.find(".content-holder-unit");

            contentHolderUnit.css({
                opacity: 0,
                left: 0
            });


            this.parent.find(".content-holder-unit:nth-child(" + this.pageNow + ")").css({
                opacity: 1,
                left: 0
            });

            this.parent.find(".content-holder-unit:nth-child(" + this.pageNow + ") .bottom-overlay").css({
                opacity: 0.6
            });

            var pre = this.pageNow > 1 ? this.pageNow - 1 : this.total;
            var preP = pre - 1 >= 1 ? pre - 1 : _this.total;
            var next = this.pageNow === this.total ? 1 : this.pageNow + 1;
            var nextN = next + 1 > this.total ? 1 : next + 1;
            var nextNN = nextN + 1 > this.total ? 1 : nextN + 1;

            this.parent.find(".content-holder-unit:nth-child(" + preP + ")").css({
                opacity: 1,
                left: -this.options.width * 2
            });

            this.parent.find(".content-holder-unit:nth-child(" + pre + ")").css({
                opacity: 1,
                left: -this.options.width
            });


            this.parent.find(".content-holder-unit:nth-child(" + next + ")").css({
                opacity: 1,
                left: this.options.width
            });

            this.parent.find(".content-holder-unit:nth-child(" + nextN + ")").css({
                opacity: 1,
                left: this.options.width * 2
            });

            this.parent.find(".content-holder-unit:nth-child(" + nextNN + ")").css({
                opacity: 1,
                left: this.options.width * 3
            });

        },
        bind: function() {
            this.leftNav = this.parentCopy.find(".prev");
            this.rightNav = this.parentCopy.find(".next");
            var _this = this;
            this.parent.mouseover(function() {
                _this.stop();
                _this.leftNav.show();
                _this.rightNav.show();
            });
            this.parent.mouseout(function() {
                _this.start();
                //_this.leftNav.hide();
                //_this.rightNav.hide();
            });
            _this.leftNav.click(function(e) {
                _this.turn("right");
                e.preventDefault();
                e.stopPropagation();
            });
            _this.rightNav.click(function(e) {
                _this.turn("left");
                e.preventDefault();
                e.stopPropagation();
            });


        },
        start: function() {
            var _this = this;
            if (_this.timerId) _this.stop();
            _this.timerId = setInterval(function() {
                if (_this.options.direct == "left") {
                    _this.turn("left");
                } else {
                    _this.turn("right");
                }
            }, _this.options.delay);
        },
        stop: function() {
            clearInterval(this.timerId);
        },
        turn: function(dir) {
            var _this = this;
            if (dir == "right") {
                var page = _this.pageNow - 1;
                if (page <= 0) page = _this.total;
            } else {
                var page = _this.pageNow + 1;
                if (page > _this.total) page = 1;
            }
            _this.turnpage(page, dir);
        },
        turnpage: function(page, dir) {
            this.options.width = this.parent.width();
            this.options.height = this.parent.height();
            var _this = this;

            if (_this.pageNow == page) return false;
            var run = function(page, dir, t) {
                var pre = page > 1 ? page - 1 : _this.total;
                var preP = pre - 1 >= 1 ? pre - 1 : _this.total;
                var next = page === _this.total ? 1 : page + 1;
                var nextN = next + 1 > _this.total ? 1 : next + 1;
                var nextNN = nextN + 1 > _this.total ? 1 : nextN + 1;
                if (pre != _this.pageNow && next != _this.pageNow) {
                    var nowpre = _this.pageNow > 1 ? _this.pageNow - 1 : _this.total;
                    var nownext = _this.pageNow == _this.total ? 1 : _this.pageNow + 1;
                    _this.parent.find(".content-holder-unit:nth-child(" + nowpre + ")").css({
                        opacity: 0,
                        left: _this.options.width + 'px'
                    });
                    _this.parent.find(".content-holder-unit:nth-child(" + _this.pageNow + ")").animate({
                        opacity: 0,
                        left: _this.options.width + 'px'
                    }, t);
                    _this.parent.find(".content-holder-unit:nth-child(" + nownext + ")").animate({
                        width: '0px',
                        height: '0px',
                        opacity: 0,
                        left: _this.options.width + 'px'
                    }, t);
                }
                if (dir == 'left') {
                    _this.parent.find('.content-holder-unit').removeClass('current');
                    _this.parent.find(".content-holder-unit:nth-child(" + page + ")").addClass('current');

                    _this.parent.find(".content-holder-unit:nth-child(" + preP + ")").animate({
                        opacity: 0,
                        left: _this.preNLeft + 'px'
                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + pre + ")").animate({
                        opacity: 1,
                        left: _this.preLeft + 'px'
                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + page + ")").animate({
                        opacity: 1,
                        left: 0
                    }, t);

                        _this.parent.find(".content-holder-unit:nth-child(" + page + ") .bottom-overlay").css({
                        opacity: 0.5
                    });


                    _this.parent.find(".content-holder-unit:nth-child(" + next + ")").animate({
                        opacity:1,
                        left: _this.options.width + 'px'
                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + nextN + ")").animate({
                        opacity: 1,
                        left: _this.options.width * 2 + 'px'
                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + nextNN + ")").css({
                        opacity: 0,
                        left: _this.options.width * 3 + 'px'
                    });
                } else {
                    _this.parent.find('.content-holder-unit').removeClass('current');
                    _this.parent.find(".content-holder-unit:nth-child(" + page + ")").addClass('current');
                    var nextNNN = nextNN + 1 > _this.total ? 1 : nextNN + 1;

                    _this.parent.find(".content-holder-unit:nth-child(" + preP + ")").css({
                        opacity: 0,
                        left: -_this.options.width * 2 + 'px'
                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + pre + ")").animate({
                        opacity: 1,
                        left: _this.preLeft + 'px'
                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + page + ")").animate({
                        opacity: 1,
                        left: 0
                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + next + ")").animate({
                        opacity: 1,
                        left: _this.nextLeft + 'px'

                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + nextN + ")").animate({
                        opacity: 1,
                        left: _this.nextNLeft + 'px'

                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + nextNN + ")").animate({
                        opacity: 1,
                        left: _this.options.width * 3 + 'px'
                    }, t);

                    _this.parent.find(".content-holder-unit:nth-child(" + nextNNN + ")").animate({
                        opacity: 0
                    }, t);
                }

                _this.pageNow = page;
                // _this.initBottomNav();
            };
            run(page, dir, _this.options.speed);
        }
    };
    posterTvGrid.options = {
        offsetPages: 3, //默认可视最大条数
        direct: "left", //滚动的方向
        initPage: 1, //默认当前显示第几条
        className: "posterTvGrid", //最外层样式
        autoWidth: true, //默认不用设置宽
        width: 970, //最外层宽，需要使用的时候在传,默认由程序自动判断
        height: 310, //最外层高
        delay: 11115000, //滚动间隔（毫秒）
        speed: 300 //滚动速度毫秒
    };
    new posterTvGrid('focus-list-wrap', 'focus-list-wrap-copy');
    // module.exports = posterTvGrid;
    // window.posterTvGrid = posterTvGrid;
})(jQuery);
