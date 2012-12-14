/*
 *	dynamicTable:	A jQuery plugin that re-arranges and filters an HTML table based on commands
 *
 *		written by Jonathan Wilson (2012)
 *
 *		Note: 	Beyond DOM re-organization (moves, shows, hides), the affected HTML tables are not decorated in any way.
 *				A separate UI module will be needed to interpret user intent (issue commands) and to display current state.
 *
	Public API:
		Methods:
			$().dynamicTable()
				Constructor
			$().dynamicTable('search',term)
				Filter rows from the table based on the search term, term
			$().dynamicTable('order',i[,asc=true])
				Order the table's rows based on the value of the i'th orderable column.  Ordering is reversed if asc==false (asc=true by default).
			$().dynamicTable('getOrderableTHs')
				Returns a jQuery object holding a reference to the TH of each sortable column.
			$().dynamicTable('getSearchableTHs')
				Returns a jQuery object holding a reference to the TH of each searchable column.
		Events:
			th.order [asc]
				Fires when the column belonging to the TH is ordered.  Order is indicated by asc (asc==true indicates Ascending order).
			th.disorder
				Fires when a formerly-ordered column loses its order (like when another column is ordered).
		Configuration:
			Markup:
				table.dynamicTable-notSearchable
					Disables searching on an entire table
				table.dynamicTable-notOrderable
					Disables ordering on an entire table
				th.dynamicTable-notSearchable
					A column is excluded from a value search when its TH has this class
				th.dynamicTable-notOrderable
					A column cannot be ordered when its TH has this class
				td[data-dynamic-table-order-value="ugly but orderable value"]
					A table cell can *display* its data one way and be *ordered* by its data another way.
					(ie. Pretty but unsortable dates [Nov 10, 2012] VS. ugly but sortable dates [2012-11-10])
					Note: This order value is also searchable.
			Constructor Options:
				case_sensitive [boolean, default: true]
 */
(function($){
	$.fn.dynamicTable = function(method){
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.dynamicTable' );
		}    
	};
	var methods = {

		init: function(options){
			var settings = $.extend({
				case_sensitive:true
			}, options);

			return this.each(function(){
				var table = $(this);
				var head = table.find('thead');
				if(!head.length) head = table.find('tr').first();//improper table formation? take a best-guess on the header row
				var tbody = table.find('tbody');//!important
				var ths = head.find('th');//!important
				var rows = tbody.find('tr');//!important
				var orderableColumns=[];//!important
				var searchableColumns=[];//!important
				var table_data = table.data();
				var table_searchable = !table.hasClass('dynamicTable-notSearchable');
				var table_orderable = !table.hasClass('dynamicTable-notOrderable');
				head.find('th').each(function(i){
					var th = $(this);
					if(table_orderable && !th.hasClass('dynamicTable-notOrderable')){
						orderableColumns.push(i);
					}
					if(table_searchable && !th.hasClass('dynamicTable-notSearchable')){
						searchableColumns.push(i);
					}
				});
				var data={table:table, tbody:tbody, rows:rows, ths:ths, orderableColumns:orderableColumns, searchableColumns:searchableColumns, settings:settings};
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
			var term = data.settings.case_sensitive ? new RegExp(term) : new RegExp(term,'i');
			var matchedTRs = [];
			var unmatchedTRs = [];
			data.rows.each(function(){
				var tr = $(this);
				var rowContents=[];
				var matched = false;
				var tds = tr.find('td');
				for(var i in data.searchableColumns){
					var td = $(tds.get(data.searchableColumns[i]));
					var td_data = td.data();
					rowContents.push(td.text());
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
