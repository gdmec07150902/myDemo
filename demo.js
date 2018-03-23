;(function (name, definition) {
    var hasDefine = typeof define === 'function',
        hasExports = typeof module !== 'undefined' && module.exports;
    if (hasDefine) {
        define(definition);
    } else if (hasExports) {
        module.exports = definition();
    } else {
        this[name] = definition();
    }
})('MKB', function () {
    var MKB = function(obj) {
        this.init(obj)
    };

    MKB.prototype.data = {
        isInput: false,
    }

    MKB.prototype.init = function(obj) {
        var inp = document.querySelector(obj.id);
        var that = this;
        // 创建dom
        this.createDom();
        console.log(inp)
        inp.addEventListener("focus", function() {
            this.focus(obj);
            that.data['isInput'] = false;
        }.bind(this));
        inp.addEventListener("blur", function() {
            //this.blur(obj);
            setTimeout(function(){
                if (that.data['isInput']) {
                    inp.focus();
                    that.data['isInput'] = false;
                } else {
                    that.blur(obj);
                }
            }, 1)
        }.bind(this));
        this.change(obj);
    };

    // 创建dom
    MKB.prototype.createDom = function() {
        var oldDom = document.querySelector('.picker-modal-mask');
        if (oldDom) {
            document.body.removeChild(oldDom);
        }
        var dom = document.createElement('div');
        dom.setAttribute('class', 'MoneyKeyBoard');
        dom.style.display = 'none';
        dom.innerHTML = 
        '<table>' +
            '<tr>' +
                '<td class="MKB-NUM" data-attr = "1">1</td>' +
                '<td class="MKB-NUM" data-attr = "2">2</td>' +
                '<td class="MKB-NUM" data-attr = "3">3</td>' +
                '<td rowspan="2" id="MKB-del">删除</td>' +
            '</tr>' +
            '<tr>' +
                '<td class="MKB-NUM" data-attr = "4">4</td>' +
                '<td class="MKB-NUM" data-attr = "5">5</td>' +
                '<td class="MKB-NUM" data-attr = "6">6</td>' +
            '</tr>' +
            '<tr>' +
                '<td class="MKB-NUM" data-attr = "7">7</td>' +
                '<td class="MKB-NUM" data-attr = "8">8</td>' +
                '<td class="MKB-NUM" data-attr = "9">9</td>' +
                '<td rowspan="2" id="MKB-cancel">确定</td>' +
            '</tr>' +
            '<tr>' +
                '<td class="MKB-NUM" data-attr = ".">.</td>' +
                '<td class="MKB-NUM" data-attr = "0">0</td>' +
                '<td id="MKB-pack-up">收</td>' +
            '</tr>' +
        '</table>';
        document.body.appendChild(dom);
    };

    MKB.prototype.focus = function(obj){
        var inp = document.querySelector(obj.id);
        var dom = document.querySelector('.MoneyKeyBoard');
        dom.style.display = 'block';
        dom.style.animation = 'MKB-in .2s';
    }

    MKB.prototype.blur = function(obj){
        var inp = document.querySelector(obj.id);
        var dom = document.querySelector('.MoneyKeyBoard');
        setTimeout(function(){
            dom.style.display = 'none';
        },180)
        dom.style.animation = 'MKB-out .2s';
    }

    MKB.prototype.change = function(obj) {
        var that = this;
        var inp = document.querySelector(obj.id);
        var domArray = document.getElementsByClassName("MKB-NUM");
        var MKB_DEL = document.querySelector('#MKB-del');
        var MKB_CANCEL = document.querySelector('#MKB-cancel');
        // 确认按钮
        MKB_CANCEL.onclick = function() {
            inp.blur();
        }
        // 删减一位
        MKB_DEL.onclick = function() {
            that.data['isInput'] = true;
            inp.value = inp.value.slice(0,inp.value.length - 1);
        }
        // 各个数字和点 按钮
        for (x in domArray)
        {
            console.log(domArray[x]);
            (function(x){
                domArray[x].onclick = function(obj){
                    that.data['isInput'] = true;
                    if (inp.value.length >= 10) {
                        return;
                    }
                    inp.value = inp.value +''+ domArray[x].getAttribute('data-attr');

                    /*   正则验证   */
                    //先把非数字的都替换掉，除了数字和. 
                    inp.value = inp.value.replace(/[^\d\.]/g,'');
                    //必须保证第一个为数字而不是. 
                    inp.value = inp.value.replace(/^\./g,'0.'); 
                    //保证只有出现一个.而没有多个. 
                    inp.value = inp.value.replace(/\.{2,}/g,'.'); 
                    //保证.只出现一次，而不能出现两次以上 
                    inp.value = inp.value.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
                     //只能输入两个小数
                    inp.value = inp.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); 
                    /*   正则验证   end   */
                }
            })(x)
        }
    }

    return MKB;
});
