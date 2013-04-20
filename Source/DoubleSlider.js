/*
---
description: DoubleSlider

license: MIT-style

authors:
- Matthias Goebels (http://js.frixxx.de)

requires:
- core/1.2.4: '*'
- more/1.4.0.1: Drag

provides: [DoubleSlider]

...
*/

var DoubleSlider = new Class({

    Implements: [Options, Events],

    options: {
        knobSelector: 'div',
        rangeSelector: 'span',
        range: [0, 100],
        start: [null, null],
        steps: null,
        precision: 0
    },

    initialize: function(element, options)
    {
        // Init Options
        this.setOptions(options);
        this.initOptions();

        // Get Elements
        this.element = document.id(element);
        this.knobs = this.element.getElements(this.options.knobSelector);
        this.rangeElement = this.element.getElement(this.options.rangeSelector);

        // Prepare the rest
        this.initOrentation();
        this.initDimensions();
        this.prepareElements();

        // whoop the first events
        this.updateKnobRange();
        this.fireEvent('change', [(this.options.start[0]).round(this.options.precision), (this.options.start[1]).round(this.options.precision)]);
    },

    initOptions: function()
    {
        // If not set, set the start values
        if(this.options.start[0] === null || this.options.range[0] > this.options.start[0]) this.options.start[0] = this.options.range[0];
        if(this.options.start[1] === null || this.options.range[1] < this.options.start[1]) this.options.start[1] = this.options.range[1];
    },

    initOrentation: function()
    {
        var size = this.element.getSize();
        if(size.x >= size.y)
        {
          Object.append(this, { axis: 'x', property: 'left', sizeProperty: 'width' });
        }
        else
        {
          Object.append(this, { axis: 'y', property: 'top', sizeProperty: 'height' });
        }
    },

    initDimensions: function()
    {
        // Offset for calculation
        this.offset = this.options.range[0];

        // Calculationg the Pixel Range the knobs can drag in
        this.pixelRange = this.element.getSize()[this.axis] - this.knobs[0].getSize()[this.axis] - this.knobs[1].getSize()[this.axis];

        // Calculating the range difference
        this.range = this.options.range[1] - this.options.range[0];

        // Calculating the Pixels for the Drag-Grid based on the steps option
        this.grid = (this.options.steps !== null) ? this.pixelRange / this.options.steps : null;
    },

    prepareElements: function()
    {
        // Set the initial knob positions
        this.knobs[0].setStyle(this.property, this.translateRangeToPixel(this.options.start[0]) + 'px');

        if(this.options.start[1] > this.options.start[0])
        {
            this.knobs[1].setStyle(this.property, (this.translateRangeToPixel(this.options.start[1]) + this.getKnobSize(0)) + 'px');
        }
        else
        {
            this.knobs[1].setStyle(this.property, (this.getKnobOffset(0) + this.getKnobSize(0)) + 'px');
        }

        this.updateRangeElement();

        // Init Drag Objects
        var dragOptions = {
            unit: 'px',
            modifiers: { x: 'left', y: 'top' },
            onComplete: this.onComplete.bind(this),
            onDrag: this.onChange.bind(this),
            onBeforeStart: this.onStart.bind(this)
        };

        // Init Grid if necessary
        if(this.grid !== null) dragOptions.grid = this.grid;

        // Init Knob-Drags
        this.drags = [
            new Drag(this.knobs[0], dragOptions),
            new Drag(this.knobs[1], dragOptions)
        ];
    },

    updateRangeElement: function()
    {
        // Set the initial knob positions
        var posKnob1 = this.knobs[0].getStyle(this.property).toInt();
        var posKnob2 = this.knobs[1].getStyle(this.property).toInt();

        // Set the initial Range-Element position
        if(this.rangeElement !== null)
        {
            var rangeLeft = posKnob1 + (this.knobs[0].getSize()[this.axis] / 2).round(0);
            this.rangeElement.setStyle(this.property, rangeLeft + 'px');
            this.rangeElement.setStyle(this.sizeProperty, ((posKnob2 - rangeLeft) + (this.knobs[1].getSize()[this.axis] / 2).round(0)) + 'px');
        }
    },

    getKnobOffset: function(knobIndex)
    {
      return this.knobs[knobIndex].getStyle(this.property).toInt();
    },

    getKnobSize: function(knobIndex)
    {
      return this.knobs[knobIndex].getSize()[this.axis].toInt();
    },

    updateKnobRange: function()
    {
        var limit = { x: null, y: null };
        Object.each(limit, function(item, key, arr){
            if(key != this.axis) limit[key] = [0, 0];
        }, this);

        this.drags[0].options.limit = Object.clone(limit);
        this.drags[0].options.limit[this.axis] = [0, this.getKnobOffset(1) - this.getKnobSize(0)];

        this.drags[1].options.limit = limit;
        this.drags[1].options.limit[this.axis] = [this.getKnobOffset(0) + this.getKnobSize(0), this.pixelRange + this.getKnobSize(1)];
    },

    onStart: function(e)
    {
        this.fireEvent('start');
        this.onChange(e);
    },

    translateRangeToPixel: function(value)
    {
        value = value - this.offset;
        return ((this.pixelRange * value) / this.range).round(this.options.precision);
    },

    translatePixelToRange: function(value)
    {
        return (((value * this.range) / this.pixelRange) + this.offset).round(this.options.precision);
    },

    onChange: function(e)
    {
        this.updateRangeElement();

        var values = [];
        values.push(this.translatePixelToRange(this.getKnobOffset(0)));
        values.push(this.translatePixelToRange(this.getKnobOffset(1) - this.getKnobSize(1)));
        this.fireEvent('change', values);
    },

    onComplete: function(e)
    {
        this.updateKnobRange();
        this.onChange(e);
        this.fireEvent('complete');
    },

    setKnobs: function(first, second)
    {
        if(first !== null)
        {
            if(first < this.options.start[0]) first = this.options.start[0];
            this.knobs[0].setStyle(this.property, this.translateRangeToPixel(first) + 'px');
        }

        if(second !== null)
        {
            if(second > this.options.start[1]) second = this.options.start[1];
            this.knobs[1].setStyle(this.property, (this.translateRangeToPixel(second) + this.getKnobSize(1)) + 'px');
        }

        this.onComplete();
    }

});