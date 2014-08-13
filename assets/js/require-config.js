require.config({
	map: {
		'*': {
			'css':              '/bower_components/require-css/css.js'
		}
	},
	paths: {
		'svg': 				    '/bower_components/svg.js/svg.min',
		'svg.draggable':	    '/bower_components/svg.draggable.js/svg.draggable.min',
		'ui.slide-selector':	'slider-selector'
	},
	shim: {
		'svg': {
			exports: 'SVG'
		},
		'svg.draggable': {
			deps: ['svg'],
			exports: 'SVG'
		}
	}
});