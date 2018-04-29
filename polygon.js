(function() {
  var canvas = this.__canvas = new fabric.Canvas('c');

  var startPoints = [
    {x: 50, y: 0},
    {x: 100, y: 0},
    {x: 150, y: 100},
    {x: 0, y: 100}
  ];

  var endPoints = [
    {x: 50, y: 0},
    {x: 200, y: 0},
    {x: 150, y: 100},
    {x: 0, y: 100}
  ];

  var clonedStartPoints = startPoints.map(function(o){
    return fabric.util.object.clone(o);
  });

  var polygon = new fabric.Polygon(clonedStartPoints, {
    left: 0,
    top: 0,
    fill: 'purple',
    selectable: false,
    objectCaching: false,
  });
  canvas.add(polygon);

  function animatePoint(i, prop, endPoints) {
    fabric.util.animate({
      startValue: polygon.points[i][prop],
      endValue: endPoints[i][prop],
      duration: 1000,
      onChange: function(value) {
        polygon.points[i][prop] = value;
        // only render once
        if (i === startPoints.length - 1 && prop === 'y') {
          canvas.renderAll();
        }
      },
      onComplete: function() {
        polygon.setCoords();
        // only start animation once
        if (i === startPoints.length - 1 && prop === 'y') {
          even = !even;
          animate();
        }
      }
    });
  }

  function animate() {
    for (var i = 0, len = startPoints.length; i < len; i++) {
      animatePoint(i, 'x', even ? endPoints : startPoints);
      animatePoint(i, 'y', even ? endPoints : startPoints);
    }
  }

  var even = true;
  setTimeout(animate, 1000);
})();