<cfinclude template="data.cfm">
<cfoutput>
<!DOCTYPE HTML>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
	<script src="/universal/javascript/jquery.js"></script>
	<link rel="stylesheet" href="http://dev.ucanr.edu/jw/dynamicTable/bootstrap/css/bootstrap.css">
	<script src="jQuery.dynamicTable.min.js"></script>
	<script src="jQuery.dynamicTable.bootstrap.min.js"></script>
	<style>
		th.orderable {
			cursor:pointer;
		}
	</style>
	<script>
		var t;
		$(function(){
			$('table').dynamicTableBootstrap();
		});
	</script>
</head>
<body style="padding:1em;">
	<table class="table table-bordered">
		<thead>
			<tr>
				<th>Last Name</th>
				<th>First Name</th>
				<th>Date of Birth</th>
				<th class="dynamicTable-notOrderable dynamicTable-notSearchable">Status</th>
				<th class="dynamicTable-notOrderable dynamicTable-notSearchable dynamicTable-searchContainer"></th>
			</tr>
		</thead>
		<tbody>
			<cfloop array="#data#" index="d">
				<tr>
					<td>#d.lastname#</td>
					<td>#d.firstname#</td>
					<td data-dynamic-table-order-value="#d.dob#">#dateFormat(d.dob)#</td>
					<td>#d.status#</td>
					<td>
						<div class="btn-group">
							<a href="" class="btn btn-mini">Edit</a>
							<a href="" class="btn btn-mini">View</a>
						</div>
					</td>
				</tr>
			</cfloop>
		</tbody>
	</table>
</body>
</html>
</cfoutput>
