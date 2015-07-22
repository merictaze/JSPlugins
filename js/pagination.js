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
    itemsPerPage: 5
  };

  Pagination.prototype.init = function(options) {
    var self = this;
    // extend default options with the ones specified by the user
    self.options = $.extend({}, Pagination.DEFAULTS, options);
    self.elemContent = self.elem.find('li', self.elem.attr('data-target'));
    // pagination buttons
    self.elemPrev = self.elem.find('[data-func="prev"]');
    self.elemNext = self.elem.find('[data-func="next"]');
    self.elemSort = self.elem.find('[data-func="sort"]');
    // data to keep the sorting order
    self.elemContent.parent().data('order', false);
    // last page number to disable next button when necessary
    self.lastPage = Math.ceil(self.elemContent.length / self.options.itemsPerPage) - 1;

    // if number of elements is more than items per page, show pagination
    if(self.elemContent.length > self.options.itemsPerPage){
      self.render();

      self.elemNext.click(function(e) {
        // increment the current page, and re-render
        self.currentPage += 1;
        self.render();
        return false;
      });

      self.elemPrev.click(function(e) {
        // decrement the current page, and re-render
        self.currentPage -= 1;
        self.render();
        return false;
      });

      self.elemSort.click(function(e) {
        var parent = self.elemContent.parent();
        var target = $(this).attr('data-target');
        // sort the elements
        self.elemContent.sort(function(a,b) {
          var keyA = parseInt($(target, a).text(),0);
          var keyB = parseInt($(target, b).text(),0);
          if(parent.data('order')){
            return (keyA > keyB) ? 1 : -1;
          } else {
            return (keyA < keyB) ? 1 : -1;
          }
        });

        // add them back into parent
        $.each(self.elemContent, function(index, row){
            parent.append(row);
        });

        // update data to keep track of the sorting order
        parent.data('order', !parent.data('order'));

        // render
        self.render();
        return false;
      });
    }
  };

  Pagination.prototype.render = function() {
    var self = this;
    // hide all elements
    self.elemContent.addClass('hide');
    // show the ones in the current page
    var start = self.currentPage*self.options.itemsPerPage;
    var end = start + self.options.itemsPerPage - 1;
    self.elemContent.filter(function(index){
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

  $.fn.pagination = function(options) {
    return this.each(function() {
      new Pagination($(this), options);
    });
  };


  $(window).on('load', function () {
    // for each module element in the HTML, create corresponding JS Object
    $('[data-module="pagination"]').pagination();
  });
}(window, jQuery));
