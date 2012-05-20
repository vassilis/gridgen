

	updateColsWidth = ->
		gutter = $("#gutter").val() * 1
		columns = $("#columns").val() * 1
		w = $("#canvas").width() - (gutter * (columns - 1) / columns) - calcColsWidth()
		$(".col").css "width", ($("#canvas").width() - (gutter * (columns - 1))) / columns
		$(".col").not(":last").css "margin-right", gutter
		showColumnsWidths()

	showColumnsWidths = ->
		$("#columns-width input").each ->
			$(this).val $(".col").eq($(this).index()).width()

	resizeCol = (elem) ->
		gutter = $("#gutter").val() * 1
		columns = $("#columns").val() * 1
		cols = []
		$(".col").each ->
			cols.push $(this)  if $(this).index() > elem.index()
		$(cols.reverse()).each ->
			if $(this).width() > 40
				newColWidth $(this)
			else
				newColWidth $(".col:last")
		showColumnsWidths()

	newColWidth = (col) ->
		gutter = $("#gutter").val() * 1
		columns = $("#columns").val() * 1
		width = $("#canvas").width() - (gutter * (columns - 1)) - calcColsWidth(col)
		col.css "width", width

	calcColsWidth = (col) ->
		width = 0
		$(".col").not(col).each ->
			width += $(this).width()
		width

	maxWidth = (col) ->
		width = 0
		gutter = $("#gutter").val() * 1
		columns = $("#columns").val() * 1
		prevColsWidth = 0
		nextCols = []
		$(".col").not(col).each ->
			prevColsWidth += $(this).width()  if $(this).index() < col.index()
			nextCols.push $(this)  if $(this).index() > col.index()
		width = $("#canvas").width() - ($("#gutter").val() * (columns - 1)) - prevColsWidth - (40 * nextCols.length)
		width

	$ ->

		# menu

		$('#menu .button').on 'click', ->
			$('.toolbar').hide()

		$('#menu-page').on 'click', ->
			$('#page-options').toggle()

		$('#menu-insert').on 'click', ->
			$('#insert-options').toggle()

		$('#insert-grid').on 'click', ->
			$('#grid-options').show()
			$('#insert-position').data('o','grid').show()

		$("#page-width").on 'keypress', ->
			$("#page").css "width", $(this).val()

		# $("#page-position").bind "change keyup", ->
		# 	pos = $(this).val()
		# 	$("#page").css "margin", "0 auto"  if pos is "center"
		# 	$("#page").css "margin", "0 0 0 auto"  if pos is "right"
		# 	$("#page").css "margin", "0"  if pos is "left"

		$('#insert-append').on 'click', ->
			o = $('#insert-position').data('o')
			if o == 'grid'
				columns = eval($("#grid-columns").val())
				# gutter = eval($("#grid-gutter").val())
				row = $('<section class="row span_24"></section>')
				i = 1
				while i <= columns
					col = '<div class="col span_' + 24 / columns + '"></div>'
					row.append col
					i++
				$("#page").append row

		$("#columns").keyup ->
			elem = $(this)
			gutter = eval($("#gutter").val())
			columns = eval(elem.val())
			# $("#columns-width").remove()
			# $("#canvas").html ""
			# elem.after "<div id=\"columns-width\">:</div>"
			i = 1
			while i <= columns
				# $("#columns-width").append "<input type=\"text\" readonly=\"readonly\"></input>"
				$("#canvas").append "<div class=\"col\" contenteditable=\"true\"></div>"
				$(".col").css "width", $("#canvas").width() / columns
				$("#gutter").val 10
				updateColsWidth()
				$(".col").not(":last").resizable
					handles: "e"
					minWidth: 40
					resize: (event, ui) ->
						$(this).addClass('resize')
						$(this).css "max-width", maxWidth($(this))
						resizeCol $(this)

					stop: (event, ui) ->
						$(this).removeClass('resize')
				i++

		$("#gutter").keyup ->
			updateColsWidth()