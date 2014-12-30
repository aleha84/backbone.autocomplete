backbone.autocomplete
=====================

backbone autocomplete with ability to enter part of entity name or select it from tree

It is not out-of-a-box solution. 

Dependencies:

- JQuery
- JQuery-UI
- underscorejs
- backbonejs
- jquery.fancytree
- backbone.deep-model

API:

Method  | Parameter | Description
------------- | -------------  | ------------- 
getId  | undefIfZero | returns id of selected value. If `undefIfZero` is true and result is 0 undefined will be returned, otherwise 0
getName | - | returns name of selected value
getDepartment | - | returns department object `{ DepartmentID = ..., DepartmentName= ... }` of selected value
clearSelection | - | cleans selection
setById | id | sets value by it `id`
setSelected | id, name | sets `id` and `name` of value without checking collection
findById | id | finds value by its `id`

Collection data format:

```

var exampleCollection = [
{
  Id: 1,
  Name: "Departmant1",
  Selected: false,
  Value: [
    {
      Id: 1,
      Name: "Kim Kardashian",
      Selected: false
    }
  ]
}
];

// selected property just for consistence

```

Initialize options:

Name  | Description
------------- | -------------  
selectedId | renders control with selected value by its id
collection | collection of departments with employees


Example: 

```

var us = new UserSelector(
	{ 
		model: new UserSelectorModel(
			{ 
				selectedId: undefined
			}), 
  		collection: new Backbone.Collection(exampleCollection) 
    	}
    );

$("#example").html(us.el);

```
Demo: 
http://aleha84.github.io/backbone.autocomplete/
