dojo.provide("misys.report.widget.GroupingAggregates");
dojo.experimental("misys.report.widget.GroupingAggregates"); 

dojo.require("misys.report.widget.Aggregates");

// our declared class
dojo.declare("misys.report.widget.GroupingAggregates",
	[ misys.report.widget.Aggregates ],
	// class properties:
	{
		xmlTagName: 'grouping_aggregates'
	}
);