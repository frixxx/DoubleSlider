DoubleSlider
=========

DoubleSlider is a Script to give you a Slider Component with two knobs instead of one. It provides horizontal and vertical Sliding.

![Screenshot](http://moo.medienpark.net/DoubleSlider/screen.png)

How to use
----------

The best way to use the DoubleSlider is to initialize it onDomReady. The first argument is the DoubleSliders "container" which contains the knobs. Options can be given as the second argument.

DoubleSlider also provides start, drag, and complete events.

*Html*

### HTML
    <div id="doubleslider">
      <div></div><div></div>
    </div>

*Javascript*

### Javascript
    var doubleslider = new DoubleSlider(
      'doubleslider',
      {
        range: [0, 8],
        start: [1, 7]
      }
    );

For specific usage and options, please read the documentation or visit [http://moo.medienpark.net/DoubleSlider/docs.html](http://moo.medienpark.net/DoubleSlider/docs.html)