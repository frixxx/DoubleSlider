Class: DoubleSlider
=========

DoubleSlider is a Script to give you a Slider Component with two knobs instead of one. It provides horizontal and vertical Sliding.

## Implements:
Events, Options

## DoubleSlider Method: constructor

### Syntax:
    new DoubleSlider('DoubleSliderElement');

### Arguments:
1. container - (string) The Id of the container which will represent the DoubleSlider.
2. options - (**) The options for the DoubleSlider instance.

### Options:
- knobSelector - (string, defaults 'div') - The CSS Selector to retrieve the knob elements.
- range - (array, defaults [0, 100]) - The start and end data inside the Slider-Area.
- start - (array, defaults [0, 100]) - The start values of the Knobs.
- steps - (number, defaults to null) - Amount of steps the slider-dimension is divided into

## Events:

### onStart
- (function) Function to execute when the sliding begins
#### Signature
    onStart: function()
#### Example
    onStart: function()
    {
      alert("dragging begins");
    }

### onChange
- (function) Function to execute when the knob values change.
#### Signature
    onChange: function(firstValue, secondValue)
#### Example
    onChange: function(firstValue, secondValue)
    {
      alert(firstValue + ' - ' + secondValue);
    }

### onComplete
- (function) Function to execute when the sliding begins
#### Signature
    onComplete: function()
#### Example
    onComplete: function()
    {
      alert("dragging ends");
    }

## CSS:
The important part to use the DoubleSlider is to set the position style correct.

The wrapper/container which contains the knobs need the following style:

    .wrapper
    {
      position: relative;
    }

The knobs need the following style:

    .wrapper .knob
    {
      /* of course you can play with the top and left values if you like */
      position: absolute;
      top: 0px;
      left: 0px;
    }