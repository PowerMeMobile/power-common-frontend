var App = function () {

    var currentPage = ''; // current page
    var responsiveFunctions = []; //responsive function holder
    var collapsed = false;
    this.vms = { Base: {} };
    this.routers = {};

    this.routers = {
        baseUrl: '/'
    };
    this.block = {
        spinnerImagePath: '/Content/img/loaders/standard-big.gif',
        showSpinner: true,
        skipSuccess: false,
        skipError: false
    };

    this.sidebar = { fullCollpase: false }

    /*-----------------------------------------------------------------------------------*/
    /*	To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
	/*-----------------------------------------------------------------------------------*/
    var getViewPort = function () {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        }
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Sidebar
	/*-----------------------------------------------------------------------------------*/
    var handleSidebar = function () {
        jQuery('.sidebar-menu .has-sub > a').click(function () {
            var last = jQuery('.has-sub.open', $('.sidebar-menu'));
            last.removeClass("open");
            jQuery('.arrow', last).removeClass("open");
            jQuery('.sub', last).slideUp(200);

            var thisElement = $(this);
            var slideOffeset = -200;
            var slideSpeed = 200;

            var sub = jQuery(this).next();
            if (sub.is(":visible")) {
                jQuery('.arrow', jQuery(this)).removeClass("open");
                jQuery(this).parent().removeClass("open");
                sub.slideUp(slideSpeed, function () {
                    if ($('#sidebar').hasClass('sidebar-fixed') == false) {
                        App.scrollTo(thisElement, slideOffeset);
                    }
                });
            } else {
                jQuery('.arrow', jQuery(this)).addClass("open");
                jQuery(this).parent().addClass("open");
                sub.slideDown(slideSpeed, function () {
                    if ($('#sidebar').hasClass('sidebar-fixed') == false) {
                        App.scrollTo(thisElement, slideOffeset);
                    }
                });
            }
        });

        // Handle sub-sub menus
        jQuery('.sidebar-menu .has-sub .sub .has-sub-sub > a').click(function () {
            var last = jQuery('.has-sub-sub.open', $('.sidebar-menu'));
            last.removeClass("open");
            jQuery('.arrow', last).removeClass("open");
            jQuery('.sub', last).slideUp(200);

            var sub = jQuery(this).next();
            if (sub.is(":visible")) {
                jQuery('.arrow', jQuery(this)).removeClass("open");
                jQuery(this).parent().removeClass("open");
                sub.slideUp(200);
            } else {
                jQuery('.arrow', jQuery(this)).addClass("open");
                jQuery(this).parent().addClass("open");
                sub.slideDown(200);
            }
        });
    }
    /*-----------------------------------------------------------------------------------*/
    /*  Sidebar Name*/
    /*-----------------------------------------------------------------------------------*/
    var handleSidebarName = function myfunction() {
        var li = $('#' + currentPage);
        if (li) {
            if (li.parent().attr('id') === 'menu-list') {
                li.addClass('active');
            } else {
                var sub = li.parents('.has-sub');
                if (sub) {
                    sub.addClass('active open');
                    sub.find('a .arrow').addClass('open');
                    li.addClass('current');
                }
            }
        }
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Collapse Sidebar Programatically
	/*-----------------------------------------------------------------------------------*/
    var collapseSidebar = function () {
        var iconElem = document.getElementById("sidebar-collapse").querySelector('[class*="fa-"]');
        var iconLeft = iconElem.getAttribute("data-icon1");
        var iconRight = iconElem.getAttribute("data-icon2");
        /* For Navbar */
        jQuery('.navbar-brand').addClass("mini-menu");
        /* For sidebar */
        jQuery('#sidebar').addClass("mini-menu");
        if (App.sidebar.fullCollpase)
            jQuery('#main-content').addClass("margin-left-0");
        else
            jQuery('#main-content').addClass("margin-left-50");
        jQuery('.sidebar-collapse i').removeClass(iconLeft);
        jQuery('.sidebar-collapse i').addClass(iconRight);
        /* Remove placeholder from Search Bar */
        jQuery('.search').attr('placeholder', '');
        /* Set a cookie so that mini-sidebar persists */
        localStorage.setItem("mini_sidebar", '1');
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Responsive Sidebar Collapse
	/*-----------------------------------------------------------------------------------*/
    var responsiveSidebar = function () {
        if (!isMobile() && localStorage['mini_sidebar'] == '1') {
            jQuery('.navbar-brand').addClass("mini-menu");
            jQuery('#sidebar').addClass("mini-menu");
            if (App.sidebar.fullCollpase)
                jQuery('#main-content').addClass("margin-left-0");
            else
                jQuery('#main-content').addClass("margin-left-50");
        } else {
            jQuery('.navbar-brand').removeClass("mini-menu");
            jQuery('#sidebar').removeClass("mini-menu");
        }


        //Handle sidebar collapse on screen width
        if (isMobile()) {
            jQuery('#main-content').addClass("margin-left-0");
            jQuery('#main-content').removeClass("margin-left-50");

            if ($('.search:focus').length == 0) {
                HideMobileSideBar();
            }
        } else {
            collapsed = false;
            jQuery('body').addClass("slidebar");
            jQuery('#sidebar').addClass("sidebar-fixed");
            jQuery('#header').addClass("navbar-fixed-top");

            if (!App.sidebar.fullCollpase || (App.sidebar.fullCollpase && localStorage['mini_sidebar'] == '0'))
                jQuery('#main-content').removeClass("margin-left-0");
            var menu = $('.sidebar');
            if (menu.parent('.slimScrollDiv').size() === 1) { // destroy existing instance before resizing
                menu.slimScroll({
                    destroy: true
                });
                menu.removeAttr('style');
                $('#sidebar').removeAttr('style');
            }
        }
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Sidebar Collapse
	/*-----------------------------------------------------------------------------------*/
    var handleSidebarCollapse = function () {
        //Handle sidebar collapse on user interaction
        jQuery('.sidebar-collapse').click(function () {
            var is_mini_menu = localStorage['mini_sidebar'] == '1';
            var is_mobile = isMobile();
            if (is_mobile) {
                //If sidebar is collapsed
                if (collapsed) {
                    HideMobileSideBar();
                }
                else {
                    jQuery('body').addClass("slidebar");
                    jQuery('#sidebar').addClass("sidebar-fixed");
                    jQuery('#header').removeClass("navbar-fixed-top");
                    jQuery('#main-content').removeClass("margin-top-100");
                    jQuery('#main-content').removeClass("margin-top-50");
                    collapsed = true;
                    handleMobileSidebar();
                }
            }
            else { //Handle regular sidebar toggle
                var iconElem = document.getElementById("sidebar-collapse").querySelector('[class*="fa-"]');
                var iconLeft = iconElem.getAttribute("data-icon1");
                var iconRight = iconElem.getAttribute("data-icon2");
                //If sidebar is collapsed
                if (is_mini_menu) {
                    /* For Navbar */
                    jQuery('.navbar-brand').removeClass("mini-menu");
                    /* For sidebar */
                    jQuery('#sidebar').removeClass("mini-menu");
                    if (App.sidebar.fullCollpase)
                        jQuery('#main-content').removeClass("margin-left-0");
                    else
                        jQuery('#main-content').removeClass("margin-left-50");
                    jQuery('.sidebar-collapse i').removeClass(iconRight);
                    jQuery('.sidebar-collapse i').addClass(iconLeft);
                    /* Add placeholder from Search Bar */
                    jQuery('.search').attr('placeholder', "Search");
                    localStorage.setItem("mini_sidebar", '0');
                }
                else {
                    /* For Navbar */
                    jQuery('.navbar-brand').addClass("mini-menu");
                    /* For sidebar */
                    jQuery('#sidebar').addClass("mini-menu");
                    if (App.sidebar.fullCollpase)
                        jQuery('#main-content').addClass("margin-left-0");
                    else
                        jQuery('#main-content').addClass("margin-left-50");
                    jQuery('.sidebar-collapse i').removeClass(iconLeft);
                    jQuery('.sidebar-collapse i').addClass(iconRight);
                    /* Remove placeholder from Search Bar */
                    jQuery('.search').attr('placeholder', '');
                    localStorage.setItem("mini_sidebar", '1');
                }
                $("#main-content").on('resize', function (e) {
                    e.stopPropagation();
                });
            }
        });
    }
    function HideMobileSideBar() {
        jQuery('body').removeClass("slidebar");
        jQuery('#sidebar').removeClass("sidebar-fixed");
        jQuery('#header').addClass("navbar-fixed-top");
        jQuery('#main-content').addClass("margin-top-100");
        collapsed = false;
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Handle Fixed Sidebar on Mobile devices
	/*-----------------------------------------------------------------------------------*/
    var handleMobileSidebar = function () {
        var menu = $('.sidebar');
        if (menu.parent('.slimScrollDiv').size() === 1) { // destroy existing instance before updating the height
            menu.slimScroll({
                destroy: true
            });
            menu.removeAttr('style');
            $('#sidebar').removeAttr('style');
        }
        menu.slimScroll({
            size: '7px',
            color: '#a1b2bd',
            opacity: .3,
            height: "100%",
            allowPageScroll: false,
            disableFadeOut: false
        });
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Handle Fixed Sidebar
	/*-----------------------------------------------------------------------------------*/
    var handleFixedSidebar = function () {
        var menu = $('.sidebar-menu');

        if (menu.parent('.slimScrollDiv').size() === 1) { // destroy existing instance before updating the height
            menu.slimScroll({
                destroy: true
            });
            menu.removeAttr('style');
            $('#sidebar').removeAttr('style');
        }

        if ($('.sidebar-fixed').size() === 0) {
            return;
        }

        var viewport = getViewPort();
        if (viewport.width >= 992) {
            var sidebarHeight = $(window).height() - $('#header').height() + 1;

            menu.slimScroll({
                size: '7px',
                color: '#a1b2bd',
                opacity: .3,
                height: sidebarHeight,
                allowPageScroll: false,
                disableFadeOut: false
            });
        }
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Windows Resize function
	/*-----------------------------------------------------------------------------------*/
    jQuery(window).resize(function () {
        setTimeout(function () {
            responsiveSidebar();
            handleFixedSidebar();
            handleNavbarFixedTop();
        }, 50); // wait 50ms until window resize finishes.
    });

    /*-----------------------------------------------------------------------------------*/
    /*Jquery Colorful Buttons
    /*-----------------------------------------------------------------------------------*/
    var handleButtonColor = function (button, success) {
        if (success) {
            $(button).addClass('btn-success-animated');
            setTimeout(function () { $(button).removeClass('btn-success-animated').addClass('btn-primary'); }, 1020);
        } else {
            $(button).addClass('btn-danger-animated');
            setTimeout(function () { $(button).removeClass('btn-danger-animated').addClass('btn-primary'); }, 1020);
        }
    }


    /*-----------------------------------------------------------------------------------*/
    /*Jquery blockUI
    /*-----------------------------------------------------------------------------------*/
    var setBlockUiDefaults = function () {
        jQuery.blockUI.defaults.css = {
            border: 'none',
            padding: '2px',
            backgroundColor: 'none'

        }
        jQuery.blockUI.defaults.message = '<img src="' + App.block.spinnerImagePath + '")" align="absmiddle">'
        jQuery.blockUI.defaults.overlayCSS = {
            backgroundColor: '#000',
            opacity: 0.05,
            cursor: 'wait'
        }
    }

    var blockUIWithStatus = function (el, status) {
        if (typeof status === 'boolean') {
            var message;
            if (status) {
                message = '<img src="' + App.successImagePath.replace("dummy", Math.random()) + '" align="absmiddle">'
            } else {
                message = '<img src="' + App.errorImagePath + '" align="absmiddle">'
            }

            jQuery(el).block({
                message: message,
                overlayCSS: {
                    backgroundColor: 'none',
                    cursor: 'initial',
                    'pointer-events': 'none'
                },
                timeout: 1020,
                fadeIn: 0,
                fadeOut: 0
            });
        }
    }

    var setupBlockStatus = function () {
        var reg = new RegExp(/url\(\"?(.*?)\"?\)/)

        var success = jQuery('<p class="status-mark-success"></p>').hide().appendTo("body");
        var imgSrcS = success.css("content");
        var groups = reg.exec(imgSrcS);
        if (groups) {
            App.successImagePath = reg.exec(imgSrcS)[1];
        }

        var error = jQuery('<p class="status-mark-error"></p>').hide().appendTo("body");
        var imgSrcE = error.css("content");
        var groups = reg.exec(imgSrcE);
        if (groups) {
            App.errorImagePath = reg.exec(imgSrcE)[1];
        }
    }

    var setupBlockUI = function () {
        setBlockUiDefaults();
        setupBlockStatus();
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Homepage tooltips
	/*-----------------------------------------------------------------------------------*/
    var handleHomePageTooltips = function () {
        //On Hover
        //Default tooltip (Top)
        $('.tip').tooltip();
        //Bottom tooltip
        $('.tip-bottom').tooltip({
            placement: 'bottom'
        });
        //Left tooltip
        $('.tip-left').tooltip({
            placement: 'left'
        });
        //Right tooltip
        $('.tip-right').tooltip({
            placement: 'right'
        });
        //On Focus
        //Default tooltip (Top)
        $('.tip-focus').tooltip({
            trigger: 'focus'
        });
    }
    /*-----------------------------------------------------------------------------------*/
    /* Box tools
	/*-----------------------------------------------------------------------------------*/
    var collapseBox = function (collapse, box) {
        var body = jQuery(box).eq(0).children(".box-body");
        if (collapse) {
            var i = jQuery(box).find(".box-title .tools .collapse-btn").children("i");
            i.removeClass("fa fa-chevron-up").addClass("fa fa-chevron-down");
            body.slideUp(200);
        } else {
            var i = jQuery(box).find(".box-title .tools .collapse-btn").children("i");
            i.removeClass("fa fa-chevron-down").addClass("fa fa-chevron-up");
            body.slideDown(200);
        }
    }

    var handleBoxTools = function () {
        //Collapse
        jQuery('.box .tools .collapse, .box .tools .expand').unbind().click(function () {
            var el = jQuery(this).parents(".box").eq(0).children(".box-body");
            if (jQuery(this).hasClass("collapse")) {
                jQuery(this).removeClass("collapse").addClass("expand");
                var i = jQuery(this).children(".fa-chevron-up");
                i.removeClass("fa-chevron-up").addClass("fa-chevron-down");
                el.slideUp(200);
            } else {
                jQuery(this).removeClass("expand").addClass("collapse");
                var i = jQuery(this).children(".fa-chevron-down");
                i.removeClass("fa-chevron-down").addClass("fa-chevron-up");
                el.slideDown(200);
            }
        });

        /* Close */
        jQuery('.box .tools a.remove').unbind().click(function () {
            var removable = jQuery(this).parents(".box");
            if (removable.next().hasClass('box') || removable.prev().hasClass('box')) {
                jQuery(this).parents(".box").remove();
            } else {
                jQuery(this).parents(".box").parent().remove();
            }
        });

        /* Resize */
        jQuery('.box .tools a.resize').unbind().click(function () {
            var el = jQuery(this).parents(".box-container");
            var minSize = jQuery(this).data('min-size');
            var maxSize = jQuery(this).data('max-size');
            var dependentId = jQuery(this).data('dependent-id');
            var dependentMinSize = jQuery(this).data('dependent-min-size');
            var dependentMaxSize = jQuery(this).data('dependent-max-size');
            if (el.hasClass(minSize)) {
                el.removeClass(minSize); el.addClass(maxSize);
                $('#' + dependentId).removeClass(dependentMinSize); $('#' + dependentId).addClass(dependentMaxSize);
            } else {
                el.removeClass(maxSize); el.addClass(minSize);
                $('#' + dependentId).removeClass(dependentMaxSize); $('#' + dependentId).addClass(dependentMinSize);
            }
        });

    }
    /*-----------------------------------------------------------------------------------*/
    /*	SlimScroll
	/*-----------------------------------------------------------------------------------*/
    var handleSlimScrolls = function () {
        if (!jQuery().slimScroll) {
            return;
        }

        $('.scroller').each(function () {
            $(this).slimScroll({
                size: '7px',
                color: '#a1b2bd',
                height: $(this).attr("data-height"),
                alwaysVisible: ($(this).attr("data-always-visible") == "1" ? true : false),
                railVisible: ($(this).attr("data-rail-visible") == "1" ? true : false),
                railOpacity: 0.1,
                disableFadeOut: true
            });
        });
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Popovers
	/*-----------------------------------------------------------------------------------*/
    var handlePopovers = function () {
        //Default (Right)
        $('.pop').popover();
        //Bottom 
        $('.pop-bottom').popover({
            placement: 'bottom'
        });
        //Left 
        $('.pop-left').popover({
            placement: 'left'
        });
        //Top 
        $('.pop-top').popover({
            placement: 'top'
        });
        //Trigger hover 
        $('.pop-hover').popover({
            trigger: 'hover'
        });
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Alerts
	/*-----------------------------------------------------------------------------------*/
    var handleAlerts = function () {
        $(".alert").alert();
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Custom tabs
	/*-----------------------------------------------------------------------------------*/
    var handleCustomTabs = function () {
        var adjustMinHeight = function (y) {
            $(y).each(function () {
                var A = $($($(this).attr("href")));
                var z = $(this).parent().parent();
                if (z.height() > A.height()) {
                    A.css("min-height", z.height())
                }
            })
        };
        $("body").on("click", '.nav.nav-tabs.tabs-left a[data-toggle="tab"], .nav.nav-tabs.tabs-right a[data-toggle="tab"]', function () {
            adjustMinHeight($(this))
        });
        adjustMinHeight('.nav.nav-tabs.tabs-left > li.active > a[data-toggle="tab"], .nav.nav-tabs.tabs-right > li.active > a[data-toggle="tab"]');
        if (location.hash) {
            var w = location.hash.substr(1);
            $('a[href="#' + w + '"]').click()
        }
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Handle Box Sortable
	/*-----------------------------------------------------------------------------------*/
    var handleBoxSortable = function () {
        $('.box-container').sortable({
            connectWith: '.box-container',
            items: '> .box',
            opacity: 0.8,
            revert: true,
            forceHelperSize: true,
            placeholder: 'box-placeholder',
            forcePlaceholderSize: true,
            tolerance: 'pointer'
        });
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Handles the go to top button at the footer
	/*-----------------------------------------------------------------------------------*/
    var handleGoToTop = function () {
        $('.footer-tools').on('click', '.go-top', function (e) {
            App.scrollTo();
            e.preventDefault();
        });
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Handles navbar fixed top
	/*-----------------------------------------------------------------------------------*/
    var handleNavbarFixedTop = function () {
        if (isMobile()) {
            if (!collapsed) {
                $('#main-content').addClass('margin-top-100');
            }
        }
        else {
            $('#main-content').removeClass('margin-top-100');
            jQuery('#main-content').addClass("margin-top-50");
        }
    }
    /*-----------------------------------------------------------------------------------*/
    /*	Handles sidebar search box
	/*-----------------------------------------------------------------------------------*/
    var handleSearchBox = function () {
        $('#sidebar-search').keyup(function () {
            var text = $('#sidebar-search').val().toLowerCase();
            if (text) {
                var links = $('#menu-list a[href!="javascript:;"]').filter(function (i, link) {
                    return $(link).text().trim().toLowerCase().indexOf(text) != -1;
                }).slice(0, 10);
                showMenuSuggestions(links);
            } else {
                hideMenuSuggestions();
            }
        });

        $('#sidebar-search').focusout(function () {
            hideMenuSuggestions();
        });

        $('#sidebar-search').focus(function () {
            $(".sidebar-suggestions").show();
        });
    }

    function showMenuSuggestions(links) {
        $(".sidebar-suggestions ul").empty();

        $.each(links, function (i, el) {
            $(".sidebar-suggestions ul").append('<li><a href="' + el.href + '">' + $(el).text().trim() + '</a></li>')
        });

        $(".sidebar-suggestions").width($('#sidebar-search').width() + 40);
        $(".sidebar-suggestions").show();
    }

    function hideMenuSuggestions() {
        setTimeout(function () {
            $(".sidebar-suggestions").hide();
        }, 300);
    }

    return {
        //Initialise theme pages
        init: function (options) {

           $.extend(true, this, options);

            handleSidebarName();
            handleSidebar(); //Function to display the sidebar
            handleSidebarCollapse(); //Function to hide or show sidebar
            responsiveSidebar();		//Function to handle sidebar responsively
            handleHomePageTooltips(); //Function to handle tooltips
            handleBoxTools(); //Function to handle box tools
            handleSlimScrolls(); //Function to handle slim scrolls
            handlePopovers(); //Function to handle popovers
            handleAlerts(); //Function to handle alerts
            handleCustomTabs(); //Function to handle min-height of custom tabs
            handleGoToTop(); 	//Funtion to handle goto top buttons
            handleNavbarFixedTop();		//Function to check & handle if navbar is fixed top
            handleSearchBox();
            setupBlockUI();
            handleFixedSidebar();
        },

        backend: _backend,

        //Set page
        setPage: function (name) {
            currentPage = name;
        },
        isPage: function (name) {
            return currentPage == name ? true : false;
        },
        //public function to add callback a function which will be called on window resize
        addResponsiveFunction: function (func) {
            responsiveFunctions.push(func);
        },
        // wrapper function to scroll(focus) to an element
        scrollTo: function (el, offeset) {
            pos = (el && el.size() > 0) ? el.offset().top : 0;
            jQuery('html,body').animate({
                scrollTop: pos + (offeset ? offeset : 0)
            }, 'slow');
        },
        // function to scroll to the top
        scrollTop: function () {
            App.scrollTo();
        },
        blockUIWithStatus: blockUIWithStatus,
        // wrapper function to  block element(indicate loading)
        blockUI: function (el, loaderOnTop) {
            lastBlockedUI = el;
            jQuery(el).block();
        },
        // wrapper function to  un-block element(finish loading)
        unblockUI: function (el) {
            jQuery(el).unblock();
        },
        reloadToolbox: handleBoxTools,
        collapseBox: collapseBox,
        handleButtonColor: handleButtonColor,
        vms: this.vms,
        routers: this.routers,
        sidebar: this.sidebar,
        block: this.block
    };
}();

(function () { //TODO refactor in powerads
    this.Theme = (function () {
        function Theme() { }
        Theme.colors = {
            white: "#FFFFFF",
            primary: "#5E87B0",
            red: "#D9534F",
            green: "#A8BC7B",
            blue: "#70AFC4",
            orange: "#F0AD4E",
            yellow: "#FCD76A",
            gray: "#6B787F",
            lightBlue: "#D4E5DE",
            purple: "#A696CE",
            pink: "#DB5E8C",
            dark_orange: "#F38630"
        };
        return Theme;
    })();
})(window.jQuery);

function findBootstrapEnvironment() {
    var envs = ['xs', 'sm', 'md', 'lg'];

    $el = $('<div>');
    $el.appendTo($('body'));

    for (var i = envs.length - 1; i >= 0; i--) {
        var env = envs[i];

        $el.addClass('hidden-' + env);
        if ($el.is(':hidden')) {
            $el.remove();
            return env
        }
    };
}

function isMobile() {
    return findBootstrapEnvironment() == 'xs';
}

function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi");

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            var hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?',
                hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}