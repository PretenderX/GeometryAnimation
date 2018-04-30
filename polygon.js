(function () {
  window.app = new Vue({
    el: "#app",
    data: {
      canvasWidth: 500,
      canvasHeight: 500,
      edgesNumber: 4
    },
    computed: {
      canvasWidthPx: function () {
        return this.canvasWidth + "px";
      },
      canvasHeightPx: function () {
        return this.canvasHeight + "px";
      }
    },
    watch: {
      startPoints: function () {
        var vm = this;
        vm.startAnimate();
      },
      endPoints: function () {
        var vm = this;
        vm.startAnimate();
      }
    },

    created: function () {
      var vm = this;

      vm.initPoints();
    },

    mounted: function () {
      this.startAnimate();
    },
    methods: {
      initPoints: function () {
        var vm = this,
          startPoints = [],
          endPoints = [],
          demoStartPoints = [
            { x: 50, y: 0 },
            { x: 450, y: 0 },
            { x: 500, y: 500 },
            { x: 0, y: 500 }
          ],
          demoEndPoints = [
            { x: 50, y: 0 },
            { x: 500, y: 0 },
            { x: 500, y: 500 },
            { x: 0, y: 500 }
          ];

        for (var i = 0; i < 5; i++) {
          startPoints.push(demoStartPoints[i] ? fabric.util.object.clone(demoStartPoints[i]) : { x: 0, y: 0 });
          endPoints.push(demoEndPoints[i] ? fabric.util.object.clone(demoEndPoints[i]) : { x: 0, y: 0 });
        }

        vm.startPoints = startPoints;
        vm.endPoints = endPoints;
      },
      startAnimate: function () {
        var vm = this,
          clonedStartPoints = vm.startPoints.slice(0, vm.edgesNumber).map(function (o) {
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
      animate: function () {
        var vm = this,
          even = vm.even,
          startPoints = vm.startPoints,
          endPoints = vm.endPoints;

        for (var i = 0; i < vm.edgesNumber; i++) {
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
            if (i === vm.edgesNumber - 1 && prop === 'y') {
              vm._canvas.renderAll();
            }
          },
          onComplete: function () {
            polygon.setCoords();
            // only start animation once
            if (i === vm.edgesNumber - 1 && prop === 'y') {
              vm.even = !vm.even;
              vm.animate();
            }
          }
        });
      }
    }
  });
})();