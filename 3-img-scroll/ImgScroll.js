(function($) {
    var posterTvGrid = function(id, content, options) {
        this.parent = $('#' + id);
        this.content = this.parent.find('#' + content);

        if (this.parent.length <= 0) {
            return false;
        }
        this.options = $.extend({}, posterTvGrid.options, options);
        this.reset();
    };

    posterTvGrid.prototype = {
        reset: function(options) {

            if (typeof (options) == 'object') {
                $.extend(this.options, options);
            }

            this.total = this.content.children().length;
            this.rawTotal = this.total;
            this.pageNow = this.options.initPage;
            this.contentHolderUnits = this.parent.find(this.options.className);

            if (this.total < 3) return;

            this.drawContent();
        },

        // 在头和尾添加或删除两个元素
        orderElement: function(style, dir) {

            if (style) {
                var pre = this.pageNow - 1;
                var next = this.pageNow + 1;
                var preNode;
                var nextNode;

                if (pre > 0 && next <= this.rawTotal) {
                    preNode = this.contentHolderUnits.eq(pre - 1).clone();
                    nextNode = this.contentHolderUnits.eq(next - 1).clone();

                    this.content.append(preNode);
                    this.content.prepend(nextNode);
                }

                if (pre === 0) {
                    preNode = this.contentHolderUnits.eq(this.rawTotal - 1).clone();
                    nextNode = this.contentHolderUnits.eq(next - 1).clone();

                    this.content.prepend(preNode);
                    this.content.prepend(nextNode);
                }

                if (next > this.rawTotal) {
                    preNode = this.contentHolderUnits.eq(pre - 1).clone();
                    nextNode = this.contentHolderUnits.eq(0).clone();

                    this.content.append(nextNode);
                    this.content.append(preNode);
                }
            } else {
                if (dir === 'left') {
                    this.parent.find(this.options.className).first().remove();
                    preNode = this.parent.find(this.options.className + ':nth-child(2)').clone();

                    this.content.append(preNode);
                } else {
                    this.parent.find(this.options.className).last().remove();
                    preNode = this.parent.find(this.options.className + ':nth-child(3)').clone();

                    this.content.prepend(preNode);
                }
            }

            var pre =  2 ;
            var preP = 1 ;
            var now = 3;
            var next = 4;
            var nextN = 5;

            var unitWidth = this.parent.width();


            this.parent.find(".content-holder-unit:nth-child(" + preP + ")").css({
                opacity: 0,
                left: -unitWidth * 2
            });

            this.parent.find(".content-holder-unit:nth-child(" + pre + ")").css({
                opacity: 1,
                left: -unitWidth
            });

            this.parent.find(".content-holder-unit:nth-child(" + now+ ")").css({
                opacity: 1,
                left: 0
            });

            this.parent.find(".content-holder-unit:nth-child(" + next + ")").css({
                opacity: 1,
                left: unitWidth
            });
            this.parent.find(".content-holder-unit:nth-child(" + nextN + ")").css({
                opacity: 0,
                left: unitWidth * 2
            });
        },


        drawContent: function() {
            this.initContent();
            this.bind();
            this.start();
        },
        initContent: function() {
            this.contentHolderUnits.css({
                opacity: 0,
                left: 0
            });

            if (this.total === 3) {
                this.orderElement(true);
            }
        },
        bind: function() {
            this.leftNav = this.parent.find('.prev');
            this.rightNav = this.parent.find('.next');
            var self = this;

            this.parent.mouseover(function() {
                self.stop();
                self.leftNav.show();
                self.rightNav.show();
            });
            this.parent.mouseout(function() {
                self.start();
                self.leftNav.hide();
                self.rightNav.hide();
            });
            self.leftNav.click(function(event) {
                self.turn('right');
                event.preventDefault();
                event.stopPropagation();

            });
            self.rightNav.click(function(event) {
                self.turn('left');
                event.preventDefault();
                event.stopPropagation();
            });
        },

        start: function() {
            var self = this;
            if (self.timerId) self.stop();
            self.timerId = setInterval(function() {
                if (self.options.direct === 'left') {
                    self.turn('left');
                } else {
                    self.turn('right');
                }
            }, self.options.delay);
        },

        stop: function() {
            clearInterval(this.timerId);
        },

        turn: function(dir) {
            var self = this;
            if (dir == "right") {
                var page = self.pageNow - 1;
                if (page <= 0) page = self.total;
            } else {
                var page = self.pageNow + 1;
                if (page > self.total) page = 1;
            }

            self.turnpage(page, dir);
        },
        turnpage: function(page, dir) {
            this.options.width = this.parent.width();
            this.options.height = this.parent.height();

            this.preLeft = -this.options.width;
            this.preNLeft = -this.options.width * 2;

            this.nextLeft = this.options.width;
            this.nextNLeft = this.options.width * 2;
            this.pageNowLeft = 0;

            var self = this;

            var run = function(dir, t) {

                if (dir == 'left') {
                    var items =  self.parent.find(self.options.className);

                    for(var i=0; i<items.length; i++) {
                        var nowLeft = parseInt($(items[i]).css('left'));
                        var endLeft = nowLeft - self.options.width;

                        $(items[i]).animate({
                            opacity: 1,
                            left:  endLeft + 'px'
                        }, t);
                    }
                } else {
                    var items =  self.parent.find(self.options.className);

                    for(var i=0; i<items.length; i++) {
                        var nowLeft = parseInt($(items[i]).css('left'));
                        var endLeft = nowLeft + self.options.width;

                        $(items[i]).animate({
                            opacity: 1,
                            left:  endLeft + 'px'
                        }, t);
                    }
                }

                setTimeout(function(){
                    self.orderElement(false, dir);
                }, t + 300);

            };
            self.pageNow = page;
            self.options.callback && self.options.callback(self.pageNow);
            run(dir, self.options.speed);
        }
    };
    posterTvGrid.options = {
        direct: 'left', // 滚动的方向
        initPage: 1, // 默认当前显示第几条
        className: '.content-holder-unit', // 最小单元的className
        delay: 80000000000000000000, //滚动间隔（毫秒）
        speed: 300, //滚动速度毫秒
    };

    this.posterTvGrid = new posterTvGrid('image-collection-wrap', 'image-collection');

})(jQuery);
