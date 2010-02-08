/*
---
description: DoubleSlider

authors:
  - Matthias Goebels (http://moo.medienpark.net)

license: MIT-style

requires:
  - core/1.2.4: Class.Extras
  - core/1.2.4: Array
  - core/1.2.4: Function
  - core/1.2.4: Event
  - core/1.2.4: Element.Style
  - core/1.2.4: Element.Dimensions
  - core/1.2.4: Fx.Morph
  - core/1.2.4: Fx.Transitions

provides: [DoubleSlider]
*/
var DoubleSlider = new Class({

	Implements: [Events, Options],

	Binds: ['onDrag', 'onStart', 'onComplete'],

	options:
	{/*
		onChange: $empty(intStep),
		onStart: $empty(intStep),
		onComplete: $empty(intStep),*/
  	range: [200, 600], // Wertebereicht (virtuell)
		start: [0, 0],     // Werte für die Startpunkte der Knobs (momentan pixel)
		mode: 'horizontal',
		knobs: false
	},

	initialize: function(element, options)
	{
  	this.setOptions(options);
		this.element = document.id(element);
		
		// Richtungs einstellungen handlen
		var offset, limit = {};
		switch (this.options.mode)
		{
			case 'vertical':
				this.axis = ['y', 'x'];
				this.property = 'top';
				offset = 'offsetHeight';
				break;
			case 'horizontal':
				this.axis = ['x', 'y'];
				this.property = 'left';
				offset = 'offsetWidth';
		}
		
		// Knöpfe herausfiltern
		var knobs = this.options.knobs === false ? (this.element.getElements('div')) : this.element.getElements('.' + this.options.knobs);
		this.knob_left = knobs[0];
		this.knob_right = knobs[1];
		
		// Maße filtern
		this.full = this.element[offset];         // Volle Breite
		this.knob_width = this.knob_left[offset]; // Breite des Knopfes
		this.range = this.full - this.knob_width; // Knob-Range
    this.faktor = (this.options.range[1] - this.options.range[0]) / (this.full - 2 * this.knob_width);

		// Startpunkte der Knöpfe einstellen;
		this.options.start[0] = Math.round((this.options.start[0] - this.options.range[0]) / this.faktor);
		this.options.start[1] = Math.round((this.options.start[1] - this.options.range[0]) / this.faktor) + this.knob_width;
		
		var start = [0, 0];
		start[0] = (this.options.start[0] < 0) ? 0 : this.options.start[0];
		start[1] = (this.options.start[1] <= start[0] + this.knob_width) ? start[0] : this.options.start[1] - this.knob_width;
		this.knob_left.setStyle('position', 'relative').setStyle(this.property, start[0]);
		this.knob_right.setStyle('position', 'relative').setStyle(this.property, start[1]);
		
		// Draggers initialisieren
		this.initDrag();
	},
	
	initDrag: function()
	{
	  var modifiers = {'x': false, 'y': false};
	  modifiers[this.axis[0]] = this.property;
	  
		var limit = {};
		limit[this.axis[0]] = [0, this.knob_right.getStyle(this.property).toInt()];
		limit[this.axis[1]] = [0, 0];
		
		var dragOptions = {
		  limit: limit,
		  modifiers: modifiers,
		  onDrag: this.onDrag,
		  onBeforeStart: this.onStart,
		  onComplete: this.onComplete
		};
		this.drag_left = new Drag(this.knob_left, dragOptions);
		
		limit[this.axis[0]] = [this.knob_left.getStyle(this.property).toInt(), this.range - this.knob_width];
		limit[this.axis[1]] = [0, 0];
		
		dragOptions.limit = limit;
		this.drag_right = new Drag(this.knob_right, dragOptions);
	},
	
	getKnobValues: function()
	{
	  var values = {};
	  values.knob_left = this.options.range[0] + Math.round(this.knob_left.getStyle(this.property).toInt() * this.faktor);
	  values.knob_right = this.options.range[0] + Math.round(this.knob_right.getStyle(this.property).toInt() * this.faktor);
	  return values;
	},

  onDrag: function(draggedElement)
	{
    this.updateKnobRange();
	  this.fireEvent('change', this.getKnobValues());
	},
	
	onStart: function(draggedElement)
	{
    this.updateKnobRange();
	  this.fireEvent('start', this.getKnobValues());
	},
	
	onComplete: function(draggedElement)
	{
    this.updateKnobRange();
	  this.fireEvent('complete', this.getKnobValues());
	},
	
	updateKnobRange: function()
	{
	  this.drag_left.options.limit[this.axis[0]] = [
	    0,
	    this.knob_right.getStyle(this.property).toInt()
	  ];
	  
	  this.drag_right.options.limit[this.axis[0]] = [
	    this.knob_left.getStyle(this.property).toInt(),
	    this.range - this.knob_width
	  ];
	}
});