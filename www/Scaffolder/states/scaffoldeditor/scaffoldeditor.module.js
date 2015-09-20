(function() {
	angular.module('scaffoldeditor', ['data', 'angular-json-editor', 'component'])
		.config(JSONEditor);

	function JSONEditor(JSONEditorProvider) {
		JSONEditorProvider.configure({
			defaults: {
				options: {
					ajax : true,
					theme: 'bootstrap3',
					keep_oneof_values: false,
					disable_edit_json: false,
					disable_collapse: false,
					disable_properties: true,
					no_additional_properties: true,
					required_by_default: true,
					iconlib: "fontawesome4"
				}
			}
		});
	}
})();
