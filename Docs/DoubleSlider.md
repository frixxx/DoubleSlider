Class: DoubleSlider
=========

DoubleSlider is a Script to give you a Slider Component with two knobs instead of one. It provides horizontal and vertical Sliding.

### Implements:
Events, Options

## DoubleSlider Method: constructor

### Syntax:
    new DoubleSlider('DoubleSliderElement');

### Arguments:
1. container - (string) The Id of the container which will represent the DoubleSlider.
2. options - (**) The options for the DoubleSlider instance.

### Options:
- range - (array, defaults [200, 600]) - The min and max data for the Slider-Area.
- start - (array, defaults [0, 0]) - The start and end data inside the Slider-Area.
- mode - (string, defaults 'horizontal') - The direction of the Slider (horizontal|vertical).
- knobs - (string, defaults divs inside the slider) - The Class of the knob-elements.

### Events:
##### onChange
- (function) Function to execute when the knob values change.
##### Signature
    onChange: function(values)
##### Example
    onChange: function(values)
    {
      alert(values.knob_left + ' - ' + values.knob_right);
    }

--------------------------------------
##### onStart
- (function) Function to execute the dragging starts.
##### Signature
    onStart: function(values)
##### Example
    onStart: function(values)
    {
      alert(values.knob_left + ' - ' + values.knob_right);
    }

--------------------------------------

##### onComplete
- (function) Function to execute the dragging starts.
##### Signature
    onComplete: function(values)
##### Example
    onComplete: function(values)
    {
      alert(values.knob_left + ' - ' + values.knob_right);
    }

--------------------------------------