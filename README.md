# UI-Slider-Selector

## Demo
http://chuve.github.io/ui-slider-selector/demo.html

## Dependencies
- "requirejs": "~2.1.14"
- "require-css": "~0.1.5"
- "svg.js": "~1.0.0-rc.9"
- "svg.draggable": "~0.1.0

## Example 
```
require(['ui.slide-selector'], function(SliderSelector) {
	var timeline = new SliderSelector({
		container: 'date-slider-selector',
		segments: ['2007','2008','2009','2010','2011','2012','2013','2014'],
		segmentWidth: 155,
		startPoint: 20,
		divisionSegmentHeight: 6,
		divisionHeight: 3,
		divisions: 12,
		segmentAlign: 'left',
		onDragEndSelect: function(position) {
			console.log(position)
		}
	});

	timeline.setSelectorPosition(['2007','5']);
});
```
