(function(window, $) {
  /*
  * CAROUSEL
  */

  var Carousel = function(elem, options) {
    var self = this;
    self.elem = elem;
    self.init(options);
  };

  Carousel.DEFAULTS = {
    initialItem: 0,
    interval: 2000
  };

  Carousel.prototype.init = function(options) {
    var self = this;
    // extend default options with the ones specified by the user
    self.options = $.extend({}, Carousel.DEFAULTS, options);
    self.currentItemIndex = self.options.initialItem;
    // carousel description and buttons
    self.elemPrev = self.elem.find('[data-func="prev"]');
    self.elemNext = self.elem.find('[data-func="next"]');
    self.elemDesc = self.elem.find('[data-func="desc"]');
    // list of elements will be shown in the carousel
    self.elemSource = self.elem.find(self.elem.attr('data-source')).children();
    // main image in the carousel
    self.elemImg = self.elem.find(self.elem.attr('data-destination'));

    // initial slide
    self.slide(self.currentItemIndex);

    self.elemSource.find('a').click(function(e) {
      var index = $(this).closest('li', self.elemSource).index();
      restartInterval();
      self.slide(index);
      return false;
    });

    // slide carousel automatically
    self.interval = window.setInterval(function(){self.next();}, self.options.interval);

    // set the button click listeners
    self.elemNext.on('click', $.proxy(this.next, this));
    self.elemPrev.on('click', $.proxy(this.prev, this));

  };

  Carousel.prototype.next = function() {
    restartInterval();
    var nextIndex = (this.currentItemIndex+1) % this.elemSource.length;
    this.slide(nextIndex);
    return false;
  };

  Carousel.prototype.prev = function() {
    restartInterval();
    var prevIndex = (this.currentItemIndex-1) % this.elemSource.length;
    this.slide(prevIndex);
    return false;
  };

  Carousel.prototype.slide = function(itemIndex) {
    var self = this;
    // remove active class from the old item
    self.elemSource.eq(self.currentItemIndex).removeClass('active');
    // update the current item
    self.currentItemIndex = itemIndex;
    var item = self.elemSource.eq(itemIndex);
    item.addClass('active');
    self.elemImg.fadeTo(100, 0.6, function() {
      self.elemImg.prop('src', item.find('a').attr('href'));
      self.elemDesc.text(item.find('img').prop('alt'));
      self.elemImg.fadeTo(50, 1);
    });
    return self;
  };

  function restartInterval(){
    // restart the interval
    if (self.interval) {
      clearInterval(self.interval);
      self.interval = window.setInterval(function(){self.next();}, self.options.interval);
    }
  }
    
  $.fn.carousel = function(options) {
    return this.each(function() {
      new Carousel($(this), options);
    });
  };


  $(window).on('load', function () {
    // for each module element in the HTML, create corresponding JS Object
    $('[data-module="carousel"]').carousel();
  });
}(window, jQuery));
