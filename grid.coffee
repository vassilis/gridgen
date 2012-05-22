

	showSelectedTools = () ->
		$('#menu-row-settings, #menu-col-settings, #menu-content').show()
		$('#insert-before, #insert-after').show()

	hideSelectedTools = () ->
		$('#menu-row-settings, #menu-col-settings, #menu-content').hide()
		$('#insert-before, #insert-after').hide()
		$('#row-settings, #col-settings, #content-options').hide()

	$.fn.hasAttr = (name) ->  
		@attr(name) != undefined && @attr(name) != false

	updateColWidth = (width) ->
		elem = $('.selected.col')
		w = eval(elem.attr('data-width'))
		wnew = eval(width)
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

	$ ->

		body = $('body')

		hideSelectedTools()

		$('#menu .button, #logo').not('#menu-container-settings').on 'click', ->
			$('.toolbar').hide()

		$('#menu-container-settings').on 'click', ->
			$('.toolbar').hide()
			$('#container-settings').toggle()

		$('#menu-new-row').on 'click', ->
			$('#new-row').show()
			$('#insert-position').data('o','grid').show()

		$('#menu-styles').on 'click', ->
			if ! $('#user-styles').length
				style = $('<style id="user-styles"></style>')
				style.appendTo('head')
			$('#styles').val($('#user-styles').html())
			$('#styles-panel').show()

		$('#menu-editor').on 'click', ->
			$('#editor').val($('.col.selected').html())
			$('#editor-panel').show()

		$("#container-width").on 'keyup', ->
			$("#page").css "width", $(this).val()

		$('.adjustable').each ->
			elem = $(this)
			if elem.hasAttr('data-values')
				values = elem.attr('data-values').replace(/\ /g, '').split(',')
				elem.text(values[0])
			else
				elem.text(0)

		body.on 'click', '.sb-plus, .sb-minus', (e) ->
			elem = $(this)
			field = elem.siblings('.adjustable').first()
			value = field.text()
			if field.hasAttr('data-values')
				values = field.attr('data-values').replace(/\ /g, '').split(',')
				if value in values
					if $(e.target).hasClass('sb-plus') and values.indexOf(value) < values.length - 1
						field.text(values[values.indexOf(value) + 1])
					else if $(e.target).hasClass('sb-minus') and values.indexOf(value) > 0
						field.text(values[values.indexOf(value) - 1])
				else
					field.text(values[0])
			else
				if typeof value != 'undefined'
					if $(e.target).hasClass('sb-plus') 
						field.text(eval(value + 1))
					else if $(e.target).hasClass('sb-minus')
						if value > 0 or elem.hasClass('allow-negative')
							field.text(eval(value - 1))
				else
					if $(e.target).hasClass('sb-plus') 
						field.text(1)
					else if $(e.target).hasClass('sb-minus') and elem.hasClass('allow-negative')
						field.text(-1)


		$('#insert-before, #insert-prepend, #insert-append, #insert-after').on 'click', (e) ->
			o = $('#insert-position').data('o')
			if o == 'grid'
				columns = eval($("#grid-columns").text())
				# gutter = eval($("#grid-gutter").val())
				row = $('<section class="row span_24"></section>')
				i = 1
				while i <= columns
					w =  24 / columns 
					col = '<div class="col span_' + w + '" data-width="' + w + '"></div>'
					row.append col
					i++
				selectedcol = $('.col.selected')
				if selectedcol.length
					selectedrow = selectedcol.closest('.row')
					if $(e.target).attr('id') == 'insert-before'
						selectedrow.before row
					else if $(e.target).attr('id') == 'insert-prepend'
						selectedcol.prepend row
					else if $(e.target).attr('id') == 'insert-append'
						selectedcol.append row
					else if $(e.target).attr('id') == 'insert-after'
						selectedrow.after row
				else if $(e.target).attr('id') == 'insert-prepend'
					$("#page").prepend row
				else if $(e.target).attr('id') == 'insert-append'
					$("#page").append row

		body.on 'click', '.col', ->
			elem = $(this)
			$('.col.selected').removeClass 'selected'
			elem.addClass 'selected'
			showSelectedTools()
			if $('#col-settings').is(':visible')
				$('#menu-col-settings').click()
			else if $('#row-settings').is(':visible')
				$('#menu-row-settings').click()
			else if $('#editor').is(':visible')
				$('#menu-editor').click()
			if elem.siblings().length then $('#col-width').parent().show() else $('#col-width').parent().hide()
			elem.on 'clickoutside', (e) ->
				unless $(e.target).hasClass('toolbar')\
					or $(e.target).attr('id') == 'menu'\
					or $(e.target).parents('.toolbar, #menu').length
						elem.removeClass 'selected'
						unless $(e.target).hasClass('col')
							hideSelectedTools()
						elem.off 'clickoutside'
			return false

		$('#menu-row-settings').on 'click', ->
			elem = $('.col.selected')
			if elem.length
				row = $('.col.selected').closest('.row')
				$('#row-settings').show()
				# id
				$('#row-id').val(row.attr('id'))
				# classes
				$('#row-class').val($.trim(row.attr('class').replace(/row/g, '').replace(/span_\d*/g, '')))

		$('#menu-col-settings').on 'click', ->
			elem = $('.col.selected')
			$('#col-settings').show()
			# id
			$('#col-id').val(elem.attr('id'))
			# classes
			$('#col-class').val($.trim(elem.attr('class').replace(/selected/g, '').replace(/col/g, '').replace(/span_\d*/g, '')))
			# width
			if elem.length and elem.siblings().length
				width = elem.attr('data-width')
				# $('.col.selected').removeClass 'selected'
				# elem.addClass 'selected'
				i = 1
				$('#col-width').attr('data-values', '')
				while i <= 24 - elem.siblings().length
					$('#col-width').attr('data-values', $('#col-width').attr('data-values') + i)
					if i < 24 - elem.siblings().length then $('#col-width').attr('data-values', $('#col-width').attr('data-values') + ',')
					i++
				$('#col-width').text(width)

		$('#menu-content').on 'click', ->
			elem = $('.col.selected')
			if elem.length
				$('#content-options').show()

		$('#row-id').on 'keyup', ->
			elem = $(this)
			selectedcol = $('.col.selected')
			if selectedcol.length
				row = $('.col.selected').closest('.row')
				row.attr('id', elem.val())

		$('#row-class').on 'keyup', ->
			elem = $(this)
			selectedcol = $('.col.selected')
			if selectedcol.length
				row = $('.col.selected').closest('.row')
				x1 = row.attr('class').match(/row/g)
				x2 = row.attr('class').match(/span_\d*/g)
				x = x1.concat(x2)
				row.attr('class', x.toString().replace(/,/g, ' ') + ' ' + elem.val())

		$('#col-id').on 'keyup', ->
			elem = $(this)
			selectedcol = $('.col.selected')
			if selectedcol.length
				selectedcol.attr('id', elem.val())

		$('#col-class').on 'keyup', ->
			elem = $(this)
			selectedcol = $('.col.selected')
			if selectedcol.length
				x1 = selectedcol.attr('class').match(/col/g)
				x2 = selectedcol.attr('class').match(/span_\d*/g)
				x3 = selectedcol.attr('class').match(/selected/g)
				x = x1.concat(x2, x3)
				selectedcol.attr('class', x.toString().replace(/,/g, ' ') + ' ' + elem.val())

		$('.col-width .sb').on 'click', ->
			setTimeout(
				->
					updateColWidth($('#col-width').text())
				, 10
			)

		$('#styles').on 'keyup', ->
			style = $('#user-styles')
			style.html($('#styles').val())

		$('#editor').on 'keyup', ->
			elem = $('.col.selected')
			if elem.length
				setTimeout(
					->
						elem.html($('#editor').val())
					, 50
				)