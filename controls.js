$(function(){
	$('table').each(function(){
		var table = $(this);
		var table_data = table.data();
		if(!('dynamicTableSearchable' in table_data) || table_data.dynamicTableSearchable){
			//searchable!
			var searchInput = $('<input>').attr({type:'search', placeholder:'Search'});
			var searchContainer = table.find('.dynamicTable-searchContainer');
			if(searchContainer.length){
				searchInput.appendTo(searchContainer).css('margin',0);
			} else {
				searchInput.insertBefore(table);
			}
			searchInput
				.on('keydown keyup',function(){
					var term = $(this).val();
					table.dynamicTable('search',term);
				})
				.val('')
			;
		}
		//three important bits of mutable state
		var ordered_th_indicator;
		var ordered_th;
		var current_order;
		table.dynamicTable({case_sensitive:false});
		table.dynamicTable('getOrderableTHs').each(function(){
			var th =  $(this);
			//each TH needs three indicators
			var u = $('<i></i>').addClass('icon-arrow-up').css('float','right');
			var d = $('<i></i>').addClass('icon-arrow-down').css('float','right');
			var o = $('<i></i>').addClass('icon-resize-vertical').css('opacity','0.3').css('float','right');
			th
				//initialize each TH
				.append(o)
				.addClass('orderable')
				//interpret user input on each TH
				.on('click',function(){
					if(ordered_th && ordered_th === th){
						table.dynamicTable('order', th.index(), !current_order);
					} else {
						table.dynamicTable('order', th.index(), true);
					}
				})
				//update display when things happen to each TH
				.on('order',function(e,asc){
					o.detach();
					if(asc){
						ordered_th_indicator = u.appendTo(th);
						ordered_th = th.addClass('ordered ordered-asc');
					} else {
						ordered_th_indicator = d.appendTo(th);
						ordered_th = th.addClass('ordered ordered-desc');
					}
					current_order = asc;
				})
				.on('disorder',function(){
					o.appendTo(th);
					ordered_th_indicator.detach();
					th.removeClass('ordered').removeClass('ordered-asc').removeClass('ordered-desc');
				})
			;
		});
	});
});
