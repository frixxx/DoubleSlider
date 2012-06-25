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
        range: [0, 100],
        start: [0, 100]
    },

    initialize: function(element, options)
    {
        this.setOptions(options);
        this.element = document.id(element);
        this.knobs = this.element.getElements(this.options.knobSelector);
        this.initOrentation();
        this.initKnobs();
        this.updateKnobRange();
        this.fireEvent('change', [this.options.start[0], this.options.start[1]]);
    },

    initOrentation: function()
    {
        var size = this.element.getSize();
        if(size.x >= size.y)
        {
            this.axis = 'x';
            this.property = 'left';
        }
        else
        {
            this.axis = 'y';
            this.property = 'top';
        }

        // Calculationg the Pixel Range the knobs can drag in
        this.range = this.element.getSize()[this.axis] - this.knobs[0].getSize()[this.axis] - this.knobs[1].getSize()[this.axis];

        // Calculating the multiplier for the Pixel to Unit Translation (Unit -> options.range)
        this.multiplier = this.range / this.options.range[1];
    },

    initKnobs: function()
    {
        // Set the initial knob positions
        this.knobs[0].setStyle(this.property, Math.round(this.multiplier * this.options.start[0]) + 'px');

        if(this.options.start[1] > this.options.start[0])
        {
            this.knobs[1].setStyle(this.property, Math.round(this.multiplier * this.options.start[1]) + this.knobs[0].getSize()[this.axis] + 'px');
        }
        else
        {
            this.knobs[1].setStyle(this.property, (this.knobs[0].getStyle(this.property).toInt() + this.knobs[0].getSize()[this.axis]) + 'px');
        }

        // Init Drag Objects
        var dragOptions = {
            unit: 'px',
            modifiers: { x: 'left', y: 'top' },
            onComplete: this.onComplete.bind(this),
            onDrag: this.onChange.bind(this),
            onBeforeStart: this.onStart.bind(this)
        };
        this.drags = [
            new Drag(this.knobs[0], dragOptions),
            new Drag(this.knobs[1], dragOptions)
        ];
    },

    updateKnobRange: function()
    {
        var limit = { x: null, y: null };
        Object.each(limit, function(item, key, arr){
            if(key != this.axis) limit[key] = [0, 0];
        }, this);

        this.drags[0].options.limit = Object.clone(limit);
        this.drags[0].options.limit[this.axis] = [0, this.knobs[1].getStyle(this.property).toInt() - this.knobs[0].getSize()[this.axis]];

        this.drags[1].options.limit = limit;
        this.drags[1].options.limit[this.axis] = [this.knobs[0].getStyle(this.property).toInt() + this.knobs[0].getSize()[this.axis], this.range + this.knobs[1].getSize()[this.axis]];
    },

    onStart: function(e)
    {
        this.fireEvent('start');
        this.onChange(e);
    },

    onChange: function(e)
    {
        var values = [];
        values.push(Math.round(this.knobs[0].getStyle(this.property).toInt() / this.multiplier));
        values.push(Math.round((this.knobs[1].getStyle(this.property).toInt() - this.knobs[0].getSize()[this.axis]) / this.multiplier));
        this.fireEvent('change', values);
    },

    onComplete: function(e)
    {
        this.updateKnobRange();
        this.onChange(e);
        this.fireEvent('complete');
    }

});