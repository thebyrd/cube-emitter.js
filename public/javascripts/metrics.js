ShoptiquesMetrics = {
  /*
   * catch back button clicked event
   * get search event (parse what they searched)
   * getReferenceID
   * get Data Type for boutiques
   * get Data Type lookahead breaks when going between theedit & shop because of CORS
   */

  created_at: (new Date()).getTime(),

  email:'',
  user_id:'',
  session_id:'',
  client_id:'',
  facebook_id:'',
  ui_version:'',
  env:'',
  current_url:'',
  reference_id:'',
  referer_url:'',
  page_data_type:'',

  half_scroll: false,
  full_scroll: false,

  init : function(email, user_id, session_id, client_id, facebook_id, pageDataType){
    ShoptiquesMetrics.email = email;
    ShoptiquesMetrics.user_id = user_id;
    ShoptiquesMetrics.session_id = session_id;
    ShoptiquesMetrics.client_id = client_id;
    ShoptiquesMetrics.facebook_id = facebook_id;
    ShoptiquesMetrics.ui_version = ShoptiquesMetrics.getUIVersion();
    ShoptiquesMetrics.env = ShoptiquesMetrics.getEnvironment();
    ShoptiquesMetrics.current_url = window.location.href;
    ShoptiquesMetrics.reference_id = ShoptiquesMetrics.getReferenceID();
    ShoptiquesMetrics.referer_url = document.referrer;//can be undefined
    ShoptiquesMetrics.page_data_type = pageDataType ? pageDataType : ShoptiquesMetrics.getDataType(window.location.pathname);
    $(document).ready(function(){
      //triggers a page load
      var now = (new Date()).getTime() / 1000.0;
      ShoptiquesMetrics.addEvent('pl', { t: (ShoptiquesMetrics.created_at - now) });

      //TODO back button or reload
      // window.onbeforeunload = function(e){
      //   ShoptiquesMetrics.addEvent('b', {});
      // };
    
      //add attributes to elements where needed
      //mt click link(√), click button(√), scrolled(√), back button, search, page view(√)
      
      //cl needs to include the body.

        $('a, button, input[type="submit"]').click(function(){
          var class_names = {
          'm-related-product' : {
            mt:'cl',
            d: {
              lu:this.href,
              lt:'rp',
              c: $(this).html()
            }
          },
          'm-buy-btn' : {
            mt:'cl',
            d: {
              lu:this.href,
              lt:'pbb',
              c: $(this).html()
            }
          },
          'm-product-link' : {
            mt:'cl',
            d: {
              lu:this.href,
              lt:'pi',
              c: $(this).html()
            }
          },
          'm-info-page' : {
            mt:'cl',
            d: {
              lu:this.href,
              lt:'i',
              c: $(this).html()
            }
          },
          'm-navigation-link' : {
            mt:'cl',
            d: {
              lu:this.href,
              lt:'n',
              c: $(this).html()
            }
          },
          'm-newsletter-popup-btn' : {
            mt:'cb',
            d: {
              bi: 'np',
              c: $(this).html()
            }
          },
          'm-newsletter-signup-btn' : {
            mt:'cb',
            d: {
              bi: 'ns',
              c: $(this).html()
            }
          },
          'm-next-slide-btn': {
            mt:'cb',
            d: {
              bi: 'nxt',
              c: $(this).html()
            }
          },
          'm-last-slide-btn': {
            mt:'cb',
            d: {
              bi: 'lst',
              c: $(this).html()
            }
          },
          'm-buy-button': {
            mt:'cb',
            d: {
              bi: 'pbb',
              c: $(this).html()
            }
          },
          'm-video': {
            mt:'cb',
            d: {
              bi: 'pv',//play video
              c: $(this).html()
            }
          }
        };

          //custom classes
          for(var klass in class_names) {
            if($(this).hasClass(klass)){
              ShoptiquesMetrics.addEvent(class_names[klass].mt, class_names[klass].d);
              return true;//this avoids repeating the event with one of the hint parsers below
            }
          }

          


          console.log("could not find class...we're going to try to parse the even on our own");
          var linkType = 'u';//unkown

          //navigation
          if($(this).parents('.navbar, .taxons-list').length > 0){
            linkType = "n";//navigation
          }

          //products
          if(this.pathname !== undefined && this.pathname.split('/')[1] == "products"){
            if($(this).parents('.related-product').length > 0){
              linkType = 'rp';//related product
            }
            linkType = 'pi';//product inline
          }

          //info
          if($(this).parents('#footer').length > 0){
            linkType = 'i';
          }
          //external link
          //TODO this could break if there is shoptiques.com in the url of an external link (like a news article)
          if(this.href !== undefined && this.href.indexOf("shoptiques.com") == -1){
            linkType = 'e';
          }
          if(linkType == 'u') { //last result is the lookahead ajax call
            try {
              linkType = ShoptiquesMetrics.getDataType(this.href);
            } catch(err) {
              console.log(err);
            }
          }
          ShoptiquesMetrics.addEvent('cl', {
            "lu": this.href,
            "lt": linkType
          });

        });




      });

      //TODO scroll. check for IE Bug
      $(window).scroll(function(){

        if(ShoptiquesMetrics.half_scroll === false && window.innerHeight + window.scrollY >= document.body.offsetHeight / 2) {
          ShoptiquesMetrics.addEvent('sc', {l: "h" /* length = half */ });
          ShoptiquesMetrics.half_scroll = true;
          return true;
        }

        if(ShoptiquesMetrics.full_scroll === false && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          ShoptiquesMetrics.addEvent('sc', {l: "f" /* length = full */ });
          ShoptiquesMetrics.full_scroll = true;
          return true;
        }

      });

      //search
      //TODO parse what they searched
  },
  getUIVersion: function(){ //TODO eventually pass this in in the INIT
    return 1;//This should probably make a call to a webservice and then cache the results
  },
  getEnvironment: function (){
    var env = {};
    var userAgent = window.navigator.userAgent.toString();

    env.ua = userAgent;
    env.cb = window.screen.colorDepth;
    env.cn = Math.pow (2, env.cb);
    env.sd = window.screen.width + "x" + window.screen.height;
    env.v = window.navigator.vendor;
    env.p = window.navigator.platform;
    env.l = window.navigator.language;
    env.ce = window.navigator.cookieEnabled;

    var browser = "";
    var browserVersion = "";

    if($.browser.msie){
        browser = "msie";
    } else if($.browser.chrome){
        browser = "chrome";
    } else if($.browser.webkit){
        var uaLower = userAgent.toLowerCase();
        if(uaLower.indexOf('chrome') != -1){
            browser = "chrome";
        } else if(uaLower.indexOf('ipad') != -1){
            browser = "ipad";
        } else if(uaLower.indexOf('ipod') != -1){
            browser = "ipod";
        } else if(uaLower.indexOf('iphone') != -1){
            browser = "iphone";
        } else if(uaLower.indexOf('safari') != -1){
            browser = "safari";
        } else {
            browser = "webkit";
        }
    } else if($.browser.mozilla){
        if(userAgent.toLowerCase().indexOf('firefox') != -1){
            browser = "firefox";
        }else{
            browser = "mozilla";
        }
    } else if($.browser.opera){
        browser = "opera";
    }

    env.b = browser;
    env.bv = $.browser.version;
    return env;
  },
  getReferenceID: function() {
    var name = 'r';
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if(results === null) {
        return "";
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  },
  getDataType: function(path) {
    if(path == '/') {
      return 'h';
    } else if (path == '/the-edit') {
      return 'eh';
    } else if ($.inArray(path, ['/the-muse', '/the-stylist', '/the-list', '/the-boutiques', '/the-videos']) != -1) {
      return 's';
    } else if (path.indexOf('/products') != -1) {
      return 'p';
    } else if (path.indexOf('/boutiques') != -1) {//TODO doesn't catch boutique pages
      return 'b';
    } else if (path.indexOf('/t/neighborhoods/') != -1) {
      return 'n';
    } else if (path.indexOf('/t/') != -1 || path == '/whats-new') {
      return 'pc';
    } else {
      var data;
      if(path == window.location.pathname){
        data = $('html').html().toString();
      } else { //if you're looking at an external link and can't figure out datatype from the url alone we can look ahead to the contents of the page
        try {
          $.ajaxSetup({async: false});
          data = $.get(window.location.origin + path, function(data) { return data.toString(); });
        } catch (err) {
          console.log(err);
          return 'as';//this is not always correct, but is the most common thing on the edit.
        }
      }
      if(data.indexOf('class="slideshow-nav"') != -1) {
        return 'as';
      } else if(window.location.origin.indexOf('theedit') != -1) {
        return 'a';
      } else {
        return 'b';//TODO gets broken by info sometimes
      }
    }
  },
  addEvent: function(metricType, eventData){
    var cubeEvent = {
      "type":"shoptiques",
      "time": new Date().toISOString(),
      "data": {
        "eid" : ShoptiquesMetrics.email,
        "uid" : ShoptiquesMetrics.user_id,
        "sid" : ShoptiquesMetrics.session_id,
        "cid" : ShoptiquesMetrics.client_id,
        "v"   : ShoptiquesMetrics.ui_version,
        "env" : ShoptiquesMetrics.env,
        "u"   : ShoptiquesMetrics.current_url,
        "r"   : ShoptiquesMetrics.reference_id,
        "ru"  : ShoptiquesMetrics.referer_url,
        "dt"  : ShoptiquesMetrics.page_data_type,
        "mt"  : metricType,
        "d"   : eventData
      }
    };
    console.log(JSON.stringify(cubeEvent));//for debuging only
    $.ajax({
      type: 'POST',
      url: 'http://localhost:1080/1.0/event/put',
      data: JSON.stringify([cubeEvent]),
      dataType: 'json'
    });
    return cubeEvent;
  }
};

 var mockEvent = {
    email: 'david@shoptiques.com',
    userID: Math.floor(Math.random()*100000000000),
    sessionID: Math.floor(Math.random()*100000000000),
    clientID: Math.floor(Math.random()*100000000000),
    facebookID: Math.floor(Math.random()*100000000000),
    uiVersion: 1,
    current_url: window.location.href
  };
  ShoptiquesMetrics.init(mockEvent.email, mockEvent.userID, mockEvent.sessionID, mockEvent.clientID, mockEvent.facebookID);

