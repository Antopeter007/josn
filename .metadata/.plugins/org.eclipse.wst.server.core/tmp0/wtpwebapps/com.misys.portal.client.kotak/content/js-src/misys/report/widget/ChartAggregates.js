dojo.provide("misys.report.widget.ChartAggregates");
dojo.experimental("misys.report.widget.ChartAggregates"); 

dojo.require("misys.report.widget.Aggregates");

// our declared class
dojo.declare("misys.report.widget.ChartAggregates",
	[ misys.report.widget.Aggregates ],
	// class properties:
	{
		xmlTagName: 'chart_aggregates',
		layout: [
					{ name: 'Axis Y', field: 'column', formatter: misys.getColumnDecode, width: '40%' },
					{ name: 'Type', field: 'type', formatter: misys.getAggregateOperatorDecode, width: '40%' },
					{ name: ' ', field: 'actions', formatter: misys.grid.formatReportActions, width: '10%' }
					],
					
		startup: function()
		{
			if(this._started) { return; }
			
			this.inherited(arguments);
			
			// Disable the Add button if required as only one aggregate is allowed
			this.toggleAddButton();
		},

		toggleAddButton: function()
		{
			var isAddButtonActivated = true;
			if (this.grid && this.grid.rowCount > 0)
			{
				isAddButtonActivated = false;
			}
			this.addButtonNode.set('disabled', !isAddButtonActivated);
		},
		
		handleGridAction: function(event)
		{
			this.inherited(arguments);
			
			// If the remove button is clicked, the Add button is reactivated
			if(event.target.tagName == 'IMG' && event.target.attributes.type)
			{
				if(event.target.attributes.type.value == 'remove')
				{
					//this.addButtonNode.set('disabled', false);
					this.toggleAddButton();
				}
			}
		},

    	updateData: function()
		{
			this.inherited(arguments);
			
			// Disable the Add button if required as only one aggregate is allowed
			this.toggleAddButton();
		}
	}
);