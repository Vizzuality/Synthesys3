var mapComponent = (function () {
  "use strict";

  var transform = function(methods) {
    return {
      stream: transformer(methods)
    };
  };

  function getFeaturesBox(featureBounds) {
    return {
      x: featureBounds[0][0],
      y: featureBounds[0][1],
      width: featureBounds[1][0] - featureBounds[0][0],
      height: featureBounds[1][1] - featureBounds[0][1]
    };
  }

// fits the geometry layer inside the viewport
  function fitGeoInside(featureBounds, width, height) {
    var bbox = getFeaturesBox(featureBounds);
    var scale = 1 / Math.max(bbox.width / width, bbox.height / height);
    var trans = [-(bbox.x + bbox.width / 2) * scale + width / 2, -(bbox.y + bbox.height / 2) * scale + height / 2];

    return { scale: scale, trans: trans };
  }

  return function MapComponent(className, _ref) {
    var features = _ref.features,
      getPolygonClassName = _ref.getPolygonClassName,
      showTooltipCallback = _ref.showTooltipCallback,
      hideTooltipCallback = _ref.hideTooltipCallback,
      useRobinsonProjection = _ref.useRobinsonProjection;

    var d3Container = d3.select(className);
    var containerComputedStyle = window.getComputedStyle(d3Container.node());
    var width = parseInt(containerComputedStyle.width);
    var height = parseInt(containerComputedStyle.height);

    var svg = d3Container.append('svg').attr('width', width).attr('height', height);

    var geoParent = svg.append('g');
    var container = geoParent.append('g');

    var projection = useRobinsonProjection === true ? d3.geo.robinson() : d3.geo.mercator();
    var path = d3.geo.path().projection(projection);

    var polygons = container.selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('class', function (d) {
        return 'polygon ' + getPolygonClassName(d);
      })
      .attr('d', path);

    if (showTooltipCallback !== undefined) {
      polygons
        .on('mousemove', function (d) {
          showTooltipCallback(d, d3.event.clientX + 10, d3.event.clientY + window.scrollY + 10);
        }).on('mouseout', function () {
          hideTooltipCallback();
        });
    }

    var collection = {
      'type': 'FeatureCollection',
      'features': features
    };
    var featureBounds = path.bounds(collection);

    var _fitGeoInside = fitGeoInside(featureBounds, width, height),
      scale = _fitGeoInside.scale,
      trans = _fitGeoInside.trans;

    container.attr('transform', ['translate(' + trans + ')', 'scale(' + scale + ')'].join(' '));

    container.selectAll('path').style('stroke-width', .5 / scale);
  };
})();
