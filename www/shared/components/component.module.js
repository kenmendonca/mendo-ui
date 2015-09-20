(function() {
	angular.module('component', [
		//atoms
		'textAtom',
		'plaintextAtom',
		'inputAtom',
		'textareaAtom',
		'selectAtom',
		'radioAtom',
		'checkboxAtom',
		'checkboxListAtom',
		'buttonAtom',
		'dropdownAtom',
		'date',
		'paginationAtom',
		//form related
		'formGroup',
		'radioGroup',
		'checkboxGroup',
		//text related
		'paragraph',
		'inline',
		'tooltip',
		'heading',
		'list',
		'table',
		//utilities
		'utilities',
		//scaffolding
		'componentScaffold',
		'subView',
		//validation ui
		'errorMessages',
		//complex components
		'sortTable',
		'accordion',
		'mediaObject'
		]);
})();
