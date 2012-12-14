(function($){
	$.fn.dynamicTable = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.dynamicTable' );
		}    
	};
	var methods = {
		init: function(){
			return this.each(function(){
				var table = $(this);
				var head = table.find('thead');
				if(!head.length) head = table.find('tr').first();//improper table formation? take a best-guess on the header row
				var tbody = table.find('tbody');//!important
				var ths = head.find('th');//!important
				var rows = tbody.find('tr');//!important
				var orderableColumns=[];//!important
				var searchableColumns=[];//!important
				head.find('th').each(function(i){
					var th = $(this);
					var data = th.data();
					if(!('dynamicTableOrderable' in data) || data.dynamicTableOrderable == 'true'){
						orderableColumns.push(i);
					}
					if(!('dynamicTableSearchable' in data) || data.dynamicTableSearchable == 'true'){
						searchableColumns.push(i);
					}
				});
				var data={tbody:tbody, rows:rows, ths:ths, orderableColumns:orderableColumns, searchableColumns:searchableColumns};
				table.data('dynamicTable',data);
			});
		},
		getOrderableTHs: function(){
			var data = $(this).data('dynamicTable');
			var $list = $();
			for(var i in data.orderableColumns){
				$list = $list.add($(data.ths.get(data.orderableColumns[i])));
			}
			return $list;
		},
		getSearchableTHs: function(){
			var data = $(this).data('dynamicTable');
			var $list = $();
			for(var i in data.searchableColumns){
				$list = $list.add($(data.ths.get(orderableColumns[i])));
			}
			return $list;
		},
		search: function(term){
			var data = $(this).data('dynamicTable');
			var term = new RegExp(term,'i');//case-insensitive
			var matchedTRs = [];
			var unmatchedTRs = [];
			data.rows.each(function(){
				var tr = $(this);
				var rowContents=[];
				var matched = false;
				var tds = tr.find('td');
				for(var i in data.searchableColumns){
					var td = $(tds.get(data.searchableColumns[i]));
					rowContents.push(td.text());
					var td_data = td.data();
					if('dynamicTableOrderValue' in td_data) rowContents.push(td_data.dynamicTableOrderValue); //also allow search by orderValues
				}
				for(var i in rowContents){
					if(rowContents[i].search(term) >= 0){
						matchedTRs.push(tr);	
						matched = true;
						break;
					}
				}
				if(!matched) unmatchedTRs.push(tr);
			});
			for(var i in unmatchedTRs) unmatchedTRs[i].hide();
			for(var i in matchedTRs) matchedTRs[i].show();
		},
		order: function(column, direction){
			var data = $(this).data('dynamicTable');
			if(typeof direction === 'undefined') direction = true;
			var validColumn = false;
			for(var i in data.orderableColumns){
				if(data.orderableColumns[i] == column){
					validColumn = true;
					break;
				}
			}
			if(!validColumn) return;
			//setup orderables
			var rowOrderables = [];
			data.rows.each(function(){
				var tr = $(this);
				var td = $(tr.find('td').get(column));
				var td_data = td.data();
				//console.log(data);
				if('dynamicTableOrderValue' in td_data){
					value = td_data.dynamicTableOrderValue;
				} else {
					var value = td.text();
				}
				rowOrderables.push({
					tr:tr,
					value:value
				});
			});
			//do the sort
			rowOrderables.sort(function(a,b){
				if(a.value > b.value) return 1;
				if(a.value < b.value) return -1;
				return 0;
			});
			for(var i in rowOrderables){
				var orderable = rowOrderables[i];
				if(direction){
					orderable.tr.appendTo(data.tbody);
				} else {
					orderable.tr.prependTo(data.tbody);
				}
			}
			if('orderedTH' in data) data.orderedTH.trigger('disorder');//cleanup 
			data.orderedTH = $(data.ths.get(column)).trigger('order',!!direction);//setup
			$(this).data('dynamicTable',data);//save state
		}
	};
})(jQuery);
