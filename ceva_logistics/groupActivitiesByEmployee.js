var activity=[
    {
        "ID": 64,
        "UserID": 7,
        "EmployeeID": "CLGAXO",
        "SiteName": "MULGRAVE",
        "BusinessUnitName": "Telstra Logistics - Melbourne",
        "AccountName": "IBM AUSTRALIA LTD",
        "GroupName": "Transport",
        "CategoryName": "Activity - Productive",
        "TypeName": "Transport - Freight Sorting",
        "Date": "2018-02-14",
        "Duration": "00:30",
        "IsProcessed": false
    },
    {
        "ID": 66,
        "UserID": 7,
        "EmployeeID": "CLGAXO",
        "SiteName": "MULGRAVE",
        "BusinessUnitName": "Telstra Logistics - Melbourne",
        "AccountName": "IBM AUSTRALIA LTD",
        "GroupName": "Picking",
        "CategoryName": "Activity - Productive",
        "TypeName": "Picking - Bulk",
        "Date": "2018-02-15",
        "Duration": "00:30",
        "IsProcessed": false
    },
    {
        "ID": 67,
        "UserID": 7,
        "EmployeeID": "CLGAXO",
        "SiteName": "MULGRAVE",
        "BusinessUnitName": "Telstra Logistics - Melbourne",
        "AccountName": "IBM AUSTRALIA LTD",
        "GroupName": "CPE RASS",
        "CategoryName": "Activity - Productive",
        "TypeName": "CPE RASS",
        "Date": "2018-02-15",
        "Duration": "00:15",
        "IsProcessed": false
    },
    {
        "ID": 71,
        "UserID": 7,
        "EmployeeID": "CLGAXO",
        "SiteName": "MULGRAVE",
        "BusinessUnitName": "Telstra Logistics - Melbourne",
        "AccountName": "IBM AUSTRALIA LTD",
        "GroupName": "Inventory",
        "CategoryName": "Activity - Unproductive",
        "TypeName": "Inventory Relocation's",
        "Date": "2018-02-15",
        "Duration": "01:30",
        "IsProcessed": false
    },
    {
        "ID": 72,
        "UserID": 5,
        "EmployeeID": "HENDERSA",
        "SiteName": "MULGRAVE",
        "BusinessUnitName": "Telstra Logistics - Melbourne",
        "AccountName": "IBM AUSTRALIA LTD",
        "GroupName": "CPE",
        "CategoryName": "Activity - Productive",
        "TypeName": "CPE",
        "Date": "2018-02-15",
        "Duration": "00:30",
        "IsProcessed": false
    },
    {
        "ID": 90,
        "UserID": 5,
        "EmployeeID": "HENDERSA",
        "SiteName": "MULGRAVE",
        "BusinessUnitName": "Telstra Logistics - Melbourne",
        "AccountName": "IBM AUSTRALIA LTD",
        "GroupName": "CPE RASS",
        "CategoryName": "Activity - Productive",
        "TypeName": "CPE RASS",
        "Date": "2018-03-14",
        "Duration": null,
        "IsProcessed": false
    }
];


const groupedByEmployee = activity.reduce((acc, item) => {
  (acc[item.EmployeeID] = acc[item.EmployeeID] || []).push(item);
  return acc;
}, {});

console.log(groupedByEmployee)