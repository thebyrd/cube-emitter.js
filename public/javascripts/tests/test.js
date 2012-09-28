/**
 * 
 *
 *
 */

describe('ShoptiquesMetrics', function(){
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
  describe('#init', function(){
    it('should include a valid email', function(){
      expect(ShoptiquesMetrics.email).to.equal(mockEvent.email);
    });
    it('should have a valid user id', function(){
      expect(ShoptiquesMetrics.user_id).to.equal(mockEvent.userID);
    });
    it('should have a valid session id', function(){
      expect(ShoptiquesMetrics.session_id).to.equal(mockEvent.sessionID);
    });
    it('should have a valid client id', function(){
      expect(ShoptiquesMetrics.client_id).to.equal(mockEvent.clientID);
    });
    it('should have a valid ui version', function(){
      expect(ShoptiquesMetrics.ui_version).to.equal(mockEvent.uiVersion);
    });
    it('should have the current URL', function(){
      expect(ShoptiquesMetrics.current_url).to.equal(mockEvent.current_url);
    });
    it('may have a reference ID', function(){
      var ref = Math.floor(Math.random()*1000000000).toString();
      window.history.pushState(null, null, "?r="+ref);
      expect(ShoptiquesMetrics.getReferenceID()).to.equal(ref);
    });
    it('should have a valid metric type', function(){
      var class_names = {
        'm-related-product' : {
          mt:'cl',
          d: {
            lu: window.location.href,
            lt:'rp'
          }
        },
        'm-buy-btn' : {
          mt:'cl',
          d: {
            lu: window.location.href,
            lt:'pbb'
          }
        },
        'm-product-link' : {
          mt:'cl',
          d: {
            lu: window.location.href,
            lt:'pi'
          }
        },
        'm-info-page' : {
          mt:'cl',
          d: {
            lu: window.location.href,
            lt:'i'
          }
        },
        'm-navigation-link' : {
          mt:'cl',
          d: {
            lu: window.location.href,
            lt:'n'
          }
        },
        'm-newsletter-popup-btn' : {
          mt:'cb',
          d: {
            bi: 'np'
          }
        },
        'm-newsletter-signup-btn' : {
          mt:'cb',
          d: {
            bi: 'ns'
          }
        },
        'm-next-slide-btn': {
          mt:'cb',
          d: {
            bi: 'nxt'
          }
        },
        'm-last-slide-btn': {
          mt:'cb',
          d: {
            bi: 'lst'
          }
        },
        'm-buy-button': {
          mt:'cb',
          d: {
            bi: 'pbb'
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
      for(var klass in class_names) {
        var cubeEvent = ShoptiquesMetrics.addEvent(class_names[klass].mt, class_names[klass].d).data;
        expect(cubeEvent.mt).to.equal(class_names[klass].mt);
        expect(cubeEvent.d).to.equal(class_names[klass].d);
      }

    });
  });
  describe('environmental variables', function(){
    it('should include user agent', function(){
      expect(ShoptiquesMetrics.env.ua).to.equal(window.navigator.userAgent.toString());
    });
    it('should include color depth (cb)', function(){
      expect(ShoptiquesMetrics.env.cb).to.equal(window.screen.colorDepth);
    });
    it('should include color depth (cn)', function(){
      expect(ShoptiquesMetrics.env.cn).to.equal(Math.pow(2, window.screen.colorDepth));
    });
    it('should include screen dimensions', function(){
      expect(ShoptiquesMetrics.env.sd).to.equal(window.screen.width + "x" + window.screen.height);
    });
    it('should include vendor', function(){
      expect(ShoptiquesMetrics.env.v).to.equal(window.navigator.vendor);
    });
    it('should include platform', function(){
      expect(ShoptiquesMetrics.env.p).to.equal(window.navigator.platform);
    });
    it('should include language', function(){
      expect(ShoptiquesMetrics.env.l).to.equal(window.navigator.language);
    });
    it('should include ce', function(){
      expect(ShoptiquesMetrics.env.ce).to.equal(window.navigator.cookieEnabled);
    });
    it('should include browser', function(){
      expect(["msie","chrome","ipad","ipod","iphone","safari","webkit","firefox","mozilla","opera"]).to.include(ShoptiquesMetrics.env.b);
    });
    it('should include browser version', function(){
      expect(ShoptiquesMetrics.env.bv).to.equal($.browser.version);
    });
  });
  describe('Metric Specific Data', function(){
    it("should have the appropriate fields");
    it("should have valid values in those fields");
    it("should get the contents of a link when it is clicked");
    it("should get parse the url of the an image if it is clicked");
  });
});