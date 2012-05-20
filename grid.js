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
      var col, columns, i, o, row;
      o = $('#insert-position').data('o');
      if (o === 'grid') {
        columns = eval($("#grid-columns").val());
        row = $('<section class="row span_24"></section>');
        i = 1;
        while (i <= columns) {
          col = '<div class="col span_' + 24 / columns + '"></div>';
          row.append(col);
          i++;
        }
        return $("#page").append(row);
      }
    });
    $("#columns").keyup(function() {
      var columns, elem, gutter, i, _results;
      elem = $(this);
      gutter = eval($("#gutter").val());
      columns = eval(elem.val());
      i = 1;
      _results = [];
      while (i <= columns) {
        $("#canvas").append("<div class=\"col\" contenteditable=\"true\"></div>");
        $(".col").css("width", $("#canvas").width() / columns);
        $("#gutter").val(10);
        updateColsWidth();
        $(".col").not(":last").resizable({
          handles: "e",
          minWidth: 40,
          resize: function(event, ui) {
            $(this).addClass('resize');
            $(this).css("max-width", maxWidth($(this)));
            return resizeCol($(this));
          },
          stop: function(event, ui) {
            return $(this).removeClass('resize');
          }
        });
        _results.push(i++);
      }
      return _results;
    });
    return $("#gutter").keyup(function() {
      return updateColsWidth();
    });
  });

}).call(this);
