
var Unit = function(){
	var unit = this;

    /**
     * 获取地址栏参数
     * 
     * @param {string} name 参数名
     * @returns {string} 参数返回值
     */
    unit.GetUrlParms = function(name){
       var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
       var r = window.location.search.substr(1).match(reg);
       if(r!=null)
       return unescape(r[2]);
       return null;
    }	

    /**
     * 浏览器类型的判断
     * 
     * @returns {object} 参数返回浏览器判断信息
     */
    unit.Browser = function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息   
            trident: u.indexOf('Trident') > -1, //IE内核  
            presto: u.indexOf('Presto') > -1, //opera内核 
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            wechat: u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger' //是否微信内置浏览器
        };
    }();

    /**
     * 写cookie
     * 
     * @param {any} name   名称
     * @param {any} value  设置的值
     * @param {any} day    时间（天）
     */
    unit.SetCookie = function (name, value, day) {
        var exp = new Date();
        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/";
    }

    /**
     * 
     * 获取cookie
     * 
     * @param {string} name 获取的名称
     * @returns 返回获取的值
     */
    unit.GetCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    
    //初始化
    unit.Init = function(){
        console.log('unit init');
    }();
}
var Unit = new Unit();