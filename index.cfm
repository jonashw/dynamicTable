<cfinclude template="data.cfm">
<cfoutput>
<!DOCTYPE HTML>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title></title>
	<script src="/universal/javascript/jquery.js"></script>
	<link rel="stylesheet" href="http://dev.ucanr.edu/jw/dynamicTable/bootstrap/css/bootstrap.css">
	<script src="jQuery.dynamicTable.js"></script>
	<script src="controls.js"></script>
	<style>
		th.orderable {
			cursor:pointer;
		}
	</style>
</head>
<body style="padding:1em;">
	<table class="table table-bordered" data-dynamic-table-orderable="true" data-dynamic-table-searchable="true">
		<thead>
			<tr>
				<th>Last Name</th>
				<th>First Name</th>
				<th>Date of Birth</th>
				<th>Status</th>
				<th data-dynamic-table-orderable="false" data-dynamic-table-searchable="false" class="dynamicTable-searchContainer"></th>
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
