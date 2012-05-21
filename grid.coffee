

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

		body = $('body')

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
					w =  24 / columns 
					col = '<div class="col span_' + w + '" data-width="' + w + '"></div>'
					row.append col
					i++
				$("#page").append row

		body.on 'click', '.col', ->
			elem = $(this)
			if elem.siblings().length
				width = elem.attr('data-width')
				# $('.col.selected').removeClass 'selected'
				elem.addClass 'selected'
				$('#col-options').show()
				i = 1
				$('#col-width').html('')
				while i <= 24 - elem.siblings().length
					$('#col-width').append '<option value="' + i + '">' + i + '</option>'
					i++
				$('#col-width').val(width).focus()
				elem.on 'clickoutside', (e) ->
					unless $(e.target).attr('id') is 'col-width' or $(e.target).parent().attr('id') is 'col-width'
						elem.removeClass 'selected'
						elem.off 'clickoutside'

		$('#col-width').on 'change keyup', (e) ->
			if $('.col.selected').length and e.which is 46
				$('.col.selected').closest('.row').remove()
				$('#col-options').hide()
			elem = $('.selected.col')
			w = eval(elem.attr('data-width'))
			wnew = eval($(this).val())
			diff = eval(w - wnew)
			group = []
			elem.nextAll().each ->
				group.push($(this))
			elem.prevAll().each ->
				group.push($(this))
			if diff != 0
				i = 1
				while i <= Math.abs(diff)
					s = ''
					$(group).each (index) ->
						if diff < 0
							tw = eval($(this).attr('data-width'))
							if tw > 1 
								s = $(this)
								return false
						else
							s = $(this)
							return false
					if s != ''
						sw = eval(s.attr('data-width'))
						swnew = if diff > 0 then eval(sw + 1) else eval(sw - 1) 
						elem.removeClass('span_' + w).addClass('span_' + wnew).attr('data-width', wnew)
						s.removeClass('span_' + sw).addClass('span_' + swnew).attr('data-width', swnew)
					i++