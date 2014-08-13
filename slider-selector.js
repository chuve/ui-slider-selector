/**
 * Slider Selector UI
 * Created by Chuvelev Evgeny on 18/07/14.
 * e.chuvelev@gmail.com
 */

define(['svg','svg.draggable','css!assets/css/slide-selector.css'], function(SVG){

	/*
	Options: {
		container: Container ID for initialization ( Example: 'date-slider-selector' )
		segments: Array with segment values ( Example: ['2007','2008','2009','2010','2011','2012','2013','2014'] )
		segmentWidth: Segment width in px ( Example: 155 )
		startPoint: Start position for the first segment in px ( Example: 20 )
		divisionSegmentHeight: Height of segment division in px ( Example: 6 )
		divisionHeight: Height of division in px ( Example: 3 )
		divisions: Number of division per segment ( Example: 12 )
		segmentAlign: Value of align line in container ( Example: 'left' or 'right' or 'center' )
		onDragEndSelect: callback function with value of position after select ( Example: function(position) { console.log(position); } )
	}
	 */

	/**
	 * @constructor
	 * @param options - {Object} with settings
	 */
	return SliderSelector = function(options){

		// private methods
		var _draw = {

			getContainerNode: document.getElementById(options.container),

			coordinates: {
				line: {
					y: 33,
					width: options.segments.length * options.segmentWidth + options.startPoint
				}
			},

			canvas: SVG(options.container).size(options.segments.length * options.segmentWidth + options.startPoint, '100%'),

			drawLineCoordinates: function() {
				return line = this.canvas.line(0, this.coordinates.line.y, this.coordinates.line.width, this.coordinates.line.y).stroke({ width: 1, color: '#bdc3c7' });
			},

			drawSegments: function(selector, height) {
				var divisionHeight = this.coordinates.line.y - height,
					startPointX = options.startPoint,
					self = this;

				options.segments.forEach(function(segment){
					self.canvas.line(startPointX, self.coordinates.line.y, startPointX, divisionHeight).stroke({ width: 1, color: '#bdc3c7' });
					self.drawSegmentText(selector, segment, startPointX, self.coordinates.line.y);
					self.drawDivisions(startPointX, options.divisionHeight);
					startPointX += options.segmentWidth;
				});
			},

			drawSegmentText: function(selector, segment, pointX, pointY) {
				var segmentText = this.canvas.text(segment),
					self = this;

				segmentText.addClass('slider-selector__segmentText');

				segmentText.on('mouseover', function(event) {
					segmentText.addClass('slider-selector__segmentText--hover');
				});
				segmentText.on('mouseout', function(event) {
					segmentText.removeClass('slider-selector__segmentText--hover');
				});
				segmentText.on('click', function(event) {
					selector.animate({ ease: '>', duration: '0.5s' }).cx(pointX);
					options.onDragEndSelect( self.converterToValue( pointX ) );
				});

				segmentText.cx(pointX);

				return segmentText;
			},

			drawDivisions: function(pointX, height) {
				var divisionHeight = this.coordinates.line.y - height,
					divisionSpace = options.segmentWidth / options.divisions,
					startPointX =  pointX + divisionSpace,
					self = this;

				for(var i = 0; i < options.divisions-1; i++){
					self.canvas.line(startPointX, this.coordinates.line.y, startPointX, divisionHeight).stroke({ width: 1, color: '#bdc3c7' });
					startPointX += divisionSpace;
				}
			},

			drawSelector: function() {
					var self = this,
						minX,
						maxX,
						X,
						isLineLonger = self.coordinates.line.width > self.getContainerNode.offsetWidth,
						selector = this.canvas.image('assets/images/selector.png')
									.y(this.coordinates.line.y)

					selector.attr('class', 'slider-selector__selector');

					selector.draggable(function(x,y) {
						var posY = false,
							posX = ( x > minX && x < maxX ) ? x : false;

						return { x: posX, y: posY }
					});


					selector.beforedrag = function() {
						minX = -self.canvas.node.offsetLeft;

						if (isLineLonger) {
							maxX = -self.canvas.node.offsetLeft + self.getContainerNode.offsetWidth - options.startPoint - 10;
						}else{
							maxX = self.coordinates.line.width - options.startPoint - 10;
						}

						X = this.x();
					};

					selector.dragend = function(delta) {
						var newPosition = X + delta.x;

						if (isLineLonger) {

							if( ( newPosition < minX ) || ( newPosition > maxX ) ){

								if( (newPosition < 0)  ){
									self.setViewLine('left');
								}

								if( newPosition > self.coordinates.line.width ){
									self.setViewLine('right');
								}

								self.setViewLine(delta.x);
							}

						}

						options.onDragEndSelect( self.converterToValue( selector.x() ) );
					}
				return selector;
			},

			converterToСoordinates: function(value) {
				if (Object.prototype.toString.call(value) === '[object Array]') {

					var segmentPosition = options.segments.indexOf(value[0]) * options.segmentWidth,
						divisionPosition = value[1] *  (options.segmentWidth / options.divisions);

					value = segmentPosition + divisionPosition;
				}

				return value;
			},

			converterToValue: function(coordinate) {
				var countDivision = coordinate / (options.segmentWidth / options.divisions),
					countSegment = Math.floor(countDivision / options.divisions),

					segmentValue = options.segments[countSegment],
					divisionValue = Math.ceil( countDivision - (countSegment * options.divisions) );

					divisionValue = (divisionValue !== 0) ? divisionValue : 1;

				return [segmentValue, divisionValue];
			},

			setViewLine: function(position) {
				var containerWidth = this.getContainerNode.offsetWidth;

				this.canvas.style({
					'position': 'relative'
				});

				if (Object.prototype.toString.call(position) === '[object String]') {
					switch (position) {
						case 'left':
							this.canvas.style({
								'left': 0 + 'px'
							});
							break;
						case 'right':
							this.canvas.style({
								'left': containerWidth - this.coordinates.line.width + 'px'
							});
							break;
						case 'center':
							this.canvas.style({
								'left': ( (containerWidth - this.coordinates.line.width) / 2 ) + 'px'
							});
							break;
						default:
							this.canvas.style({
								'left': 0 + 'px'
							});
					}
				}

				if (Object.prototype.toString.call(position) === '[object Number]') {
					var presentLeftPosition = this.canvas.node.offsetLeft,
						resultLeftPosition = presentLeftPosition - position,
						minLeft = 0,
						maxLeft = this.getContainerNode.offsetWidth - this.coordinates.line.width;

					if ( !(resultLeftPosition < maxLeft) && !(resultLeftPosition > minLeft) ){
						this.canvas.style({
							'left': (resultLeftPosition) + 'px'
						});
					}

				}

			}

		};

		// initialization
		return (function(){

			var selector = _draw.drawSelector(),
				line = _draw.drawLineCoordinates(),
				segments = _draw.drawSegments(selector, options.divisionSegmentHeight);

			_draw.getContainerNode.classList.add('slider-selector');

			(options.segmentAlign) ? _draw.setViewLine(options.segmentAlign) : _draw.setViewLine('left');

			// public methods (API)
			return {

				/**
				 * Set selector position
				 * @param value {number} or {array} ( Example: ["2008", 1] or 200 )
				 * @returns {number}
				 */
				setSelectorPosition: function(value){
					X = _draw.converterToСoordinates(value);
					selector.x(X);
					return X
				},

				/**
				 * Get selector position
				 * @returns {array} with values of current segment and number of divisions ( Example: ["2008", 1] )
				 */
				getSelectorPosition: function(){
					var selectorPosition = selector.x();

					return _draw.converterToValue(selectorPosition);
				}

			}

		}());

	};

});