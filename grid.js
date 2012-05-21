(function() {
  var calcColsWidth, maxWidth, newColWidth, resizeCol, showColumnsWidths, updateColsWidth;

  updateColsWidth = function() {
    var columns, gutter, w;
    gutter = $("#gutter").val() * 1;
    columns = $("#columns").val() * 1;
    w = $("#canvas").width() - (gutter * (columns - 1) / columns) - calcColsWidth();
    $(".col").css("width", ($("#canvas").width() - (gutter * (columns - 1))) / columns);
    $(".col").not(":last").css("margin-right", gutter);
    return showColumnsWidths();
  };

  showColumnsWidths = function() {
    return $("#columns-width input").each(function() {
      return $(this).val($(".col").eq($(this).index()).width());
    });
  };

  resizeCol = function(elem) {
    var cols, columns, gutter;
    gutter = $("#gutter").val() * 1;
    columns = $("#columns").val() * 1;
    cols = [];
    $(".col").each(function() {
      if ($(this).index() > elem.index()) return cols.push($(this));
    });
    $(cols.reverse()).each(function() {
      if ($(this).width() > 40) {
        return newColWidth($(this));
      } else {
        return newColWidth($(".col:last"));
      }
    });
    return showColumnsWidths();
  };

  newColWidth = function(col) {
    var columns, gutter, width;
    gutter = $("#gutter").val() * 1;
    columns = $("#columns").val() * 1;
    width = $("#canvas").width() - (gutter * (columns - 1)) - calcColsWidth(col);
    return col.css("width", width);
  };

  calcColsWidth = function(col) {
    var width;
    width = 0;
    $(".col").not(col).each(function() {
      return width += $(this).width();
    });
    return width;
  };

  maxWidth = function(col) {
    var columns, gutter, nextCols, prevColsWidth, width;
    width = 0;
    gutter = $("#gutter").val() * 1;
    columns = $("#columns").val() * 1;
    prevColsWidth = 0;
    nextCols = [];
    $(".col").not(col).each(function() {
      if ($(this).index() < col.index()) prevColsWidth += $(this).width();
      if ($(this).index() > col.index()) return nextCols.push($(this));
    });
    width = $("#canvas").width() - ($("#gutter").val() * (columns - 1)) - prevColsWidth - (40 * nextCols.length);
    return width;
  };

  $(function() {
    var body;
    body = $('body');
    $('#menu .button').on('click', function() {
      return $('.toolbar').hide();
    });
    $('#menu-page').on('click', function() {
      return $('#page-options').toggle();
    });
    $('#menu-insert').on('click', function() {
      return $('#insert-options').toggle();
    });
    $('#insert-grid').on('click', function() {
      $('#grid-options').show();
      return $('#insert-position').data('o', 'grid').show();
    });
    $("#page-width").on('keypress', function() {
      return $("#page").css("width", $(this).val());
    });
    $('#insert-append').on('click', function() {
      var col, columns, i, o, row, w;
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
        return $("#page").append(row);
      }
    });
    body.on('click', '.col', function() {
      var elem, i, width;
      elem = $(this);
      if (elem.siblings().length) {
        width = elem.attr('data-width');
        elem.addClass('selected');
        $('#col-options').show();
        i = 1;
        $('#col-width').html('');
        while (i <= 24 - elem.siblings().length) {
          $('#col-width').append('<option value="' + i + '">' + i + '</option>');
          i++;
        }
        $('#col-width').val(width).focus();
        return elem.on('clickoutside', function(e) {
          if (!($(e.target).attr('id') === 'col-width' || $(e.target).parent().attr('id') === 'col-width')) {
            elem.removeClass('selected');
            return elem.off('clickoutside');
          }
        });
      }
    });
    return $('#col-width').on('change keyup', function(e) {
      var diff, elem, group, i, s, sw, swnew, w, wnew, _results;
      if ($('.col.selected').length && e.which === 46) {
        $('.col.selected').closest('.row').remove();
        $('#col-options').hide();
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
