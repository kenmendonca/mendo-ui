#Business Logic
##Routing Configuration
The initial configuration of the page is available through the `config.json` file in the working directory. It is an array of pages in the application, in which each element in the array has the keys **title**, **controller**, **pageJSON**, and **stateName**. 

	[
	  {
	    "title": "landing1",
	    "controller": "landing1Controller",
	    "pageJSON": "landing1.json",
	    "stateName" : "landing1"
	  },
	  {
	    "title": "landing2",
	    "controller": "landing2Controller",
	    "pageJSON": "landing2.json",
	    "stateName" : "landing2"
	  }
	]

The **title** corresponds to the title of the page and the name of the page form. For example, if the title of the page was `landing1`, the title of the form would be `landing1Form`.  The **controller** attaches a specific controller to the page. The **pageJSON** corresponds to the JSON that will be used for the rendering of the page. Finally, the **stateName** corresponds to the name of the state for that page. If sub states are needed, then the stateName should be like `parentStateName.childStateName`. There can be as many substates as possible.
##Services
The services are available as dependencies for the controllers. There are three services present: the **dataService**, the **scaffoldService**, and the **validatorService**. The **dataService** contains two subservices as well, **data** and **form**.
###Data
####Model Data
When using the **ScaffoldEditor** or manually editing the **pageJSON**, certain components require a *model* attribute to which the data will persist in the **dataService**.  To access this data, be sure to include the **dataService** dependency and use `dataService.data.{model name}` to get or set the data value. The *model* value in the pageJSON can follow dot notation.
####Form Data
The form subservice contains two attributes of relevance for a controller. The attribute `showErrors` has keys corresponding to each form with values being either `true` or `false`, which has to do with whether a page should show errors or not. The next attribute `{page Title}Form` provides information about the validity of the form as well as validity of the elements of the form.

For example, let's say that the title of my page is **Page1** and that one of the components is like so:

	{
	  "type": "input",
	  "identifier": "testInputIdentifier",
	  "id": "testInputId",
	  "model": "testInputModel",
	  "readonly": false,
	  "disabled": false,
	  "name": "testInputName",
	  "inputType": "text",
	  "sizing": "medium",
	  "label": "An input question",
	  "tooltip": "tooltip",
	  "placeholder": "placeholder",
	  "helpText": "help text",
	  "width": 4,
	  "shown": "show",
	  "validators": [{
	    "condition": "required",
	    "parameter": ""
	  }],
	  "utilities": []
	}

In my *Page1Controller* to get or set the model I would use `dataService.data.testInputModel`. To get the validity of the form, I would use `dataService.form.Page1Form.$valid` which would return a `boolean` to represent the validity of the form. To get the validity of the input, I would use  the *name* of the component in the dot notation like so: `dataService.form.Page1Form.testInputName.$valid` and to get which validators failed, I would use `dataService.form.Page1Form.testInputName.$error`. If a user hadn't filled in this input, `dataService.form.Page1Form.testInputName.$error` would return an Object `{required : true}`.

**dataService.data** information persists from page to page, **dataService.form** information does not.

###Scaffold
The **scaffoldService** is used to change the components themselves. However, any changes to be done to the components must be made after the components have loaded, so they must be wrapped in the scaffoldService.ready function:
	
	scaffoldService.Page1.ready.then(function(){
	  //component changes go here
	});

Each component has its own list of available functions, most of them have `get` and `set` with a list of allowed keys that can be getted or setted and their data types. The *identifier* is used for this. For example if we want to get the set our input component as `readonly`, we can do this:
	
	scaffoldService.ready.then(function(){
	  scaffoldService.Page1.component.input.testInputIdentifier.set('readonly',true);
	});

**scaffoldService** information does not persist from page to page, for example if you set the **testInput** to `readonly` on a button click and the **testInput** is not a default `readonly`, then navigating away and then to **Page1** will not cause **testInput** to remain `readonly`.
####Click Action
Components that function as links, such as a **textAtom** with a link or a **buttonAtom** have a `clickAction` attribute which can provide the link one of three functions: `anchor`, `route`, and `custom`.

