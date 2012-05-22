(function() {
  var hideSelectedTools, showSelectedTools, updateColWidth,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  showSelectedTools = function() {
    $('#menu-row-settings, #menu-col-settings, #menu-content').show();
    return $('#insert-before, #insert-after').show();
  };

  hideSelectedTools = function() {
    $('#menu-row-settings, #menu-col-settings, #menu-content').hide();
    $('#insert-before, #insert-after').hide();
    return $('#row-settings, #col-settings, #content-options').hide();
  };

  $.fn.hasAttr = function(name) {
    return this.attr(name) !== void 0 && this.attr(name) !== false;
  };

  updateColWidth = function(width) {
    var diff, elem, group, i, s, sw, swnew, w, wnew, _results;
    elem = $('.selected.col');
    w = eval(elem.attr('data-width'));
    wnew = eval(width);
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
  };

  $(function() {
    var body;
    body = $('body');
    hideSelectedTools();
    $('#menu .button, #logo').not('#menu-container-settings').on('click', function() {
      return $('.toolbar').hide();
    });
    $('#menu-container-settings').on('click', function() {
      $('.toolbar').hide();
      return $('#container-settings').toggle();
    });
    $('#menu-new-row').on('click', function() {
      $('#new-row').show();
      return $('#insert-position').data('o', 'grid').show();
    });
    $('#menu-styles').on('click', function() {
      var style;
      if (!$('#user-styles').length) {
        style = $('<style id="user-styles"></style>');
        style.appendTo('head');
      }
      $('#styles').val($('#user-styles').html());
      return $('#styles-panel').show();
    });
    $('#menu-editor').on('click', function() {
      $('#editor').val($('.col.selected').html());
      return $('#editor-panel').show();
    });
    $("#container-width").on('keyup', function() {
      return $("#page").css("width", $(this).val());
    });
    $('.adjustable').each(function() {
      var elem, values;
      elem = $(this);
      if (elem.hasAttr('data-values')) {
        values = elem.attr('data-values').replace(/\ /g, '').split(',');
        return elem.text(values[0]);
      } else {
        return elem.text(0);
      }
    });
    body.on('click', '.sb-plus, .sb-minus', function(e) {
      var elem, field, value, values;
      elem = $(this);
      field = elem.siblings('.adjustable').first();
      value = field.text();
      if (field.hasAttr('data-values')) {
        values = field.attr('data-values').replace(/\ /g, '').split(',');
        if (__indexOf.call(values, value) >= 0) {
          if ($(e.target).hasClass('sb-plus') && values.indexOf(value) < values.length - 1) {
            return field.text(values[values.indexOf(value) + 1]);
          } else if ($(e.target).hasClass('sb-minus') && values.indexOf(value) > 0) {
            return field.text(values[values.indexOf(value) - 1]);
          }
        } else {
          return field.text(values[0]);
        }
      } else {
        if (typeof value !== 'undefined') {
          if ($(e.target).hasClass('sb-plus')) {
            return field.text(eval(value + 1));
          } else if ($(e.target).hasClass('sb-minus')) {
            if (value > 0 || elem.hasClass('allow-negative')) {
              return field.text(eval(value - 1));
            }
          }
        } else {
          if ($(e.target).hasClass('sb-plus')) {
            return field.text(1);
          } else if ($(e.target).hasClass('sb-minus') && elem.hasClass('allow-negative')) {
            return field.text(-1);
          }
        }
      }
    });
    $('#insert-before, #insert-prepend, #insert-append, #insert-after').on('click', function(e) {
      var col, columns, i, o, row, selectedcol, selectedrow, w;
      o = $('#insert-position').data('o');
      if (o === 'grid') {
        columns = eval($("#grid-columns").text());
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
          if ($(e.target).attr('id') === 'insert-before') {
            return selectedrow.before(row);
          } else if ($(e.target).attr('id') === 'insert-prepend') {
            return selectedcol.prepend(row);
          } else if ($(e.target).attr('id') === 'insert-append') {
            return selectedcol.append(row);
          } else if ($(e.target).attr('id') === 'insert-after') {
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
      showSelectedTools();
      if ($('#col-settings').is(':visible')) {
        $('#menu-col-settings').click();
      } else if ($('#row-settings').is(':visible')) {
        $('#menu-row-settings').click();
      } else if ($('#editor').is(':visible')) {
        $('#menu-editor').click();
      }
      if (elem.siblings().length) {
        $('#col-width').parent().show();
      } else {
        $('#col-width').parent().hide();
      }
      elem.on('clickoutside', function(e) {
        if (!($(e.target).hasClass('toolbar') || $(e.target).attr('id') === 'menu' || $(e.target).parents('.toolbar, #menu').length)) {
          elem.removeClass('selected');
          if (!$(e.target).hasClass('col')) hideSelectedTools();
          return elem.off('clickoutside');
        }
      });
      return false;
    });
    $('#menu-row-settings').on('click', function() {
      var elem, row;
      elem = $('.col.selected');
      if (elem.length) {
        row = $('.col.selected').closest('.row');
        $('#row-settings').show();
        $('#row-id').val(row.attr('id'));
        return $('#row-class').val($.trim(row.attr('class').replace(/row/g, '').replace(/span_\d*/g, '')));
      }
    });
    $('#menu-col-settings').on('click', function() {
      var elem, i, width;
      elem = $('.col.selected');
      $('#col-settings').show();
      $('#col-id').val(elem.attr('id'));
      $('#col-class').val($.trim(elem.attr('class').replace(/selected/g, '').replace(/col/g, '').replace(/span_\d*/g, '')));
      if (elem.length && elem.siblings().length) {
        width = elem.attr('data-width');
        i = 1;
        $('#col-width').attr('data-values', '');
        while (i <= 24 - elem.siblings().length) {
          $('#col-width').attr('data-values', $('#col-width').attr('data-values') + i);
          if (i < 24 - elem.siblings().length) {
            $('#col-width').attr('data-values', $('#col-width').attr('data-values') + ',');
          }
          i++;
        }
        return $('#col-width').text(width);
      }
    });
    $('#menu-content').on('click', function() {
      var elem;
      elem = $('.col.selected');
      if (elem.length) return $('#content-options').show();
    });
    $('#row-id').on('keyup', function() {
      var elem, row, selectedcol;
      elem = $(this);
      selectedcol = $('.col.selected');
      if (selectedcol.length) {
        row = $('.col.selected').closest('.row');
        return row.attr('id', elem.val());
      }
    });
    $('#row-class').on('keyup', function() {
      var elem, row, selectedcol, x, x1, x2;
      elem = $(this);
      selectedcol = $('.col.selected');
      if (selectedcol.length) {
        row = $('.col.selected').closest('.row');
        x1 = row.attr('class').match(/row/g);
        x2 = row.attr('class').match(/span_\d*/g);
        x = x1.concat(x2);
        return row.attr('class', x.toString().replace(/,/g, ' ') + ' ' + elem.val());
      }
    });
    $('#col-id').on('keyup', function() {
      var elem, selectedcol;
      elem = $(this);
      selectedcol = $('.col.selected');
      if (selectedcol.length) return selectedcol.attr('id', elem.val());
    });
    $('#col-class').on('keyup', function() {
      var elem, selectedcol, x, x1, x2, x3;
      elem = $(this);
      selectedcol = $('.col.selected');
      if (selectedcol.length) {
        x1 = selectedcol.attr('class').match(/col/g);
        x2 = selectedcol.attr('class').match(/span_\d*/g);
        x3 = selectedcol.attr('class').match(/selected/g);
        x = x1.concat(x2, x3);
        return selectedcol.attr('class', x.toString().replace(/,/g, ' ') + ' ' + elem.val());
      }
    });
    $('.col-width .sb').on('click', function() {
      return setTimeout(function() {
        return updateColWidth($('#col-width').text());
      }, 10);
    });
    $('#styles').on('keyup', function() {
      var style;
      style = $('#user-styles');
      return style.html($('#styles').val());
    });
    return $('#editor').on('keyup', function() {
      var elem;
      elem = $('.col.selected');
      if (elem.length) {
        return setTimeout(function() {
          return elem.html($('#editor').val());
        }, 50);
      }
    });
  });

}).call(this);
