dynamicTable
============

/*
 *  dynamicTable:	A jQuery plugin that re-arranges and filters an HTML table based on commands
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
