(function() {

  $(function() {
    var body;
    body = $('body');
    $('#menu .button').not('#menu-container-settings').on('click', function() {
      return $('.toolbar').hide();
    });
    $('#menu-container-settings').on('click', function() {
      $('.toolbar').hide();
      return $('#container-settings').toggle();
    });
    $('#menu-add-row').on('click', function() {
      $('#new-row').show();
      return $('#insert-position').data('o', 'grid').show();
    });
    $("#container-width").on('keyup', function() {
      return $("#page").css("width", $(this).val());
    });
    $('#insert-before, #insert-prepend, #insert-append, #insert-after').on('click', function(e) {
      var col, columns, i, o, row, selectedcol, selectedrow, w;
      o = $('#insert-position').data('o');
      if (o === 'grid') {
        columns = eval($("#grid-columns").val());
        row = $('<section class="row span_24"></section>');
        i = 1;
        while (i <= columns) {
          w = 24 / columns;
          col = '<div class="col span_' + w + '" data-width="' + w + '"></div>';
          row.append(col);
          i++;
        }
        selectedcol = $('.col.selected');
        if (selectedcol.length) {
          selectedrow = selectedcol.closest('.row');
          if ($(e.target).attr('id') === 'insert-before' && selectedcol.length) {
            return selectedrow.before(row);
          } else if ($(e.target).attr('id') === 'insert-after' && selectedcol.length) {
            return selectedrow.after(row);
          }
        } else if ($(e.target).attr('id') === 'insert-prepend') {
          return $("#page").prepend(row);
        } else if ($(e.target).attr('id') === 'insert-append') {
          return $("#page").append(row);
        }
      }
    });
    body.on('click', '.col', function() {
      var elem;
      elem = $(this);
      $('.col.selected').removeClass('selected');
      elem.addClass('selected');
      if ($('#col-settings').is(':visible')) {
        $('#menu-col-settings').click();
      } else if ($('#row-settings').is(':visible')) {
        $('#menu-row-settings').click();
      }
      return elem.on('clickoutside', function(e) {
        if (!$(e.target).parents('.toolbar, #menu').length) {
          elem.removeClass('selected');
          if (!$(e.target).hasClass('col')) {
            $('#col-settings, #row-settings').hide();
          }
          return elem.off('clickoutside');
        }
      });
    });
    $('#menu-row-settings').on('click', function() {
      var elem, row;
      elem = $('.col.selected');
      if (elem.length) {
        row = $('.col.selected').closest('.row');
        return $('#row-settings').show();
      }
    });
    $('#menu-col-settings').on('click', function() {
      var elem, i, width;
      elem = $('.col.selected');
      if (elem.length && elem.siblings().length) {
        width = elem.attr('data-width');
        $('#col-settings').show();
        i = 1;
        $('#col-width').html('');
        while (i <= 24 - elem.siblings().length) {
          $('#col-width').append('<option value="' + i + '">' + i + '</option>');
          i++;
        }
        return $('#col-width').val(width).focus();
      }
    });
    return $('#col-width').on('change keyup', function(e) {
      var diff, elem, group, i, s, sw, swnew, w, wnew, _results;
      if ($('.col.selected').length && e.which === 46) {
        $('.col.selected').closest('.row').remove();
        $('#col-settings').hide();
      }
      elem = $('.selected.col');
      w = eval(elem.attr('data-width'));
      wnew = eval($(this).val());
      diff = eval(w - wnew);
      group = [];
      elem.nextAll().each(function() {
        return group.push($(this));
      });
      elem.prevAll().each(function() {
        return group.push($(this));
      });
      if (diff !== 0) {
        i = 1;
        _results = [];
        while (i <= Math.abs(diff)) {
          s = '';
          $(group).each(function(index) {
            var tw;
            if (diff < 0) {
              tw = eval($(this).attr('data-width'));
              if (tw > 1) {
                s = $(this);
                return false;
              }
            } else {
              s = $(this);
              return false;
            }
          });
          if (s !== '') {
            sw = eval(s.attr('data-width'));
            swnew = diff > 0 ? eval(sw + 1) : eval(sw - 1);
            elem.removeClass('span_' + w).addClass('span_' + wnew).attr('data-width', wnew);
            s.removeClass('span_' + sw).addClass('span_' + swnew).attr('data-width', swnew);
          }
          _results.push(i++);
        }
        return _results;
      }
    });
  });

}).call(this);
