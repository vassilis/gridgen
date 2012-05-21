

	$ ->

		body = $('body')

		$('#menu .button').not('#menu-container-settings').on 'click', ->
			$('.toolbar').hide()

		$('#menu-container-settings').on 'click', ->
			$('.toolbar').hide()
			$('#container-settings').toggle()

		$('#menu-add-row').on 'click', ->
			$('#new-row').show()
			$('#insert-position').data('o','grid').show()

		$("#container-width").on 'keyup', ->
			$("#page").css "width", $(this).val()

		$('#insert-before, #insert-prepend, #insert-append, #insert-after').on 'click', (e) ->
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
				selectedcol = $('.col.selected')
				if selectedcol.length
					selectedrow = selectedcol.closest('.row')
					if $(e.target).attr('id') == 'insert-before' and selectedcol.length
						selectedrow.before row
					else if $(e.target).attr('id') == 'insert-after' and selectedcol.length
						selectedrow.after row
				else if $(e.target).attr('id') == 'insert-prepend'
					$("#page").prepend row
				else if $(e.target).attr('id') == 'insert-append'
					$("#page").append row

		body.on 'click', '.col', ->
			elem = $(this)
			$('.col.selected').removeClass 'selected'
			elem.addClass 'selected'
			if $('#col-settings').is(':visible')
				$('#menu-col-settings').click()
			else if $('#row-settings').is(':visible')
				$('#menu-row-settings').click()
			elem.on 'clickoutside', (e) ->
				unless $(e.target).parents('.toolbar, #menu').length
					elem.removeClass 'selected'
					unless $(e.target).hasClass('col')
						$('#col-settings, #row-settings').hide()
					elem.off 'clickoutside'

		$('#menu-row-settings').on 'click', ->
			elem = $('.col.selected')
			if elem.length
				row = $('.col.selected').closest('.row')
				$('#row-settings').show()

		$('#menu-col-settings').on 'click', ->
			elem = $('.col.selected')
			if elem.length and elem.siblings().length
				width = elem.attr('data-width')
				# $('.col.selected').removeClass 'selected'
				# elem.addClass 'selected'
				$('#col-settings').show()
				i = 1
				$('#col-width').html('')
				while i <= 24 - elem.siblings().length
					$('#col-width').append '<option value="' + i + '">' + i + '</option>'
					i++
				$('#col-width').val(width).focus()

		$('#col-width').on 'change keyup', (e) ->
			if $('.col.selected').length and e.which is 46
				$('.col.selected').closest('.row').remove()
				$('#col-settings').hide()
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