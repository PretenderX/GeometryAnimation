(function () {
  window.app = new Vue({
    el: "#app",
    data: {
      canvasWidth: 500,
      canvasHeight: 500,
      edgesNumber: 4,
      startPoints: [
        { x: 50, y: 0 },
        { x: 400, y: 0 },
        { x: 450, y: 500 },
        { x: 0, y: 500 }
      ],
      endPoints: [
        { x: 50, y: 0 },  
        { x: 500, y: 0 },
        { x: 450, y: 500 },
        { x: 0, y: 500 }
      ]
    },
    computed: {
      canvasWidthPx: function () {
        return this.canvasWidth + "px";
      },
      canvasHeightPx: function () {
        return this.canvasHeight + "px";
      }
    },
    mounted: function () {
      var vm = this,
        clonedStartPoints = vm.startPoints.map(function (o) {
          return fabric.util.object.clone(o);
        }),
        polygon = new fabric.Polygon(clonedStartPoints, {
          left: 0,
          top: 0,
          fill: 'purple',
          selectable: false,
          objectCaching: false,
        }),
        canvas = new fabric.Canvas('c');

      canvas.add(polygon);

      vm._canvas = canvas;
      vm._polygon = polygon;
      vm.even = true;

      setTimeout(vm.animate, 1000);
    },
    methods: {
      animate: function () {
        var vm = this,
          even = vm.even,
          startPoints = vm.startPoints,
          endPoints = vm.endPoints;

        for (var i = 0, len = startPoints.length; i < len; i++) {
          vm.animatePoint(i, 'x', even ? endPoints : startPoints);
          vm.animatePoint(i, 'y', even ? endPoints : startPoints);
        }
      },
      animatePoint: function (i, prop, endPoints) {
        var vm = this,
          startPoints = vm.startPoints,
          polygon = vm._polygon;

        fabric.util.animate({
          startValue: polygon.points[i][prop],
          endValue: endPoints[i][prop],
          duration: 1000,
          onChange: function (value) {
            polygon.points[i][prop] = value;
            // only render once
            if (i === startPoints.length - 1 && prop === 'y') {
              vm._canvas.renderAll();
            }
          },
          onComplete: function () {
            polygon.setCoords();
            // only start animation once
            if (i === startPoints.length - 1 && prop === 'y') {
              vm.even = !vm.even;
              vm.animate();
            }
          }
        });
      }
    }
  });
})();