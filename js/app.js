var App = function(){
	var app = this;
    app.defeatPageNum = 10; //默认分页数
    app.api = api_domain + '/api/'; //api地址 api_domain 由后端设置在_footer.html中传入
	//打开弹层
	app.OpenCoverLayer = function () {
	    app.oldSrcollTop = $(window).scrollTop();
	    $('body,html').addClass('un-scroll');
	}

	//关闭弹层
	app.CloseCoverLayer = function () {
	    $('body,html').removeClass('un-scroll');
	    $(window).scrollTop(app.oldSrcollTop);
	}

    //页面搜索
    app.RearchInit = function(){
        function checkSearchKeyword(keyword){
            if (keyword !== '' && !/^\s*$/g.test(keyword) && keyword !== '.' && !/\//.test(keyword) && !/\\/.test(keyword)) {
                return true;
            }else{
                return false;
            }
        }

        function search(keyword, $input){
        	// <input type="text" data-role="search" class="error">
            if (checkSearchKeyword(keyword) ) {
                window.location.href = "/search/" + keyword;
            }else{
                $input.addClass('error');
            }
        }
        $('.search-btn').click(function(){
            var $this = $(this),
                $input = $this.siblings('input[data-role="search"]'),
                keyword = $input.val();
            search(keyword, $input);
        });
        $('input[data-role="search"]').on('keyup', function (event) {
            var $input = $(this),
                keyword = $input.val();
            e = event ? event : (window.event ? window.event : null);
            var currKey = 0;
            currKey = e.keyCode || e.which || e.charCode;
            if (currKey == 13) {
                search(keyword, $input);
            }
        });
        $('input[data-role="search"]').on('input',function(){
            var $input = $(this),
                isError = $input.hasClass('error'),
                keyword = $input.val();
            if (checkSearchKeyword(keyword) ) {
                if (isError){
                    $input.removeClass('error');
                    $input.parents('.search-box-inenr').removeClass('error');
                }
            } else {
                $input.addClass('error');
                $input.parents('.search-box-inenr').addClass('error');
            }
        });
    }();

    /**
     * LoadMoreAjax 发送加载更多ajax请求
     * 
     * @param {boolean}    isLoadingMore  是否为加载更多
     * @param {object}     $elemet        列表jq对象
     * @param {string}     postType       分类类型
     * @param {object}     props          传递参数
     *        @param {string} page        页面
     * @param {function}   callback       回调函数
     * @example App.LoadMoreAjax(true, $lsit, 'destination', { page:2, }, function (data) { })
     */
    app.LoadMoreAjax = function (isLoadingMore, $elemet, url, props, callback) {
        var loading_tpl =   '<div class="inline-loading">' +
                                '<div class="inline-loading-inner clear-float">' +
                                    '<div class="loading-img float-left"><img src="/webs/panama/assets/images/butterfly_griy.gif" alt=""></div>' +
                                '</div>' +
                            '</div>';
        if (isLoadingMore) { $elemet.after(loading_tpl); }
        $.ajax({
            url: app.api + url,
            data: props,
            dataType: 'json',
            success: function (data) {
                callback && callback(data);
            },
            error: function (res) {
                console.log('error', res);
            },  
            complete: function () {
                if (isLoadingMore) { $('.inline-loading').remove();}
            }
        });
    }   
	/**
	 * ListMoreInit 列表滚动加载更多
	 * 
	 * @param {Object} $list            列表jq对象
	 * @param {String} url              请求的url
	 * @param {Object} params           请求的参数
	 *        @param {Number} paged         分页id
	 * @param {Boolean} listIsAjaxEnd   列表是否加载完
	 * @param {Function} callback       回调函数
	 * @example
	 */
	app.ListMoreInit = function ($list, url, params, listIsAjaxEnd, callback) {
	    app.listIsAjax = false;
	    app.listIsAjaxEnd = listIsAjaxEnd;   //列表是否加载完成
	    app.loadMoreParam = params;          //（app.listPage = 2; 刚开始页面已渲染）
/*        if (props.isSearch) {
            props.searchpage = app.listPage;
        }else{
            props.paged = app.listPage;
        }
        app.props = props;  */      
	    //滚动加载
	    if (!app.isAjaxEnd) {
	        $(window).on('scroll', function () {
	            var scrollTop = $(window).scrollTop(),
	                windowHeight = $(window).height(),
	                documentHeight = $(document).height(),
	                isScrollFooter = scrollTop + windowHeight >= documentHeight;
	            if (isScrollFooter && !app.listIsAjax && !app.listIsAjaxEnd) {
	                app.listIsAjax = true;
	                app.LoadMoreAjax(true, $list, url, app.loadMoreParam, function (data) {
	                    app.listIsAjax = false;
	                    app.listPage ++;
/*                        if (app.props.isSearch) {
                            app.props.searchpage++;
                        } else {
                            app.props.paged++;
                        }     */                   
	                    callback && callback(data, url, params);
	                });
	            }
	        });
	    }
	};

    /**
     * 手机页导航
     */
    app.MobileMenuInit = function(){

    }();

    //页面布局处理
    app.PageLayOutInt = function(){
        var $pagewrapper = $('.page-wrapper'),
            $pageDetail = $('.page-detail');
            var windowHeight = $(window).height(),
                bannerHeight = $('.page-baner').outerHeight(),
                footerHeight = $('#footer').outerHeight(),
                minHeight = windowHeight - bannerHeight - footerHeight;
        //404页面和搜索结果页面处理
        if ($pagewrapper.length>0){
            $pagewrapper.outerHeight('auto');
            var wrapperHeigth = $pagewrapper.outerHeight();
                
            if (wrapperHeigth < minHeight) {
                $pagewrapper.outerHeight(minHeight);
            }
        }
        //详情页处理
        if ($pageDetail.length > 0) {
            $pageDetail.outerHeight('auto');
            var pageDeilHeight = $pageDetail.outerHeight();
            if (pageDeilHeight < minHeight) {
                $pageDetail.height(minHeight);
            }
        }  
    };    


    app.commemtEventInit = function(){
        //微信二维码切换
        $('#footer .media-weixin').click(function () {
            $(this).toggleClass('active');
        });
        //手机端言切换
        $('.mobile-menu .change-lang').click(function () {
            $(this).toggleClass('active');
        });

        //iPad间通过处理
        if (Unit.Browser.iPad) {
            $('#header .search-box').addClass('search-box-ipad');
            $('#header .search-box').click(function(){
                $(this).addClass('active');
                $(document).on('touchstart', function () {
                    console.log('touchstart');
                     $('#header .search-box').removeClass('active');
                })
            });
        }
        //ie兼容处理
        if (Unit.Browser.trident){
            $('#header .search-box').hover(function(){
                // $(this).find('input').focus();
            },function(){
                $(this).find('input').blur();
            });
        }
    }();

    //初始化
    app.Init = function () {
        app.PageLayOutInt();
        $(window).on('resize',function(){
            app.PageLayOutInt();
        })
    }();
}