An `anchor` is a route to a url that is not part of the application. For instance, if my application wants to route to a relative url `/landing3` which is not part of the application, then I would set the **href** as `/landing3` and the **clickAction** as `anchor`. Automatic form validation does not occur with an anchor, if you would like to do so then using a `custom` **clickAction** would be more applicable.

A `route` refers to routing within the application. The `route` is specified in the **href**. The route can be preceded by form validation, through the **validateForm** attribute, which validates the form associated to that page. If the page has a nested view and the nested view has a form, then the form validation will validate both the page and the nested view. If you would like to only validate the form and not the nested form, then a `custom` **clickAction** would be more applicable.

The `custom` option offers a custom click function to the component through the **scaffoldService**. If the JSON has an entry for **clickFnName**, as it is in the case of the **dropdownAtom** then this would be the name of the function, otherwise *clickFn* is the name of the function. For example, if we had a **buttonAtom** with the identifier *button1* and we wanted a custom click function that had an alert, in the `scaffoldService.ready.then(function(){...});` clause, we would do this:

	scaffoldService.Page1.component.buttonAtom.button1.clickFns.clickFn = function(event){
		alert('hi');
	}	

The `event` passed to the function can be used to see what invoked the function, or perhaps to see if a key was used to click on the link.

####Validator
The validator service is used to provide custom validators, which can be both asynchronous and synchronous (the former for validation relying upon APIs). To specify the use of a custom validator, the *validators* array in the component would need to have an Object with **custom** as a *condition*. The parameter would be **{1}%{2}%{3}** where **{1}** would be either **sync** or **async**, **{2}** would be the name of the validator, and **{3}** would be a parameter to be passed to the validator. For example, if I was going to define a synchronous validator named **testInputValidator** with a parameter of  **testInput**, I would add the following item into the *validators* array in the above input component:

	{
	  "condition" : "custom",
	  "parameter" : "sync%testInputValidator%testInput"
	}

After you have specified the custom validator in the JSON, you can put it in the controller for use, as illustrated below. **validatorService** information persists from page to page. 
#####Synchronous Validators
Client side validations can be done through synchronous validators. To set a validator, use the `validatorService.setValidator` function as follows:

	validatorService.setValidator(true, componentType, validatorName, function(param, value){
	  if((value || "").length === 0)
	    return true;
	  //validator code goes here
	});

The function passed to the validator service must return true if the value  passes the custom validator and false if it does not. The first `if` statement is to not overwrite the *required* validator and produce unexpected results if the *required* validator is present.  Otherwise, the `if` statement is optional. 

For example, if we wanted our component testInput1 to be valid only if it contained the parameter given by the JSON, we would make the validator like so:

	validatorService.setValidator(true, 'input', 'testInputValidator', function(param, value){
	  if((value || "").length === 0)
	    return true;
	  if(value.indexOf(param) != -1)
	    return true;
	  else
	    return false;
	});

#####Asynchronous Validators
Server side validations can be done through asynchronous validators. The parameters of `validatorService.setValidator` are the same except for `false` as the first parameter. Be sure to include `$q` as a dependency, which is an implementation of running functions asynchronously. A deferred object is created through `$q.defer()` and can be either resolved or rejected using `$q.resolve()` or `$q.reject()`, respectively. The deferred object has a key which represents the **promise** and is what should be returned by the asynchronous validator. The validator will run on every key change, so logic would be present in the validator to prevent an excess of API calls.

For example, let's say we want to use an API **/validateZip** for zip validation that accepts POST requests with an object with a single key, `zipCode`, with the zipcode as its value which returns an object with a single key `validZip` which has a value of `true` or `false`.

	validatorService.setValidator(false, 'input', 'testZipValidator', function(param,value){
	  var deferred = $q.defer();
	  //because a valid zip has to be 5 digits
	  if((value || "").length != 5)
	  {
	    deferred.reject();
	  }
	  else
	  {
	    $http.post('/validateZip',{zipCode : value})
	    .success(function(response){
	      var validZip = response.data.validZip;
	      if(validZip)
	        deferred.resolve();
	      else
	        deferred.reject();
	    })
	    .error(function(response){
	      deferred.reject();
	    });
	  }
	return deferred.promise;  
	});
