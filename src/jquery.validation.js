/**
 * jquery.validation
 *
 */

(function($){
    var verifyStrategies = {
        //汉字
        chinese: function(value){
            var state = /^[\u4e00-\u9fa5]+$/.test(value);
            return {
            state:state,
            message:state?'验证成功':'只能输入正确的中文'
            };
        },
        //中国手机号码
        mobilephone:function(value){
            var state = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(value);
            return{
                state : state,
                message:state?'验证成功':'请输入正确的手机号码'
            }
        },
        //最小长度
        minLength:function(lenth){
            return function(value){
                var state = lenth <= value.length;
                return {
                    state:state,
                    message:state?'验证成功':'长度不能小于'+lenth
                }
            }
        },
        //最大长度
        maxLength:function(lenth){
            return function(value){
                var state = lenth >= value.length;
                return {
                    state:state,
                    message:state?'验证成功':'长度不能大于'+lenth
                }
            }
        },
        //与某一文本框输入相同
        sameAs:function(target){
            target = $(target);
            return function(value){
                var prevVlaue = $.trim(target.val());
                var state = value === prevVlaue;
                return {
                    state:state,
                    message:state?'验证成功':'两次输入不一致'
                }
            }
        },
        //字母数字下划线
        letter:function(value){
            var state = /^\w+$/.test(value);
            return {
                state:state,
                message:state?'验证成功':'只能包含字符，数字，下划线组成'
            }
        },
        //邮箱
        email:function(value){
            var state = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
            return {
                state:state,
                message:state?'验证成功':'请输入正确的邮箱地址'
            }
        }


    };
    var Validation = function (el, strategy) {
        this.el = $(el);


        this.validations = [];
        if(strategy) this.add(strategy);

    };
    /**
     * 批量添加验证规则，多条规则之间以分号;隔开
     * @param strategy e.g. 'chinese;minLength:2;maxLength:10'
     * @returns {Validation}
     */
    Validation.prototype.add = function(strategy){
        if(isFunction(strategy)){
            return this.addOne(strategy);
        }
        var strategies = strategy.split(';');
        var len  = strategies.length;
        while(len--)
            this.addOne(strategies[len]);
        return this;

    }
    /**
     * 添加验证规则，如果是字符串则通过verifyStrategies中对应方法添加
     * @param strategy [string|function]
     * @returns {Validation}
     */
    Validation.prototype.addOne = function (strategy) {
        if(isString(strategy)){
            var arg = strategy.split(':');
            strategy = arg.shift();
            if(arg.length){
                strategy = verifyStrategies[strategy].apply(this,arg);
            }else{
                strategy = verifyStrategies[strategy];
            }
        }

        this.validations.push(strategy);

        return this;
    };
    /**
     * 开始验证
     * @returns object
     *      state : 是否通过验证
     *      message:验证情况数组
     */
    Validation.prototype.validate = function () {
        var len = this.validations.length;
        var i = 0;
        var isSuccess = true;
        var value = $.trim(this.el.val());
        var result = [];
        this.el.trigger('before.validation');
        while (len--) {

            var cache = this.validations[len](value);
            if (!cache.state) {
                isSuccess = false;
                this.el.trigger('failed.validation', [cache]);

            }
            result.push(cache);

        }
        if(isSuccess) this.el.trigger('success.validation',[result]);
        return {
            state:isSuccess,
            message:result
        };
    };

    function isFunction(value) {

        return typeof value == 'function' || false;
    }
    function isString(value){
        return typeof value == 'string' || false;
    }


    $.fn.validation = function(strategy){


        var validation = this.data('validation');
        var args,ret;
        if(!validation){
            //如果实例不存在则是初始化
            this.data('validation',new Validation(this,strategy));
        }else{
            //如果存在则是调用方法
             args = Array.prototype.slice.call(arguments,1);
             ret = validation[strategy].apply(validation,args);
        }
        //如果调用方法的返回值不是实例，则返回ret否则返回this以便链式调用
        return (ret && ret !== validation) ? ret : this;
    }
})(jQuery)