var App = new App();


/**
 * 调用加载更多
 */
var pageNum = 6, //分页个数
    props = {post_type:'experience'}, 
    experience_cat = $('.page-nav .nav-item.active').data('slug'),
    $list = $('.page-content .experience-list'), //listJQ对象
    listIsAjaxEnd = $list.find('.item').length < pageNum ? true : false; //是否可加载更多

if(experience_cat !== ''){
    props.experience_cat = experience_cat;
}

// 列表滚动加载初始化
App.ListMoreInit($list, 'mag.experience.list.json', props, listIsAjaxEnd, function (data, url, props) {
    if (data.errcode == 0) {
        var listHtml = '',
            listData = data.experiences;
        App.listIsAjaxEnd = listData.length < pageNum ? true : false;
        for (i in listData) {
            var item = listData[i],
                item_link = '/{%$exp.post_type%}/{%$exp.experience_cat[0].slug%}/' + item.post_name,
                imgUrl = item.image_list.url ? item.image_list.url : '/webs/panama/assets/images/experience_list_demo.jpg',
                catsData = item.experience_cat,
                cats = '';
            for(j in catsData){
                var catItem = catsData[j];
                if(j==catsData.length-1){
                    cats+='<span>'+catItem.name+'</span>';
                }else{
                    cats+='<span>'+catItem.name+'</span><span class="line">|</span> '
                }
            }
            //列表模板
            var item_tpl =  '<li class="item">'+
                                '<a href="'+item_link+'" class="item-link zoom-box">'+
                                    '<div class="img-box" style="background:url('+imgUrl+')  no-repeat center center; background-size:cover;"></div>'+
                                    '<div class="cover-text">'+
                                        '<div class="titles">'+
                                            '<h3 class="zh-title">'+item.title+'</h3>'+
                                            // '<h4 class="en-title">'+item.enname+'</h4>'+
                                        '</div>'+
                                        '<div class="tags">'+cats+'</div>'+
                                    '</div>'+
                                '</a>'+
                            '</li>';
            listHtml += item_tpl;
        }
        $list.append(listHtml);
    }
})