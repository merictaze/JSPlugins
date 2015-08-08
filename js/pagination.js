(function(window, $) {

  /*
   * PAGINATION
   */

  var Pagination = function(elem, options) {
    var self = this;
    self.elem = elem;
    self.currentPage = 0;
    self.init(options);
  };

  Pagination.DEFAULTS = {
    itemsPerPage: 4
  };

  Pagination.prototype.init = function(options) {
    var self = this;
    // extend default options with the ones specified by the user
    self.options = $.extend({}, Pagination.DEFAULTS, options);
    self.elemItemsParent = self.elem.find(self.elem.attr('data-target'));
    self.elemItems = self.elem.find('li', self.elemItemsParent);
    // pagination buttons
    self.elemPrev = self.elem.find('[data-func="prev"]');
    self.elemNext = self.elem.find('[data-func="next"]');
    self.elemSort = self.elem.find('[data-func="sort"]');
    self.targetSort = self.elemSort.attr('data-target');
    // data to keep the sorting order
    self.elemItems.parent().data('order', false);
    // last page number to disable next button when necessary
    self.lastPage = Math.ceil(self.elemItems.length / self.options.itemsPerPage) - 1;

    // set the button click listeners
    self.elemNext.on('click', $.proxy(this.next, this));
    self.elemPrev.on('click', $.proxy(this.prev, this));
    self.elemSort.on('click', $.proxy(this.sort, this));
    
    // render the module
    self.render();
  };

  Pagination.prototype.render = function() {
    var self = this;
    // hide all elements
    self.elemItems.addClass('hide');
    // show the ones in the current page
    var start = self.currentPage*self.options.itemsPerPage;
    var end = start + self.options.itemsPerPage - 1;
    self.elemItems.filter(function(index){
      return index >= start && index <= end;
    }).removeClass('hide');

    // disable the Prev button if it is the first page
    if (self.currentPage === 0) {
      self.elemPrev.prop('disabled', true);
    } else {
      self.elemPrev.prop('disabled', false);
    }

    // disable the Next button if it is the last page
    if (self.currentPage == self.lastPage) {
      self.elemNext.prop('disabled', true);
    } else {
      self.elemNext.prop('disabled', false);
    }
  };

  Pagination.prototype.next = function(e) {
    // increment the current page, and re-render
    this.currentPage += 1;
    this.render();
    return false;
  };

  Pagination.prototype.prev = function() {
    // decrement the current page, and re-render
    this.currentPage -= 1;
    this.render();
    return false;    
  };

  Pagination.prototype.sort = function() {
    var self = this;
    // sort the elements
    self.elemItems.sort(function(a,b) {
      var keyA = parseInt($(self.targetSort, a).text(),0);
      var keyB = parseInt($(self.targetSort, b).text(),0);
      if(self.elemItemsParent.data('order')){
        return (keyA > keyB) ? 1 : -1;
      } else {
        return (keyA < keyB) ? 1 : -1;
      }
    });

    // add them back into parent
    $.each(self.elemItems, function(index, row){
      self.elemItemsParent.append(row);
    });

    // update data to keep track of the sorting order
    self.elemItemsParent.data('order', !self.elemItemsParent.data('order'));

    // render
    self.render();
    return false;
  };

  $.fn.pagination = function(options) {
    return this.each(function() {
      new Pagination($(this), options);
    });
  };


  $(window).on('load', function() {
    // for each module element in the HTML, create corresponding JS Object
    $('[data-module="pagination"]').pagination();
  });
}(window, jQuery));
