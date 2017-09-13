var filtersData = {
  discipline: [
    {
      label: 'Earth Sciences & Environment',
      value: 'Earth Sciences & Environment'
    },
    {
      label: 'Engineering & Technology',
      value: 'Engineering & Technology'
    },
    {
      label: 'Humanities',
      value: 'Humanities'
    },
    {
      label: 'Information & Communication Technologies',
      value: 'Information & Communication Technologies'
    },
    {
      label: 'Life Sciences & Biotech',
      value: 'Life Sciences & Biotech'
    },
    {
      label: 'Material Sciences',
      value: 'Material Sciences'
    },
    {
      label: 'Physics',
      value: 'Physics'
    },
    {
      label: 'Social Sciences',
      value: 'Social Sciences'
    }
  ],
  'founding-round': [
    {
      label: 'R1',
      value: 'R1'
    },
    {
      label: 'R2',
      value: 'R2'
    },
    {
      label: 'R2',
      value: 'R2'
    }
  ]

};

jQuery(function () {
  setFilters();
  initSlickCarousel();
  initMobileNav();
  initHighcharts();
  initCarousel();
  initCustomForms();
  initBubbleChart();
  initTreeChart();
});

$ = jQuery;

function initTreeChart() {
  var treeData = {
    "name": "FRANCE",
    "parent": "null",
    "level": "#09112d",
    "value": 0,
    "children": [{
      "name": "Botanischer Garten und Botanisches M",
      "parent": "France",
      "value": 0,
      "level": "#7e8fc8"
    },
      {
        "name": "Museum National d'Historie Naturelle",
        "parent": "France",
        "value": 0
      },
      {
        "name": "Museum für Naturkunde Laboratories",
        "parent": "France",
        "value": 0
      },
      {
        "name": "Botanischer Garten und Botanisches M",
        "parent": "France",
        "value": 0
      },
      {
        "name": "Museum National d'Historie Naturelle",
        "parent": "France",
        "value": 0,
        "level": "#7e8fc8"
      },
      {
        "name": "Museum für Naturkunde Laboratories",
        "parent": "France",
        "value": 0
      },
      {
        "name": "Museum für Naturkunde Laboratories",
        "parent": "France",
        "value": 0
      }, {
        "name": "Botanischer Garten und Botanisches M",
        "parent": "France",
        "value": 0
      },
      {
        "name": "Museum National d'Historie Naturelle",
        "parent": "France",
        "value": 0,
        "level": "#7e8fc8"
      }]
  };
  var mobileTreeDataObj = {
    "name": "FRANCE",
    "parent": "null",
    "level": "#09112d",
    "value": 0,
    "children": [{
      "name": "Botanischer Garten und Botanisches M",
      "parent": "France",
      "value": 0,
      "level": "#7e8fc8"
    },
      {
        "name": "Museum National d'Historie Naturelle",
        "parent": "France",
        "value": 0,
        "level": "#7e8fc8"
      },
      {
        "name": "Museum National d'Historie Naturelle",
        "parent": "France",
        "value": 0,
        "level": "#7e8fc8"
      }]
  };
  jQuery('.tree-chart').each(function () {
    var chartsHolder = jQuery(this);

    function drawChart(data, obj) {
      chartsHolder.empty();
      var chartBlock = jQuery('<div class="chart-block">').appendTo(chartsHolder);
      var margin = {
          top: 20,
          right: 120,
          bottom: 20,
          left: 120
        },
        width = 900 - margin.right - margin.left,
        height = 900 - margin.top - margin.bottom,
        i = 0,
        maxHeight = 0;
      var tree = d3.layout.tree()
        .size([height, width]);
      var diagonal = d3.svg.diagonal()
        .projection(function (d) {
          return [d.y, d.x];
        });
      var holder = d3.select('.' + chartBlock.attr('class'));
      var svg = holder.append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom);
      var g = svg.append("g");
      var nodes = tree.nodes(data),
        links = tree.links(nodes);
      nodes.forEach(function (d, ind) {
        if (ind === 0) {
          d.x = obj.varticalSpacing;
          d.y = 0;
        } else {
          d.x = ind * obj.varticalSpacing;
          d.y = holder[0][0].clientWidth - 400;
        }
        if (d.x > maxHeight) {
          maxHeight = d.x;
        }
      });
      svg.attr("height", maxHeight + 50);
      var node = g.selectAll("g.node")
        .data(nodes, function (d) {
          return d.id || (d.id = ++i);
        });
      var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });
      nodeEnter.append("text")
        .attr("x", function (d) {
          return d.children || d._children ? (d.value + 4) * -1 : d.value + 4
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) {
          return d.children || d._children ? "end" : "start";
        })
        .attr("fill", function (d) {
          if (!d.level) {
            return '#cbccd2';
          }
        })
        .text(function (d) {
          return d.name;
        })
        .style("fill-opacity", 1)
        .call(wrap, obj.textWidth, obj.leftOffset);
      var link = g.selectAll("path.link")
        .data(links, function (d) {
          return d.target.id;
        });
      link.enter().insert("path", "g")
        .attr("class", "link")
        .style("stroke", function (d) {
          return d.target.level;
        })
        .attr("d", diagonal);
      resize();
      jQuery(window)
        .off('resize', resize)
        .on('resize', resize);

      function resize() {
        var maxLinesWidth = 0;
        for (var j = 0; j < nodeEnter[0].length; j++) {
          if (maxLinesWidth < nodeEnter[0][j].getBBox().width) {
            maxLinesWidth = nodeEnter[0][j].getBBox().width;
          }
        }
        nodes.forEach(function (d, ind) {
          if (ind === 0) {
            d.y = 0;
          } else {
            d.y = holder[0][0].clientWidth - maxLinesWidth - nodeEnter[0][0].getBBox().width - 40;
          }
          if (d.x > maxHeight) {
            maxHeight = d.x;
          }
        });
        svg.attr("height", maxHeight + 50);
        xOffset = nodeEnter[0][0].getBBox().width * 1.5;
        g.attr("transform", "translate(" + xOffset + ", 0)");
        link.attr("d", diagonal);
        nodeEnter.attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });
      }
    }

    ResponsiveHelper.addRange({
      '768..': {
        on: function () {
          drawChart(treeData, {
            textWidth: 200,
            varticalSpacing: 79,
            leftOffset: 18
          });
        }
      },
      '..767': {
        on: function () {
          drawChart(mobileTreeDataObj, {
            textWidth: 90,
            varticalSpacing: 70,
            leftOffset: 12
          });
        }
      }
    });

    function wrap(text, width, leftOffset) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          lineHeight = 1.1,
          tspan = text.text(null).append("tspan").attr("x", function (d) {
              return d.children || d._children ? -leftOffset : leftOffset;
            })
            .attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          var textWidth = tspan.node().getComputedTextLength();
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            ++lineNumber;
            tspan = text.append("tspan").attr("x", function (d) {
                return d.children || d._children ? -leftOffset : leftOffset;
              })
              .attr("y", 0)
              .attr("dy", lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
  });
}

function initBubbleChart() {
  var isIE = window.navigator.msPointerEnabled;
  var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
  jQuery('.bubbles-chart').each(function () {
    var holder = jQuery(this);
    d3.selection.prototype.moveToFront = function () {
      return this.each(function () {
        this.parentNode.appendChild(this);
      });
    };
    d3.selection.prototype.delegate = function (event, targetselector, handler) {
      var self = this;
      return this.on(event, function () {
        var eventTarget = d3.event.target.parentNode,
          target = self.selectAll(targetselector);
        target.each(function () {
          if (eventTarget === this) {
            handler.call(eventTarget, eventTarget.__data__);
          }
        });
      });
    };
    var diameter = 400,
      format = d3.format(",d"),
      color = ['#435caf', '#7e93d7', '#b3c3f9', '#e6ebfd', '#5bcba6', '#74ebc3', '#a1ecd3', '#d3f9ec'],
      fillIndex = 0,
      strokeIndex = 0;
    var bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .padding(0);
    var chart = d3.select('.' + holder.attr('class'));
    var svg = chart.append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("viewBox", "0 0 " + (diameter + 50) + " " + (diameter + 50) + "")
      .attr("class", "bubble");
    var defs = svg.append("defs");
    var filter = defs.append("filter")
      .attr("id", "circle-shadow")
      .attr("height", "150%");
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2)
      .attr("result", "blur");
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 0)
      .attr("dy", 0)
      .attr("result", "offsetBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
    d3.json(holder.data('src'), function (error, root) {
      var node = svg.selectAll(".node")
        .data(
          bubble
            .nodes(classes(root))
            .filter(function (d) {
              return !d.children;
            })
        )
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            var y = d.y + 20;
            return "translate(" + d.x + "," + y + ")";
          }
        );
      node.append("circle")
        .attr("r", function (d) {
          return d.r;
        })
        .style("fill", function (d, i) {
          var counter = i - color.length * fillIndex;
          if (counter >= color.length - 1) {
            fillIndex++;
          }
          return color[counter];
        });
      node.append("circle")
        .attr("class", 'hover-circle')
        .attr("r", function (d) {
          return d.r + 20;
        })
        .style("fill", 'transparent')
        .style("stroke", function (d, i) {
          var counter = i - color.length * strokeIndex;
          if (counter >= color.length - 1) {
            strokeIndex++;
          }
          return color[counter];
        });
      node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("fill", "#fff")
        .text(function (d) {
          return drawText(d.value);
        });
      if (isIE) {
        function addEvents(self) {
          jQuery(self).off('mouseenter').on('mouseenter', function () {
            d3.select(self).select("circle")
              .attr("class", "selected_circle");
            jQuery('.node').each(function () {
              var n = jQuery(this);
              n.one('mouseenter', function () {
                svg[0][0].appendChild(this);
                addEvents(this);
              });
            });
          });
          jQuery(self).off('mouseleave').on('mouseleave', function () {
            d3.select(self).select("circle")
              .attr("class", "default_circle");
          });
        }

        jQuery(node[0]).each(function () {
          var n = jQuery(this);
          n.one('mouseenter', function () {
            svg[0][0].appendChild(this);
            addEvents(this);
          });
        });
        jQuery(svg[0]).on('mouseleave', function () {
          jQuery('.node').each(function () {
            d3.select(this).select("circle")
              .attr("class", "default_circle");
          });
        });
      } else {
        node.on(isTouchDevice ? "click" : 'mouseenter', function (d) {
          d3.select(this).select("circle")
            .attr("class", "selected_circle");
          svg[0][0].appendChild(this);
        });
        node.on("mouseleave", function (d) {
          d3.select(this).select("circle")
            .attr("class", "default_circle");
        });
      }
    });

    function classes(root) {
      var classes = [];

      function recurse(name, node) {
        if (node.children) {
          node.children.forEach(function (child) {
            recurse(node.name, child);
          });
        } else {
          classes.push({ packageName: name, className: node.name, value: node.size });
        }
      }

      recurse(null, root);
      return { children: classes };
    }

    function drawText(num) {
      var arr = (num + '').split('').reverse(),
        sepationNumber = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        if (i !== 0 && i % 3 === 0) {
          sepationNumber.push('.');
        }
        sepationNumber.push(arr[i]);
      }
      return sepationNumber.reverse().join('');
    }
  });
}

function initHighcharts() {
  jQuery('.pie-chart').each(function () {
    Highcharts.chart({
      chart: {
        renderTo: this,
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: 280
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{point.percentage:.1f}%',
        style: {
          'text-transform': 'uppercase'
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false
          },
          startAngle: 0,
          endAngle: 360,
          center: ['50%', '50%'],
          showInLegend: true,
          borderWidth: 0,
          size: 257
        }
      },
      legend: {
        align: 'left',
        verticalAlign: 'top',
        layout: 'vertical',
        x: -5,
        y: -2,
        symbolWidth: 18,
        symbolHeight: 5,
        symbolPadding: 13,
        symbolRadius: 4,
        itemMarginBottom: 11,
        squareSymbol: false,
        floating: true,
        itemStyle: {
          'color': '#000016',
          'cursor': 'pointer',
          'fontSize': '13px',
          'fontWeight': 'normal',
          'textOverflow': 'ellipsis',
          'text-transform': 'uppercase'
        }
      },
      series: [{
        type: 'pie',
        innerSize: '43%',
        data: [
          {
            name: 'woman',
            y: 60,
            color: '#13339b'
          },
          {
            name: 'man',
            y: 40,
            color: '#51e5b4'
          }
        ]
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 450
          },
          chartOptions: {
            chart: {
              height: 349
            },
            plotOptions: {
              pie: {
                size: 213,
                center: ['50%', '57%']
              }
            },
          }
        }]
      }
    });
  });
  jQuery('.line-chart').each(function () {
    var holder = jQuery(this);
    Highcharts.chart({
      chart: {
        renderTo: this,
        zoomType: 'x',
        type: 'area',
        height: 290,
        marginLeft: 61
      },
      title: {
        text: ''
      },
      xAxis: {
        tickWidth: 0,
        tickmarkPlacement: 'on',
        startOnTick: true,
        tickInterval: 1,
        minPadding: 0,
        maxPadding: 0,
        lineColor: "#7f8ec0",
        lineWidth: 2,
        labels: {
          style: {
            'color': '#030c28',
            'font-size': '13px',
            'font-weight': 'bold'
          }
        },
        crosshair: {
          width: 1,
          color: '#b5bddb'
        }
      },
      yAxis: {
        title: {
          enabled: false
        },
        showFirstLabel: false,
        tickInterval: 10,
        gridLineWidth: 1,
        gridLineColor: "#d6daef",
        gridLineDashStyle: "dash",
        min: 0,
        labels: {
          style: {
            'color': '#030c28',
            'font-size': '13px',
            'font-weight': 'bold'
          },
          formatter: function () {
            return this.value + 'k';
          },
          x: -23,
          y: 2
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        valueSuffix: 'k'
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, 'rgba(0,0,126, 0.3)'],
              [1, 'rgba(0,0,126, 0)']
            ]
          },
          pointStart: 2007,
          color: '#000080',
          lineWidth: 2,
          hover: {
            lineWidth: 2
          },
          marker: {
            enabled: false,
            radius: 8,
            fillColor: '#fff',
            lineColor: '#000080',
            lineWidth: 2,
            states: {
              hover: {
                radiusPlus: 0,
                lineWidthPlus: 0
              }
            }
          }
        },
        series: {
          states: {
            hover: {
              lineWidth: 2,
              halo: {
                opacity: 0.25,
                size: 14
              }
            }
          }
        }
      },
      series: [
        {
          name: 'Participants',
          data: [3, 20.5, 20.5, 44, 18]
        }
      ],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 450
          },
          chartOptions: {
            chart: {
              height: 163,
              marginLeft: 31
            },
            yAxis: {
              labels: {
                style: {
                  'color': '#274194',
                  'font-size': '9px'
                },
                x: -6,
                y: 3
              }
            },
            xAxis: {
              labels: {
                style: {
                  'color': '#68759c',
                  'font-size': '9px',
                  'font-weight': 'bold'
                },
                y: 15
              }
            }
          }
        }]
      }
    }, function (chart) {
      jQuery('<div class="chart-max-val"><span>' + chart.series[0].name.toUpperCase() + '</span><b>' + chart.yAxis[0].dataMax + ' k</b></div>').insertBefore(holder);
    });
  });
  jQuery('.map-chart').each(function () {
    var holder = jQuery(this);
    jQuery.getJSON(holder.data('geo-src'), function (geojson) {
      Highcharts.mapChart({
        chart: {
          renderTo: holder[0],
          height: 330
        },
        title: {
          text: ''
        },
        plotOptions: {
          map: {
            allAreas: false,
            joinBy: ['hc-key', 'value'],
            mapData: geojson.geo,
            borderColor: '#fff'
          },
          series: {
            showInLegend: false,
            states: {
              hover: {
                borderWidth: 2,
                brightness: 0
              }
            }
          }
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '{point.name}: <b>{series.name}</b>'
        },
        series: geojson.series
      });
    });
  });
  jQuery('.column-chart').each(function () {
    Highcharts.chart({
      chart: {
        type: 'column',
        renderTo: this,
        height: 423
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'category',
        tickWidth: 0,
        tickmarkPlacement: 'on',
        startOnTick: true,
        lineColor: "#7b8abd",
        lineWidth: 2,
        labels: {
          style: {
            'color': '#7b8abd',
            'font-size': '13px'
          }
        }
      },
      yAxis: {
        tickInterval: 5,
        gridLineWidth: 1,
        gridLineColor: "#d1d6e8",
        gridLineDashStyle: "dash",
        showFirstLabel: false,
        min: 0,
        labels: {
          style: {
            'color': '#000623',
            'font-size': '13px',
            'font-weight': 'bold'
          },
          x: -15,
          y: 15
        },
        title: {
          enabled: false
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          color: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, 'rgba(37, 89, 194, 1)'],
              [1, 'rgba(28, 56, 148, 1)']
            ],
          },
          groupPadding: 0,
          pointPadding: 0.2,
        }
      },
      tooltip: {
        headerFormat: '',
        pointFormat: 'Papes per {point.name}: <b>{point.y}</b>'
      },
      series: [{
        name: 'Population',
        data: [
          ['2007', 24],
          ['2008', 36],
          ['2009', 14],
          ['2010', 26],
          ['2011', 37.5],
          ['2012', 40.5],
          ['2013', 36],
          ['2014', 14],
          ['2015', 19],
          ['2016', 17],
          ['2017', 19]
        ]
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 450
          },
          chartOptions: {
            chart: {
              height: 225
            },
            yAxis: {
              labels: {
                style: {
                  'font-size': '9px'
                },
                x: -7,
                y: 10
              }
            },
            xAxis: {
              labels: {
                style: {
                  'font-size': '9px'
                },
                y: 10
              }
            }
          }
        }]
      }
    });
  });
  jQuery('.treemap-chart').each(function () {
    var holder = jQuery(this);
    Highcharts.chart({
      chart: {
        renderTo: this,
        height: 346
      },
      title: {
        text: ''
      },
      plotOptions: {
        treemap: {
          joinBy: ['colorValue', 'value']
        }
      },
      tooltip: {
        valueSuffix: 'k'
      },
      colorAxis: {
        dataClasses: [{
          to: 20,
          color: '#1d388f'
        }, {
          from: 21,
          to: 40,
          color: '#5d77cd'
        }, {
          from: 41,
          to: 80,
          color: '#a0b4f7'
        }, {
          from: 81,
          to: 120,
          color: '#51e5b4'
        }, {
          from: 121,
          to: 160,
          color: '#1fbb88'
        }, {
          from: 200,
          color: '#077551'
        }]
      },
      legend: {
        itemStyle: {
          "color": "#fff",
          "cursor": "pointer",
          "fontSize": "13px",
          "lineHeight": "16px",
          "fontWeight": "bold",
          "textOverflow": "ellipsis"
        },
        margin: 8,
        padding: 0,
        itemMarginBottom: 17,
        itemDistance: 0,
        itemWidth: 1,
        symbolHeight: 1,
        symbolRadius: 0,
        symbolWidth: 1,
        squareSymbol: false,
        useHTML: true,
        navigation: {
          enabled: false,
        },
        labelFormatter: function () {
          if (!this.from) {
            return '<span class="legend-item" style="background-color:' + this.color + '">' + this.to + 'k</span>';
          }
          if (!this.to) {
            return '<span class="legend-item" style="background-color:' + this.color + '">' + this.from + 'k</span>';
          }
          return '<span class="legend-item" style="background-color:' + this.color + '">' + this.to + 'k</span>';
        },
        align: 'left'
      },
      series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        dataLabels: {
          enabled: false
        },
        data: [{
          name: 'A',
          value: 15,
          colorValue: 15
        }, {
          name: 'B',
          value: 40,
          colorValue: 60
        }, {
          name: 'C',
          value: 60,
          colorValue: 80
        }, {
          name: 'D',
          value: 80,
          colorValue: 80
        }, {
          name: 'E',
          value: 100,
          colorValue: 100
        }, {
          name: 'F',
          value: 120,
          colorValue: 120
        }, {
          name: 'G',
          value: 160,
          colorValue: 160
        }, {
          name: 'H',
          value: 160,
          colorValue: 160
        }, {
          name: 'I',
          value: 200,
          colorValue: 200
        }, {
          name: 'J',
          value: 20,
          colorValue: 20
        }, {
          name: 'K',
          value: 40,
          colorValue: 40
        }, {
          name: 'L',
          value: 60,
          colorValue: 60
        }, {
          name: 'M',
          value: 80,
          colorValue: 80
        }, {
          name: 'N',
          value: 100,
          colorValue: 100
        }]
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 450
          },
          chartOptions: {
            chart: {
              height: 154
            },
            legend: {
              enabled: false
            }
          }
        }]
      }
    }, function (chart) {
      if (chart.legend.box) {
        jQuery(chart.legend.box.parentGroup.div).css('top', chart.clipBox.height + 15);
      }
    });
  });
}

// slick init
function initSlickCarousel() {
  jQuery('.info-slider').slick({
    slidesToShow: 3,
    arrows: false,
    infinite: false,
    responsive: [{
      breakpoint: 768,
      settings: {
        slidesToScroll: 1,
        slidesToShow: 1
      }
    }]
  });
}

// mobile menu init
function initMobileNav() {
  jQuery('body').mobileNav({
    menuActiveClass: 'nav-active',
    menuOpener: '.nav-opener'
  });
  jQuery('body').mobileNav({
    menuActiveClass: 'filter-active',
    menuOpener: '.filter-by'
  });
  jQuery('body').mobileNav({
    menuActiveClass: 'research-active',
    menuOpener: '.research-opener'
  });
  jQuery('.autocomplete').mobileNav({
    menuActiveClass: 'auto-active',
    menuOpener: '.opener',
    hideOnClickOutside: true,
    menuDrop: '.drop'
  });
}

// scroll gallery init
function initCarousel() {
  jQuery('.testimonial-slider').scrollGallery({
    mask: '.mask',
    slider: '.slideset',
    slides: '.slide',
    stretchSlideToMask: true
  });
}

// initialize custom form elements
function initCustomForms() {
  jcf.setOptions('Select', {
    wrapNative: false,
    wrapNativeOnMobile: false,
  });
  jcf.replaceAll();
}

function setFilters() {
  var filters = Array.prototype.slice.call($('.js-filter'));
  filters.forEach(function (filter) {
    var type = $(filter).data('filter-type');
    var data = filtersData[type];
    if (data) {
      data.forEach(function(item) {
        var option = _.template('<option value="<%= value %>"> <%= label %> </option>')(item);

        $(filter).append(option);
      })
    }
    $(filter).change(function (item) {
      updateFilters(type, item.currentTarget.value)
    }.bind(this));
  });
}

function updateFilters(filter, value) {
  console.log(filter, value);
}

/*
 _ _      _       _
 ___| (_) ___| | __  (_)___
 / __| | |/ __| |/ /  | / __|
 \__ \ | | (__|   < _ | \__ \
 |___/_|_|\___|_|\_(_)/ |___/
 |__/

 Version: 1.6.0
 Author: Ken Wheeler
 Website: http://kenwheeler.github.io
 Docs: http://kenwheeler.github.io/slick
 Repo: http://github.com/kenwheeler/slick
 Issues: http://github.com/kenwheeler/slick/issues

 */
!function (a) {
  "use strict";
  "function" == typeof define && define.amd ? define(["jquery"], a) : "undefined" != typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function (a) {
  "use strict";
  var b = window.Slick || {};
  b = function () {
    function c(c, d) {
      var f, e = this;
      e.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: a(c),
        appendDots: a(c),
        arrows: !0,
        asNavFor: null,
        prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function (b, c) {
          return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c + 1)
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: .35,
        fade: !1,
        focusOnSelect: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3
      }, e.initials = {
        animating: !1,
        dragging: !1,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: !1,
        slideOffset: 0,
        swipeLeft: null,
        $list: null,
        touchObject: {},
        transformsEnabled: !1,
        unslicked: !1
      }, a.extend(e, e.initials), e.activeBreakpoint = null, e.animType = null, e.animProp = null, e.breakpoints = [], e.breakpointSettings = [], e.cssTransitions = !1, e.focussed = !1, e.interrupted = !1, e.hidden = "hidden", e.paused = !0, e.positionProp = null, e.respondTo = null, e.rowCount = 1, e.shouldClick = !0, e.$slider = a(c), e.$slidesCache = null, e.transformType = null, e.transitionType = null, e.visibilityChange = "visibilitychange", e.windowWidth = 0, e.windowTimer = null, f = a(c).data("slick") || {}, e.options = a.extend({}, e.defaults, d, f), e.currentSlide = e.options.initialSlide, e.originalSettings = e.options, "undefined" != typeof document.mozHidden ? (e.hidden = "mozHidden", e.visibilityChange = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (e.hidden = "webkitHidden", e.visibilityChange = "webkitvisibilitychange"), e.autoPlay = a.proxy(e.autoPlay, e), e.autoPlayClear = a.proxy(e.autoPlayClear, e), e.autoPlayIterator = a.proxy(e.autoPlayIterator, e), e.changeSlide = a.proxy(e.changeSlide, e), e.clickHandler = a.proxy(e.clickHandler, e), e.selectHandler = a.proxy(e.selectHandler, e), e.setPosition = a.proxy(e.setPosition, e), e.swipeHandler = a.proxy(e.swipeHandler, e), e.dragHandler = a.proxy(e.dragHandler, e), e.keyHandler = a.proxy(e.keyHandler, e), e.instanceUid = b++, e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, e.registerBreakpoints(), e.init(!0)
    }

    var b = 0;
    return c
  }(), b.prototype.activateADA = function () {
    var a = this;
    a.$slideTrack.find(".slick-active").attr({ "aria-hidden": "false" }).find("a, input, button, select").attr({ tabindex: "0" })
  }, b.prototype.addSlide = b.prototype.slickAdd = function (b, c, d) {
    var e = this;
    if ("boolean" == typeof c) d = c, c = null; else if (0 > c || c >= e.slideCount) return !1;
    e.unload(), "number" == typeof c ? 0 === c && 0 === e.$slides.length ? a(b).appendTo(e.$slideTrack) : d ? a(b).insertBefore(e.$slides.eq(c)) : a(b).insertAfter(e.$slides.eq(c)) : d === !0 ? a(b).prependTo(e.$slideTrack) : a(b).appendTo(e.$slideTrack), e.$slides = e.$slideTrack.children(this.options.slide), e.$slideTrack.children(this.options.slide).detach(), e.$slideTrack.append(e.$slides), e.$slides.each(function (b, c) {
      a(c).attr("data-slick-index", b)
    }), e.$slidesCache = e.$slides, e.reinit()
  }, b.prototype.animateHeight = function () {
    var a = this;
    if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
      var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
      a.$list.animate({ height: b }, a.options.speed)
    }
  }, b.prototype.animateSlide = function (b, c) {
    var d = {}, e = this;
    e.animateHeight(), e.options.rtl === !0 && e.options.vertical === !1 && (b = -b), e.transformsEnabled === !1 ? e.options.vertical === !1 ? e.$slideTrack.animate({ left: b }, e.options.speed, e.options.easing, c) : e.$slideTrack.animate({ top: b }, e.options.speed, e.options.easing, c) : e.cssTransitions === !1 ? (e.options.rtl === !0 && (e.currentLeft = -e.currentLeft), a({ animStart: e.currentLeft }).animate({ animStart: b }, {
      duration: e.options.speed,
      easing: e.options.easing,
      step: function (a) {
        a = Math.ceil(a), e.options.vertical === !1 ? (d[e.animType] = "translate(" + a + "px, 0px)", e.$slideTrack.css(d)) : (d[e.animType] = "translate(0px," + a + "px)", e.$slideTrack.css(d))
      },
      complete: function () {
        c && c.call()
      }
    })) : (e.applyTransition(), b = Math.ceil(b), e.options.vertical === !1 ? d[e.animType] = "translate3d(" + b + "px, 0px, 0px)" : d[e.animType] = "translate3d(0px," + b + "px, 0px)", e.$slideTrack.css(d), c && setTimeout(function () {
      e.disableTransition(), c.call()
    }, e.options.speed))
  }, b.prototype.getNavTarget = function () {
    var b = this, c = b.options.asNavFor;
    return c && null !== c && (c = a(c).not(b.$slider)), c
  }, b.prototype.asNavFor = function (b) {
    var c = this, d = c.getNavTarget();
    null !== d && "object" == typeof d && d.each(function () {
      var c = a(this).slick("getSlick");
      c.unslicked || c.slideHandler(b, !0)
    })
  }, b.prototype.applyTransition = function (a) {
    var b = this, c = {};
    b.options.fade === !1 ? c[b.transitionType] = b.transformType + " " + b.options.speed + "ms " + b.options.cssEase : c[b.transitionType] = "opacity " + b.options.speed + "ms " + b.options.cssEase, b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c)
  }, b.prototype.autoPlay = function () {
    var a = this;
    a.autoPlayClear(), a.slideCount > a.options.slidesToShow && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed))
  }, b.prototype.autoPlayClear = function () {
    var a = this;
    a.autoPlayTimer && clearInterval(a.autoPlayTimer)
  }, b.prototype.autoPlayIterator = function () {
    var a = this, b = a.currentSlide + a.options.slidesToScroll;
    a.paused || a.interrupted || a.focussed || (a.options.infinite === !1 && (1 === a.direction && a.currentSlide + 1 === a.slideCount - 1 ? a.direction = 0 : 0 === a.direction && (b = a.currentSlide - a.options.slidesToScroll, a.currentSlide - 1 === 0 && (a.direction = 1))), a.slideHandler(b))
  }, b.prototype.buildArrows = function () {
    var b = this;
    b.options.arrows === !0 && (b.$prevArrow = a(b.options.prevArrow).addClass("slick-arrow"), b.$nextArrow = a(b.options.nextArrow).addClass("slick-arrow"), b.slideCount > b.options.slidesToShow ? (b.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.prependTo(b.options.appendArrows), b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows), b.options.infinite !== !0 && b.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : b.$prevArrow.add(b.$nextArrow).addClass("slick-hidden").attr({
      "aria-disabled": "true",
      tabindex: "-1"
    }))
  }, b.prototype.buildDots = function () {
    var c, d, b = this;
    if (b.options.dots === !0 && b.slideCount > b.options.slidesToShow) {
      for (b.$slider.addClass("slick-dotted"), d = a("<ul />").addClass(b.options.dotsClass), c = 0; c <= b.getDotCount(); c += 1) {
        d.append(a("<li />").append(b.options.customPaging.call(this, b, c)));
      }
      b.$dots = d.appendTo(b.options.appendDots), b.$dots.find("li").first().addClass("slick-active").attr("aria-hidden", "false")
    }
  }, b.prototype.buildOut = function () {
    var b = this;
    b.$slides = b.$slider.children(b.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), b.slideCount = b.$slides.length, b.$slides.each(function (b, c) {
      a(c).attr("data-slick-index", b).data("originalStyling", a(c).attr("style") || "")
    }), b.$slider.addClass("slick-slider"), b.$slideTrack = 0 === b.slideCount ? a('<div class="slick-track"/>').appendTo(b.$slider) : b.$slides.wrapAll('<div class="slick-track"/>').parent(), b.$list = b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent(), b.$slideTrack.css("opacity", 0), (b.options.centerMode === !0 || b.options.swipeToSlide === !0) && (b.options.slidesToScroll = 1), a("img[data-lazy]", b.$slider).not("[src]").addClass("slick-loading"), b.setupInfinite(), b.buildArrows(), b.buildDots(), b.updateDots(), b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0), b.options.draggable === !0 && b.$list.addClass("draggable")
  }, b.prototype.buildRows = function () {
    var b, c, d, e, f, g, h, a = this;
    if (e = document.createDocumentFragment(), g = a.$slider.children(), a.options.rows > 1) {
      for (h = a.options.slidesPerRow * a.options.rows, f = Math.ceil(g.length / h), b = 0; f > b; b++) {
        var i = document.createElement("div");
        for (c = 0; c < a.options.rows; c++) {
          var j = document.createElement("div");
          for (d = 0; d < a.options.slidesPerRow; d++) {
            var k = b * h + (c * a.options.slidesPerRow + d);
            g.get(k) && j.appendChild(g.get(k))
          }
          i.appendChild(j)
        }
        e.appendChild(i)
      }
      a.$slider.empty().append(e), a.$slider.children().children().children().css({
        width: 100 / a.options.slidesPerRow + "%",
        display: "inline-block"
      })
    }
  }, b.prototype.checkResponsive = function (b, c) {
    var e, f, g, d = this, h = !1, i = d.$slider.width(),
      j = window.innerWidth || a(window).width();
    if ("window" === d.respondTo ? g = j : "slider" === d.respondTo ? g = i : "min" === d.respondTo && (g = Math.min(j, i)), d.options.responsive && d.options.responsive.length && null !== d.options.responsive) {
      f = null;
      for (e in d.breakpoints) {
        d.breakpoints.hasOwnProperty(e) && (d.originalSettings.mobileFirst === !1 ? g < d.breakpoints[e] && (f = d.breakpoints[e]) : g > d.breakpoints[e] && (f = d.breakpoints[e]));
      }
      null !== f ? null !== d.activeBreakpoint ? (f !== d.activeBreakpoint || c) && (d.activeBreakpoint = f, "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : (d.activeBreakpoint = f, "unslick" === d.breakpointSettings[f] ? d.unslick(f) : (d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f]), b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b)), h = f) : null !== d.activeBreakpoint && (d.activeBreakpoint = null, d.options = d.originalSettings, b === !0 && (d.currentSlide = d.options.initialSlide), d.refresh(b), h = f), b || h === !1 || d.$slider.trigger("breakpoint", [d, h])
    }
  }, b.prototype.changeSlide = function (b, c) {
    var f, g, h, d = this, e = a(b.currentTarget);
    switch (e.is("a") && b.preventDefault(), e.is("li") || (e = e.closest("li")), h = d.slideCount % d.options.slidesToScroll !== 0, f = h ? 0 : (d.slideCount - d.currentSlide) % d.options.slidesToScroll, b.data.message) {
      case"previous":
        g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c);
        break;
      case"next":
        g = 0 === f ? d.options.slidesToScroll : f, d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c);
        break;
      case"index":
        var i = 0 === b.data.index ? 0 : b.data.index || e.index() * d.options.slidesToScroll;
        d.slideHandler(d.checkNavigable(i), !1, c), e.children().trigger("focus");
        break;
      default:
        return
    }
  }, b.prototype.checkNavigable = function (a) {
    var c, d, b = this;
    if (c = b.getNavigableIndexes(), d = 0, a > c[c.length - 1]) {
      a = c[c.length - 1];
    } else {
      for (var e in c) {
        if (a < c[e]) {
          a = d;
          break
        }
        d = c[e]
      }
    }
    return a
  }, b.prototype.cleanUpEvents = function () {
    var b = this;
    b.options.dots && null !== b.$dots && a("li", b.$dots).off("click.slick", b.changeSlide).off("mouseenter.slick", a.proxy(b.interrupt, b, !0)).off("mouseleave.slick", a.proxy(b.interrupt, b, !1)), b.$slider.off("focus.slick blur.slick"), b.options.arrows === !0 && b.slideCount > b.options.slidesToShow && (b.$prevArrow && b.$prevArrow.off("click.slick", b.changeSlide), b.$nextArrow && b.$nextArrow.off("click.slick", b.changeSlide)), b.$list.off("touchstart.slick mousedown.slick", b.swipeHandler), b.$list.off("touchmove.slick mousemove.slick", b.swipeHandler), b.$list.off("touchend.slick mouseup.slick", b.swipeHandler), b.$list.off("touchcancel.slick mouseleave.slick", b.swipeHandler), b.$list.off("click.slick", b.clickHandler), a(document).off(b.visibilityChange, b.visibility), b.cleanUpSlideEvents(), b.options.accessibility === !0 && b.$list.off("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().off("click.slick", b.selectHandler), a(window).off("orientationchange.slick.slick-" + b.instanceUid, b.orientationChange), a(window).off("resize.slick.slick-" + b.instanceUid, b.resize), a("[draggable!=true]", b.$slideTrack).off("dragstart", b.preventDefault), a(window).off("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).off("ready.slick.slick-" + b.instanceUid, b.setPosition)
  }, b.prototype.cleanUpSlideEvents = function () {
    var b = this;
    b.$list.off("mouseenter.slick", a.proxy(b.interrupt, b, !0)), b.$list.off("mouseleave.slick", a.proxy(b.interrupt, b, !1))
  }, b.prototype.cleanUpRows = function () {
    var b, a = this;
    a.options.rows > 1 && (b = a.$slides.children().children(), b.removeAttr("style"), a.$slider.empty().append(b))
  }, b.prototype.clickHandler = function (a) {
    var b = this;
    b.shouldClick === !1 && (a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault())
  }, b.prototype.destroy = function (b) {
    var c = this;
    c.autoPlayClear(), c.touchObject = {}, c.cleanUpEvents(), a(".slick-cloned", c.$slider).detach(), c.$dots && c.$dots.remove(), c.$prevArrow && c.$prevArrow.length && (c.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), c.htmlExpr.test(c.options.prevArrow) && c.$prevArrow.remove()), c.$nextArrow && c.$nextArrow.length && (c.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), c.htmlExpr.test(c.options.nextArrow) && c.$nextArrow.remove()), c.$slides && (c.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
      a(this).attr("style", a(this).data("originalStyling"))
    }), c.$slideTrack.children(this.options.slide).detach(), c.$slideTrack.detach(), c.$list.detach(), c.$slider.append(c.$slides)), c.cleanUpRows(), c.$slider.removeClass("slick-slider"), c.$slider.removeClass("slick-initialized"), c.$slider.removeClass("slick-dotted"), c.unslicked = !0, b || c.$slider.trigger("destroy", [c])
  }, b.prototype.disableTransition = function (a) {
    var b = this, c = {};
    c[b.transitionType] = "", b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c)
  }, b.prototype.fadeSlide = function (a, b) {
    var c = this;
    c.cssTransitions === !1 ? (c.$slides.eq(a).css({ zIndex: c.options.zIndex }), c.$slides.eq(a).animate({ opacity: 1 }, c.options.speed, c.options.easing, b)) : (c.applyTransition(a), c.$slides.eq(a).css({
      opacity: 1,
      zIndex: c.options.zIndex
    }), b && setTimeout(function () {
      c.disableTransition(a), b.call()
    }, c.options.speed))
  }, b.prototype.fadeSlideOut = function (a) {
    var b = this;
    b.cssTransitions === !1 ? b.$slides.eq(a).animate({
      opacity: 0,
      zIndex: b.options.zIndex - 2
    }, b.options.speed, b.options.easing) : (b.applyTransition(a), b.$slides.eq(a).css({
      opacity: 0,
      zIndex: b.options.zIndex - 2
    }))
  }, b.prototype.filterSlides = b.prototype.slickFilter = function (a) {
    var b = this;
    null !== a && (b.$slidesCache = b.$slides, b.unload(), b.$slideTrack.children(this.options.slide).detach(), b.$slidesCache.filter(a).appendTo(b.$slideTrack), b.reinit())
  }, b.prototype.focusHandler = function () {
    var b = this;
    b.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*:not(.slick-arrow)", function (c) {
      c.stopImmediatePropagation();
      var d = a(this);
      setTimeout(function () {
        b.options.pauseOnFocus && (b.focussed = d.is(":focus"), b.autoPlay())
      }, 0)
    })
  }, b.prototype.getCurrent = b.prototype.slickCurrentSlide = function () {
    var a = this;
    return a.currentSlide
  }, b.prototype.getDotCount = function () {
    var a = this, b = 0, c = 0, d = 0;
    if (a.options.infinite === !0) {
      for (; b < a.slideCount;) {
        ++d, b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
      }
    } else if (a.options.centerMode === !0) {
      d = a.slideCount;
    } else if (a.options.asNavFor) {
      for (; b < a.slideCount;) {
        ++d, b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
      }
    } else {
      d = 1 + Math.ceil((a.slideCount - a.options.slidesToShow) / a.options.slidesToScroll);
    }
    return d - 1
  }, b.prototype.getLeft = function (a) {
    var c, d, f, b = this, e = 0;
    return b.slideOffset = 0, d = b.$slides.first().outerHeight(!0), b.options.infinite === !0 ? (b.slideCount > b.options.slidesToShow && (b.slideOffset = b.slideWidth * b.options.slidesToShow * -1, e = d * b.options.slidesToShow * -1), b.slideCount % b.options.slidesToScroll !== 0 && a + b.options.slidesToScroll > b.slideCount && b.slideCount > b.options.slidesToShow && (a > b.slideCount ? (b.slideOffset = (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth * -1, e = (b.options.slidesToShow - (a - b.slideCount)) * d * -1) : (b.slideOffset = b.slideCount % b.options.slidesToScroll * b.slideWidth * -1, e = b.slideCount % b.options.slidesToScroll * d * -1))) : a + b.options.slidesToShow > b.slideCount && (b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth, e = (a + b.options.slidesToShow - b.slideCount) * d), b.slideCount <= b.options.slidesToShow && (b.slideOffset = 0, e = 0), b.options.centerMode === !0 && b.options.infinite === !0 ? b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth : b.options.centerMode === !0 && (b.slideOffset = 0, b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2)), c = b.options.vertical === !1 ? a * b.slideWidth * -1 + b.slideOffset : a * d * -1 + e, b.options.variableWidth === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow), c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, b.options.centerMode === !0 && (f = b.slideCount <= b.options.slidesToShow || b.options.infinite === !1 ? b.$slideTrack.children(".slick-slide").eq(a) : b.$slideTrack.children(".slick-slide").eq(a + b.options.slidesToShow + 1), c = b.options.rtl === !0 ? f[0] ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width()) : 0 : f[0] ? -1 * f[0].offsetLeft : 0, c += (b.$list.width() - f.outerWidth()) / 2)), c
  }, b.prototype.getOption = b.prototype.slickGetOption = function (a) {
    var b = this;
    return b.options[a]
  }, b.prototype.getNavigableIndexes = function () {
    var e, a = this, b = 0, c = 0, d = [];
    for (a.options.infinite === !1 ? e = a.slideCount : (b = -1 * a.options.slidesToScroll, c = -1 * a.options.slidesToScroll, e = 2 * a.slideCount); e > b;) {
      d.push(b), b = c + a.options.slidesToScroll, c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow;
    }
    return d
  }, b.prototype.getSlick = function () {
    return this
  }, b.prototype.getSlideCount = function () {
    var c, d, e, b = this;
    return e = b.options.centerMode === !0 ? b.slideWidth * Math.floor(b.options.slidesToShow / 2) : 0, b.options.swipeToSlide === !0 ? (b.$slideTrack.find(".slick-slide").each(function (c, f) {
      return f.offsetLeft - e + a(f).outerWidth() / 2 > -1 * b.swipeLeft ? (d = f, !1) : void 0
    }), c = Math.abs(a(d).attr("data-slick-index") - b.currentSlide) || 1) : b.options.slidesToScroll
  }, b.prototype.goTo = b.prototype.slickGoTo = function (a, b) {
    var c = this;
    c.changeSlide({ data: { message: "index", index: parseInt(a) } }, b)
  }, b.prototype.init = function (b) {
    var c = this;
    a(c.$slider).hasClass("slick-initialized") || (a(c.$slider).addClass("slick-initialized"), c.buildRows(), c.buildOut(), c.setProps(), c.startLoad(), c.loadSlider(), c.initializeEvents(), c.updateArrows(), c.updateDots(), c.checkResponsive(!0), c.focusHandler()), b && c.$slider.trigger("init", [c]), c.options.accessibility === !0 && c.initADA(), c.options.autoplay && (c.paused = !1, c.autoPlay())
  }, b.prototype.initADA = function () {
    var b = this;
    b.$slides.add(b.$slideTrack.find(".slick-cloned")).attr({
      "aria-hidden": "true",
      tabindex: "-1"
    }).find("a, input, button, select").attr({ tabindex: "-1" }), b.$slideTrack.attr("role", "listbox"), b.$slides.not(b.$slideTrack.find(".slick-cloned")).each(function (c) {
      a(this).attr({ role: "option", "aria-describedby": "slick-slide" + b.instanceUid + c })
    }), null !== b.$dots && b.$dots.attr("role", "tablist").find("li").each(function (c) {
      a(this).attr({
        role: "presentation",
        "aria-selected": "false",
        "aria-controls": "navigation" + b.instanceUid + c,
        id: "slick-slide" + b.instanceUid + c
      })
    }).first().attr("aria-selected", "true").end().find("button").attr("role", "button").end().closest("div").attr("role", "toolbar"), b.activateADA()
  }, b.prototype.initArrowEvents = function () {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.off("click.slick").on("click.slick", { message: "previous" }, a.changeSlide), a.$nextArrow.off("click.slick").on("click.slick", { message: "next" }, a.changeSlide))
  }, b.prototype.initDotEvents = function () {
    var b = this;
    b.options.dots === !0 && b.slideCount > b.options.slidesToShow && a("li", b.$dots).on("click.slick", { message: "index" }, b.changeSlide), b.options.dots === !0 && b.options.pauseOnDotsHover === !0 && a("li", b.$dots).on("mouseenter.slick", a.proxy(b.interrupt, b, !0)).on("mouseleave.slick", a.proxy(b.interrupt, b, !1))
  }, b.prototype.initSlideEvents = function () {
    var b = this;
    b.options.pauseOnHover && (b.$list.on("mouseenter.slick", a.proxy(b.interrupt, b, !0)), b.$list.on("mouseleave.slick", a.proxy(b.interrupt, b, !1)))
  }, b.prototype.initializeEvents = function () {
    var b = this;
    b.initArrowEvents(), b.initDotEvents(), b.initSlideEvents(), b.$list.on("touchstart.slick mousedown.slick", { action: "start" }, b.swipeHandler), b.$list.on("touchmove.slick mousemove.slick", { action: "move" }, b.swipeHandler), b.$list.on("touchend.slick mouseup.slick", { action: "end" }, b.swipeHandler), b.$list.on("touchcancel.slick mouseleave.slick", { action: "end" }, b.swipeHandler), b.$list.on("click.slick", b.clickHandler), a(document).on(b.visibilityChange, a.proxy(b.visibility, b)), b.options.accessibility === !0 && b.$list.on("keydown.slick", b.keyHandler), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler), a(window).on("orientationchange.slick.slick-" + b.instanceUid, a.proxy(b.orientationChange, b)), a(window).on("resize.slick.slick-" + b.instanceUid, a.proxy(b.resize, b)), a("[draggable!=true]", b.$slideTrack).on("dragstart", b.preventDefault), a(window).on("load.slick.slick-" + b.instanceUid, b.setPosition), a(document).on("ready.slick.slick-" + b.instanceUid, b.setPosition)
  }, b.prototype.initUI = function () {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(), a.$nextArrow.show()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.show()
  }, b.prototype.keyHandler = function (a) {
    var b = this;
    a.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === a.keyCode && b.options.accessibility === !0 ? b.changeSlide({ data: { message: b.options.rtl === !0 ? "next" : "previous" } }) : 39 === a.keyCode && b.options.accessibility === !0 && b.changeSlide({ data: { message: b.options.rtl === !0 ? "previous" : "next" } }))
  }, b.prototype.lazyLoad = function () {
    function g(c) {
      a("img[data-lazy]", c).each(function () {
        var c = a(this), d = a(this).attr("data-lazy"), e = document.createElement("img");
        e.onload = function () {
          c.animate({ opacity: 0 }, 100, function () {
            c.attr("src", d).animate({ opacity: 1 }, 200, function () {
              c.removeAttr("data-lazy").removeClass("slick-loading")
            }), b.$slider.trigger("lazyLoaded", [b, c, d])
          })
        }, e.onerror = function () {
          c.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), b.$slider.trigger("lazyLoadError", [b, c, d])
        }, e.src = d
      })
    }

    var c, d, e, f, b = this;
    b.options.centerMode === !0 ? b.options.infinite === !0 ? (e = b.currentSlide + (b.options.slidesToShow / 2 + 1), f = e + b.options.slidesToShow + 2) : (e = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1)), f = 2 + (b.options.slidesToShow / 2 + 1) + b.currentSlide) : (e = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide, f = Math.ceil(e + b.options.slidesToShow), b.options.fade === !0 && (e > 0 && e--, f <= b.slideCount && f++)), c = b.$slider.find(".slick-slide").slice(e, f), g(c), b.slideCount <= b.options.slidesToShow ? (d = b.$slider.find(".slick-slide"), g(d)) : b.currentSlide >= b.slideCount - b.options.slidesToShow ? (d = b.$slider.find(".slick-cloned").slice(0, b.options.slidesToShow), g(d)) : 0 === b.currentSlide && (d = b.$slider.find(".slick-cloned").slice(-1 * b.options.slidesToShow), g(d))
  }, b.prototype.loadSlider = function () {
    var a = this;
    a.setPosition(), a.$slideTrack.css({ opacity: 1 }), a.$slider.removeClass("slick-loading"), a.initUI(), "progressive" === a.options.lazyLoad && a.progressiveLazyLoad()
  }, b.prototype.next = b.prototype.slickNext = function () {
    var a = this;
    a.changeSlide({ data: { message: "next" } })
  }, b.prototype.orientationChange = function () {
    var a = this;
    a.checkResponsive(), a.setPosition()
  }, b.prototype.pause = b.prototype.slickPause = function () {
    var a = this;
    a.autoPlayClear(), a.paused = !0
  }, b.prototype.play = b.prototype.slickPlay = function () {
    var a = this;
    a.autoPlay(), a.options.autoplay = !0, a.paused = !1, a.focussed = !1, a.interrupted = !1
  }, b.prototype.postSlide = function (a) {
    var b = this;
    b.unslicked || (b.$slider.trigger("afterChange", [b, a]), b.animating = !1, b.setPosition(), b.swipeLeft = null, b.options.autoplay && b.autoPlay(), b.options.accessibility === !0 && b.initADA())
  }, b.prototype.prev = b.prototype.slickPrev = function () {
    var a = this;
    a.changeSlide({ data: { message: "previous" } })
  }, b.prototype.preventDefault = function (a) {
    a.preventDefault()
  }, b.prototype.progressiveLazyLoad = function (b) {
    b = b || 1;
    var e, f, g, c = this, d = a("img[data-lazy]", c.$slider);
    d.length ? (e = d.first(), f = e.attr("data-lazy"), g = document.createElement("img"), g.onload = function () {
      e.attr("src", f).removeAttr("data-lazy").removeClass("slick-loading"), c.options.adaptiveHeight === !0 && c.setPosition(), c.$slider.trigger("lazyLoaded", [c, e, f]), c.progressiveLazyLoad()
    }, g.onerror = function () {
      3 > b ? setTimeout(function () {
        c.progressiveLazyLoad(b + 1)
      }, 500) : (e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), c.$slider.trigger("lazyLoadError", [c, e, f]), c.progressiveLazyLoad())
    }, g.src = f) : c.$slider.trigger("allImagesLoaded", [c])
  }, b.prototype.refresh = function (b) {
    var d, e, c = this;
    e = c.slideCount - c.options.slidesToShow, !c.options.infinite && c.currentSlide > e && (c.currentSlide = e), c.slideCount <= c.options.slidesToShow && (c.currentSlide = 0), d = c.currentSlide, c.destroy(!0), a.extend(c, c.initials, { currentSlide: d }), c.init(), b || c.changeSlide({
      data: {
        message: "index",
        index: d
      }
    }, !1)
  }, b.prototype.registerBreakpoints = function () {
    var c, d, e, b = this, f = b.options.responsive || null;
    if ("array" === a.type(f) && f.length) {
      b.respondTo = b.options.respondTo || "window";
      for (c in f) {
        if (e = b.breakpoints.length - 1, d = f[c].breakpoint, f.hasOwnProperty(c)) {
          for (; e >= 0;) {
            b.breakpoints[e] && b.breakpoints[e] === d && b.breakpoints.splice(e, 1), e--;
          }
          b.breakpoints.push(d), b.breakpointSettings[d] = f[c].settings
        }
      }
      b.breakpoints.sort(function (a, c) {
        return b.options.mobileFirst ? a - c : c - a
      })
    }
  }, b.prototype.reinit = function () {
    var b = this;
    b.$slides = b.$slideTrack.children(b.options.slide).addClass("slick-slide"), b.slideCount = b.$slides.length, b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll), b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0), b.registerBreakpoints(), b.setProps(), b.setupInfinite(), b.buildArrows(), b.updateArrows(), b.initArrowEvents(), b.buildDots(), b.updateDots(), b.initDotEvents(), b.cleanUpSlideEvents(), b.initSlideEvents(), b.checkResponsive(!1, !0), b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on("click.slick", b.selectHandler), b.setSlideClasses("number" == typeof b.currentSlide ? b.currentSlide : 0), b.setPosition(), b.focusHandler(), b.paused = !b.options.autoplay, b.autoPlay(), b.$slider.trigger("reInit", [b])
  }, b.prototype.resize = function () {
    var b = this;
    a(window).width() !== b.windowWidth && (clearTimeout(b.windowDelay), b.windowDelay = window.setTimeout(function () {
      b.windowWidth = a(window).width(), b.checkResponsive(), b.unslicked || b.setPosition()
    }, 50))
  }, b.prototype.removeSlide = b.prototype.slickRemove = function (a, b, c) {
    var d = this;
    return "boolean" == typeof a ? (b = a, a = b === !0 ? 0 : d.slideCount - 1) : a = b === !0 ? --a : a, d.slideCount < 1 || 0 > a || a > d.slideCount - 1 ? !1 : (d.unload(), c === !0 ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(), d.$slides = d.$slideTrack.children(this.options.slide), d.$slideTrack.children(this.options.slide).detach(), d.$slideTrack.append(d.$slides), d.$slidesCache = d.$slides, void d.reinit())
  }, b.prototype.setCSS = function (a) {
    var d, e, b = this, c = {};
    b.options.rtl === !0 && (a = -a), d = "left" == b.positionProp ? Math.ceil(a) + "px" : "0px", e = "top" == b.positionProp ? Math.ceil(a) + "px" : "0px", c[b.positionProp] = a, b.transformsEnabled === !1 ? b.$slideTrack.css(c) : (c = {}, b.cssTransitions === !1 ? (c[b.animType] = "translate(" + d + ", " + e + ")", b.$slideTrack.css(c)) : (c[b.animType] = "translate3d(" + d + ", " + e + ", 0px)", b.$slideTrack.css(c)))
  }, b.prototype.setDimensions = function () {
    var a = this;
    a.options.vertical === !1 ? a.options.centerMode === !0 && a.$list.css({ padding: "0px " + a.options.centerPadding }) : (a.$list.height(a.$slides.first().outerHeight(!0) * a.options.slidesToShow), a.options.centerMode === !0 && a.$list.css({ padding: a.options.centerPadding + " 0px" })), a.listWidth = a.$list.width(), a.listHeight = a.$list.height(), a.options.vertical === !1 && a.options.variableWidth === !1 ? (a.slideWidth = Math.ceil(a.listWidth / a.options.slidesToShow), a.$slideTrack.width(Math.ceil(a.slideWidth * a.$slideTrack.children(".slick-slide").length))) : a.options.variableWidth === !0 ? a.$slideTrack.width(5e3 * a.slideCount) : (a.slideWidth = Math.ceil(a.listWidth), a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0) * a.$slideTrack.children(".slick-slide").length)));
    var b = a.$slides.first().outerWidth(!0) - a.$slides.first().width();
    a.options.variableWidth === !1 && a.$slideTrack.children(".slick-slide").width(a.slideWidth - b)
  }, b.prototype.setFade = function () {
    var c, b = this;
    b.$slides.each(function (d, e) {
      c = b.slideWidth * d * -1, b.options.rtl === !0 ? a(e).css({
        position: "relative",
        right: c,
        top: 0,
        zIndex: b.options.zIndex - 2,
        opacity: 0
      }) : a(e).css({
        position: "relative",
        left: c,
        top: 0,
        zIndex: b.options.zIndex - 2,
        opacity: 0
      })
    }), b.$slides.eq(b.currentSlide).css({ zIndex: b.options.zIndex - 1, opacity: 1 })
  }, b.prototype.setHeight = function () {
    var a = this;
    if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
      var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
      a.$list.css("height", b)
    }
  }, b.prototype.setOption = b.prototype.slickSetOption = function () {
    var c, d, e, f, h, b = this, g = !1;
    if ("object" === a.type(arguments[0]) ? (e = arguments[0], g = arguments[1], h = "multiple") : "string" === a.type(arguments[0]) && (e = arguments[0], f = arguments[1], g = arguments[2], "responsive" === arguments[0] && "array" === a.type(arguments[1]) ? h = "responsive" : "undefined" != typeof arguments[1] && (h = "single")), "single" === h) {
      b.options[e] = f;
    } else if ("multiple" === h) {
      a.each(e, function (a, c) {
        b.options[a] = c
      });
    } else if ("responsive" === h) {
      for (d in f) {
        if ("array" !== a.type(b.options.responsive)) {
          b.options.responsive = [f[d]];
        } else {
          for (c = b.options.responsive.length - 1; c >= 0;) {
            b.options.responsive[c].breakpoint === f[d].breakpoint && b.options.responsive.splice(c, 1), c--;
          }
          b.options.responsive.push(f[d])
        }
      }
    }
    g && (b.unload(), b.reinit())
  }, b.prototype.setPosition = function () {
    var a = this;
    a.setDimensions(), a.setHeight(), a.options.fade === !1 ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(), a.$slider.trigger("setPosition", [a])
  }, b.prototype.setProps = function () {
    var a = this, b = document.body.style;
    a.positionProp = a.options.vertical === !0 ? "top" : "left", "top" === a.positionProp ? a.$slider.addClass("slick-vertical") : a.$slider.removeClass("slick-vertical"), (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) && a.options.useCSS === !0 && (a.cssTransitions = !0), a.options.fade && ("number" == typeof a.options.zIndex ? a.options.zIndex < 3 && (a.options.zIndex = 3) : a.options.zIndex = a.defaults.zIndex), void 0 !== b.OTransform && (a.animType = "OTransform", a.transformType = "-o-transform", a.transitionType = "OTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.MozTransform && (a.animType = "MozTransform", a.transformType = "-moz-transform", a.transitionType = "MozTransition", void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)), void 0 !== b.webkitTransform && (a.animType = "webkitTransform", a.transformType = "-webkit-transform", a.transitionType = "webkitTransition", void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)), void 0 !== b.msTransform && (a.animType = "msTransform", a.transformType = "-ms-transform", a.transitionType = "msTransition", void 0 === b.msTransform && (a.animType = !1)), void 0 !== b.transform && a.animType !== !1 && (a.animType = "transform", a.transformType = "transform", a.transitionType = "transition"), a.transformsEnabled = a.options.useTransform && null !== a.animType && a.animType !== !1
  }, b.prototype.setSlideClasses = function (a) {
    var c, d, e, f, b = this;
    d = b.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), b.$slides.eq(a).addClass("slick-current"), b.options.centerMode === !0 ? (c = Math.floor(b.options.slidesToShow / 2), b.options.infinite === !0 && (a >= c && a <= b.slideCount - 1 - c ? b.$slides.slice(a - c, a + c + 1).addClass("slick-active").attr("aria-hidden", "false") : (e = b.options.slidesToShow + a,
      d.slice(e - c + 1, e + c + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === a ? d.eq(d.length - 1 - b.options.slidesToShow).addClass("slick-center") : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass("slick-center")), b.$slides.eq(a).addClass("slick-center")) : a >= 0 && a <= b.slideCount - b.options.slidesToShow ? b.$slides.slice(a, a + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : d.length <= b.options.slidesToShow ? d.addClass("slick-active").attr("aria-hidden", "false") : (f = b.slideCount % b.options.slidesToShow, e = b.options.infinite === !0 ? b.options.slidesToShow + a : a, b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow ? d.slice(e - (b.options.slidesToShow - f), e + f).addClass("slick-active").attr("aria-hidden", "false") : d.slice(e, e + b.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" === b.options.lazyLoad && b.lazyLoad()
  }, b.prototype.setupInfinite = function () {
    var c, d, e, b = this;
    if (b.options.fade === !0 && (b.options.centerMode = !1), b.options.infinite === !0 && b.options.fade === !1 && (d = null, b.slideCount > b.options.slidesToShow)) {
      for (e = b.options.centerMode === !0 ? b.options.slidesToShow + 1 : b.options.slidesToShow, c = b.slideCount; c > b.slideCount - e; c -= 1) {
        d = c - 1, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d - b.slideCount).prependTo(b.$slideTrack).addClass("slick-cloned");
      }
      for (c = 0; e > c; c += 1) {
        d = c, a(b.$slides[d]).clone(!0).attr("id", "").attr("data-slick-index", d + b.slideCount).appendTo(b.$slideTrack).addClass("slick-cloned");
      }
      b.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
        a(this).attr("id", "")
      })
    }
  }, b.prototype.interrupt = function (a) {
    var b = this;
    a || b.autoPlay(), b.interrupted = a
  }, b.prototype.selectHandler = function (b) {
    var c = this,
      d = a(b.target).is(".slick-slide") ? a(b.target) : a(b.target).parents(".slick-slide"),
      e = parseInt(d.attr("data-slick-index"));
    return e || (e = 0), c.slideCount <= c.options.slidesToShow ? (c.setSlideClasses(e), void c.asNavFor(e)) : void c.slideHandler(e)
  }, b.prototype.slideHandler = function (a, b, c) {
    var d, e, f, g, j, h = null, i = this;
    return b = b || !1, i.animating === !0 && i.options.waitForAnimate === !0 || i.options.fade === !0 && i.currentSlide === a || i.slideCount <= i.options.slidesToShow ? void 0 : (b === !1 && i.asNavFor(a), d = a, h = i.getLeft(d), g = i.getLeft(i.currentSlide), i.currentLeft = null === i.swipeLeft ? g : i.swipeLeft, i.options.infinite === !1 && i.options.centerMode === !1 && (0 > a || a > i.getDotCount() * i.options.slidesToScroll) ? void(i.options.fade === !1 && (d = i.currentSlide, c !== !0 ? i.animateSlide(g, function () {
      i.postSlide(d)
    }) : i.postSlide(d))) : i.options.infinite === !1 && i.options.centerMode === !0 && (0 > a || a > i.slideCount - i.options.slidesToScroll) ? void(i.options.fade === !1 && (d = i.currentSlide, c !== !0 ? i.animateSlide(g, function () {
      i.postSlide(d)
    }) : i.postSlide(d))) : (i.options.autoplay && clearInterval(i.autoPlayTimer), e = 0 > d ? i.slideCount % i.options.slidesToScroll !== 0 ? i.slideCount - i.slideCount % i.options.slidesToScroll : i.slideCount + d : d >= i.slideCount ? i.slideCount % i.options.slidesToScroll !== 0 ? 0 : d - i.slideCount : d, i.animating = !0, i.$slider.trigger("beforeChange", [i, i.currentSlide, e]), f = i.currentSlide, i.currentSlide = e, i.setSlideClasses(i.currentSlide), i.options.asNavFor && (j = i.getNavTarget(), j = j.slick("getSlick"), j.slideCount <= j.options.slidesToShow && j.setSlideClasses(i.currentSlide)), i.updateDots(), i.updateArrows(), i.options.fade === !0 ? (c !== !0 ? (i.fadeSlideOut(f), i.fadeSlide(e, function () {
      i.postSlide(e)
    })) : i.postSlide(e), void i.animateHeight()) : void(c !== !0 ? i.animateSlide(h, function () {
      i.postSlide(e)
    }) : i.postSlide(e))))
  }, b.prototype.startLoad = function () {
    var a = this;
    a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(), a.$nextArrow.hide()), a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.hide(), a.$slider.addClass("slick-loading")
  }, b.prototype.swipeDirection = function () {
    var a, b, c, d, e = this;
    return a = e.touchObject.startX - e.touchObject.curX, b = e.touchObject.startY - e.touchObject.curY, c = Math.atan2(b, a), d = Math.round(180 * c / Math.PI), 0 > d && (d = 360 - Math.abs(d)), 45 >= d && d >= 0 ? e.options.rtl === !1 ? "left" : "right" : 360 >= d && d >= 315 ? e.options.rtl === !1 ? "left" : "right" : d >= 135 && 225 >= d ? e.options.rtl === !1 ? "right" : "left" : e.options.verticalSwiping === !0 ? d >= 35 && 135 >= d ? "down" : "up" : "vertical"
  }, b.prototype.swipeEnd = function (a) {
    var c, d, b = this;
    if (b.dragging = !1, b.interrupted = !1, b.shouldClick = b.touchObject.swipeLength > 10 ? !1 : !0, void 0 === b.touchObject.curX) return !1;
    if (b.touchObject.edgeHit === !0 && b.$slider.trigger("edge", [b, b.swipeDirection()]), b.touchObject.swipeLength >= b.touchObject.minSwipe) {
      switch (d = b.swipeDirection()) {
        case"left":
        case"down":
          c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide + b.getSlideCount()) : b.currentSlide + b.getSlideCount(), b.currentDirection = 0;
          break;
        case"right":
        case"up":
          c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide - b.getSlideCount()) : b.currentSlide - b.getSlideCount(), b.currentDirection = 1
      }
      "vertical" != d && (b.slideHandler(c), b.touchObject = {}, b.$slider.trigger("swipe", [b, d]))
    } else {
      b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide), b.touchObject = {})
    }
  }, b.prototype.swipeHandler = function (a) {
    var b = this;
    if (!(b.options.swipe === !1 || "ontouchend" in document && b.options.swipe === !1 || b.options.draggable === !1 && -1 !== a.type.indexOf("mouse"))) {
      switch (b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1, b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold, b.options.verticalSwiping === !0 && (b.touchObject.minSwipe = b.listHeight / b.options.touchThreshold), a.data.action) {
        case"start":
          b.swipeStart(a);
          break;
        case"move":
          b.swipeMove(a);
          break;
        case"end":
          b.swipeEnd(a)
      }
    }
  }, b.prototype.swipeMove = function (a) {
    var d, e, f, g, h, b = this;
    return h = void 0 !== a.originalEvent ? a.originalEvent.touches : null, !b.dragging || h && 1 !== h.length ? !1 : (d = b.getLeft(b.currentSlide), b.touchObject.curX = void 0 !== h ? h[0].pageX : a.clientX, b.touchObject.curY = void 0 !== h ? h[0].pageY : a.clientY, b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2))), b.options.verticalSwiping === !0 && (b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curY - b.touchObject.startY, 2)))), e = b.swipeDirection(), "vertical" !== e ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(), g = (b.options.rtl === !1 ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ? 1 : -1), b.options.verticalSwiping === !0 && (g = b.touchObject.curY > b.touchObject.startY ? 1 : -1), f = b.touchObject.swipeLength, b.touchObject.edgeHit = !1, b.options.infinite === !1 && (0 === b.currentSlide && "right" === e || b.currentSlide >= b.getDotCount() && "left" === e) && (f = b.touchObject.swipeLength * b.options.edgeFriction, b.touchObject.edgeHit = !0), b.options.vertical === !1 ? b.swipeLeft = d + f * g : b.swipeLeft = d + f * (b.$list.height() / b.listWidth) * g, b.options.verticalSwiping === !0 && (b.swipeLeft = d + f * g), b.options.fade === !0 || b.options.touchMove === !1 ? !1 : b.animating === !0 ? (b.swipeLeft = null, !1) : void b.setCSS(b.swipeLeft)) : void 0)
  }, b.prototype.swipeStart = function (a) {
    var c, b = this;
    return b.interrupted = !0, 1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow ? (b.touchObject = {}, !1) : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]), b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX, b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY, void(b.dragging = !0))
  }, b.prototype.unfilterSlides = b.prototype.slickUnfilter = function () {
    var a = this;
    null !== a.$slidesCache && (a.unload(), a.$slideTrack.children(this.options.slide).detach(), a.$slidesCache.appendTo(a.$slideTrack), a.reinit())
  }, b.prototype.unload = function () {
    var b = this;
    a(".slick-cloned", b.$slider).remove(), b.$dots && b.$dots.remove(), b.$prevArrow && b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.remove(), b.$nextArrow && b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.remove(), b.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
  }, b.prototype.unslick = function (a) {
    var b = this;
    b.$slider.trigger("unslick", [b, a]), b.destroy()
  }, b.prototype.updateArrows = function () {
    var b, a = this;
    b = Math.floor(a.options.slidesToShow / 2), a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && !a.options.infinite && (a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === a.currentSlide ? (a.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - a.options.slidesToShow && a.options.centerMode === !1 ? (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : a.currentSlide >= a.slideCount - 1 && a.options.centerMode === !0 && (a.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), a.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
  }, b.prototype.updateDots = function () {
    var a = this;
    null !== a.$dots && (a.$dots.find("li").removeClass("slick-active").attr("aria-hidden", "true"), a.$dots.find("li").eq(Math.floor(a.currentSlide / a.options.slidesToScroll)).addClass("slick-active").attr("aria-hidden", "false"))
  }, b.prototype.visibility = function () {
    var a = this;
    a.options.autoplay && (document[a.hidden] ? a.interrupted = !0 : a.interrupted = !1)
  }, a.fn.slick = function () {
    var f, g, a = this, c = arguments[0], d = Array.prototype.slice.call(arguments, 1),
      e = a.length;
    for (f = 0; e > f; f++) {
      if ("object" == typeof c || "undefined" == typeof c ? a[f].slick = new b(a[f], c) : g = a[f].slick[c].apply(a[f].slick, d), "undefined" != typeof g) return g;
    }
    return a
  }
});
/*
 * Simple Mobile Navigation
 */
;(function ($) {
  function MobileNav(options) {
    this.options = $.extend({
      container: null,
      hideOnClickOutside: false,
      menuActiveClass: 'nav-active',
      menuOpener: '.nav-opener',
      menuDrop: '.nav-drop',
      toggleEvent: 'click',
      outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
    }, options);
    this.initStructure();
    this.attachEvents();
  }

  MobileNav.prototype = {
    initStructure: function () {
      this.page = $('html');
      this.container = $(this.options.container);
      this.opener = this.container.find(this.options.menuOpener);
      this.drop = this.container.find(this.options.menuDrop);
    },
    attachEvents: function () {
      var self = this;
      if (activateResizeHandler) {
        activateResizeHandler();
        activateResizeHandler = null;
      }
      this.outsideClickHandler = function (e) {
        if (self.isOpened()) {
          var target = $(e.target);
          if (!target.closest(self.opener).length && !target.closest(self.drop).length) {
            self.hide();
          }
        }
      };
      this.openerClickHandler = function (e) {
        e.preventDefault();
        self.toggle();
      };
      this.opener.on(this.options.toggleEvent, this.openerClickHandler);
    },
    isOpened: function () {
      return this.container.hasClass(this.options.menuActiveClass);
    },
    show: function () {
      this.container.addClass(this.options.menuActiveClass);
      if (this.options.hideOnClickOutside) {
        this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    hide: function () {
      this.container.removeClass(this.options.menuActiveClass);
      if (this.options.hideOnClickOutside) {
        this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
      }
    },
    toggle: function () {
      if (this.isOpened()) {
        this.hide();
      } else {
        this.show();
      }
    },
    destroy: function () {
      this.container.removeClass(this.options.menuActiveClass);
      this.opener.off(this.options.toggleEvent, this.clickHandler);
      this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
    }
  };
  var activateResizeHandler = function () {
    var win = $(window),
      doc = $('html'),
      resizeClass = 'resize-active',
      flag, timer;
    var removeClassHandler = function () {
      flag = false;
      doc.removeClass(resizeClass);
    };
    var resizeHandler = function () {
      if (!flag) {
        flag = true;
        doc.addClass(resizeClass);
      }
      clearTimeout(timer);
      timer = setTimeout(removeClassHandler, 500);
    };
    win.on('resize orientationchange', resizeHandler);
  };
  $.fn.mobileNav = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];
    return this.each(function () {
      var $container = jQuery(this);
      var instance = $container.data('MobileNav');
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        $container.data('MobileNav', new MobileNav($.extend({
          container: this
        }, opt)));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
}(jQuery));
/*
 * jQuery Carousel plugin
 */
;(function ($) {
  'use strict';
  // detect device type
  var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  function ScrollGallery(options) {
    this.options = $.extend({
      mask: 'div.mask',
      slider: '>*',
      slides: '>*',
      activeClass: 'active',
      disabledClass: 'disabled',
      btnPrev: 'a.btn-prev',
      btnNext: 'a.btn-next',
      generatePagination: false,
      pagerList: '<ul>',
      pagerListItem: '<li><a href="#"></a></li>',
      pagerListItemText: 'a',
      pagerLinks: '.pagination li',
      currentNumber: 'span.current-num',
      totalNumber: 'span.total-num',
      btnPlay: '.btn-play',
      btnPause: '.btn-pause',
      btnPlayPause: '.btn-play-pause',
      galleryReadyClass: 'gallery-js-ready',
      autorotationActiveClass: 'autorotation-active',
      autorotationDisabledClass: 'autorotation-disabled',
      stretchSlideToMask: false,
      circularRotation: false,
      disableWhileAnimating: false,
      autoRotation: false,
      pauseOnHover: isTouchDevice ? false : true,
      maskAutoSize: false,
      switchTime: 4000,
      animSpeed: 600,
      event: 'click',
      swipeThreshold: 15,
      handleTouch: true,
      vertical: false,
      useTranslate3D: false,
      step: false
    }, options);
    this.init();
  }

  ScrollGallery.prototype = {
    init: function () {
      if (this.options.holder) {
        this.findElements();
        this.attachEvents();
        this.refreshPosition();
        this.refreshState(true);
        this.resumeRotation();
        this.makeCallback('onInit', this);
      }
    },
    findElements: function () {
      // define dimensions proporties
      this.fullSizeFunction = this.options.vertical ? 'outerHeight' : 'outerWidth';
      this.innerSizeFunction = this.options.vertical ? 'height' : 'width';
      this.slideSizeFunction = 'outerHeight';
      this.maskSizeProperty = 'height';
      this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';
      // control elements
      this.gallery = $(this.options.holder).addClass(this.options.galleryReadyClass);
      this.mask = this.gallery.find(this.options.mask);
      this.slider = this.mask.find(this.options.slider);
      this.slides = this.slider.find(this.options.slides);
      this.btnPrev = this.gallery.find(this.options.btnPrev);
      this.btnNext = this.gallery.find(this.options.btnNext);
      this.currentStep = 0;
      this.stepsCount = 0;
      // get start index
      if (this.options.step === false) {
        var activeSlide = this.slides.filter('.' + this.options.activeClass);
        if (activeSlide.length) {
          this.currentStep = this.slides.index(activeSlide);
        }
      }
      // calculate offsets
      this.calculateOffsets();
      // create gallery pagination
      if (typeof this.options.generatePagination === 'string') {
        this.pagerLinks = $();
        this.buildPagination();
      } else {
        this.pagerLinks = this.gallery.find(this.options.pagerLinks);
        this.attachPaginationEvents();
      }
      // autorotation control buttons
      this.btnPlay = this.gallery.find(this.options.btnPlay);
      this.btnPause = this.gallery.find(this.options.btnPause);
      this.btnPlayPause = this.gallery.find(this.options.btnPlayPause);
      // misc elements
      this.curNum = this.gallery.find(this.options.currentNumber);
      this.allNum = this.gallery.find(this.options.totalNumber);
      this.isInit = true;
    },
    attachEvents: function () {
      // bind handlers scope
      var self = this;
      this.bindHandlers(['onWindowResize']);
      $(window).bind('load resize orientationchange', this.onWindowResize);
      // previous and next button handlers
      if (this.btnPrev.length) {
        this.prevSlideHandler = function (e) {
          e.preventDefault();
          self.prevSlide();
        };
        this.btnPrev.bind(this.options.event, this.prevSlideHandler);
      }
      if (this.btnNext.length) {
        this.nextSlideHandler = function (e) {
          e.preventDefault();
          self.nextSlide();
        };
        this.btnNext.bind(this.options.event, this.nextSlideHandler);
      }
      // pause on hover handling
      if (this.options.pauseOnHover && !isTouchDevice) {
        this.hoverHandler = function () {
          if (self.options.autoRotation) {
            self.galleryHover = true;
            self.pauseRotation();
          }
        };
        this.leaveHandler = function () {
          if (self.options.autoRotation) {
            self.galleryHover = false;
            self.resumeRotation();
          }
        };
        this.gallery.bind({
          mouseenter: this.hoverHandler,
          mouseleave: this.leaveHandler
        });
      }
      // autorotation buttons handler
      if (this.btnPlay.length) {
        this.btnPlayHandler = function (e) {
          e.preventDefault();
          self.startRotation();
        };
        this.btnPlay.bind(this.options.event, this.btnPlayHandler);
      }
      if (this.btnPause.length) {
        this.btnPauseHandler = function (e) {
          e.preventDefault();
          self.stopRotation();
        };
        this.btnPause.bind(this.options.event, this.btnPauseHandler);
      }
      if (this.btnPlayPause.length) {
        this.btnPlayPauseHandler = function (e) {
          e.preventDefault();
          if (!self.gallery.hasClass(self.options.autorotationActiveClass)) {
            self.startRotation();
          } else {
            self.stopRotation();
          }
        };
        this.btnPlayPause.bind(this.options.event, this.btnPlayPauseHandler);
      }
      // enable hardware acceleration
      if (isTouchDevice && this.options.useTranslate3D) {
        this.slider.css({
          '-webkit-transform': 'translate3d(0px, 0px, 0px)'
        });
      }
      // swipe event handling
      if (isTouchDevice && this.options.handleTouch && window.Hammer && this.mask.length) {
        this.swipeHandler = new Hammer.Manager(this.mask[0]);
        this.swipeHandler.add(new Hammer.Pan({
          direction: self.options.vertical ? Hammer.DIRECTION_VERTICAL : Hammer.DIRECTION_HORIZONTAL,
          threshold: self.options.swipeThreshold
        }));
        this.swipeHandler.on('panstart', function () {
          if (self.galleryAnimating) {
            self.swipeHandler.stop();
          } else {
            self.pauseRotation();
            self.originalOffset = parseFloat(self.slider.css(self.animProperty));
          }
        }).on('panmove', function (e) {
          var tmpOffset = self.originalOffset + e[self.options.vertical ? 'deltaY' : 'deltaX'];
          tmpOffset = Math.max(Math.min(0, tmpOffset), self.maxOffset);
          self.slider.css(self.animProperty, tmpOffset);
        }).on('panend', function (e) {
          self.resumeRotation();
          if (e.distance > self.options.swipeThreshold) {
            if (e.offsetDirection === Hammer.DIRECTION_RIGHT || e.offsetDirection === Hammer.DIRECTION_DOWN) {
              self.prevSlide();
            } else {
              self.nextSlide();
            }
          } else {
            self.switchSlide();
          }
        });
      }
    },
    onWindowResize: function () {
      if (!this.isInit) return;
      if (!this.galleryAnimating) {
        this.calculateOffsets();
        this.refreshPosition();
        this.buildPagination();
        this.refreshState();
        this.resizeQueue = false;
      } else {
        this.resizeQueue = true;
      }
    },
    refreshPosition: function () {
      this.currentStep = Math.min(this.currentStep, this.stepsCount - 1);
      this.tmpProps = {};
      this.tmpProps[this.animProperty] = this.getStepOffset();
      this.slider.stop().css(this.tmpProps);
    },
    calculateOffsets: function () {
      var self = this,
        tmpOffset, tmpStep;
      if (this.options.stretchSlideToMask) {
        var tmpObj = {};
        tmpObj[this.innerSizeFunction] = this.mask[this.innerSizeFunction]();
        this.slides.css(tmpObj);
      }
      this.maskSize = this.mask[this.innerSizeFunction]();
      this.sumSize = this.getSumSize();
      this.maxOffset = this.maskSize - this.sumSize;
      // vertical gallery with single size step custom behavior
      if (this.options.vertical && this.options.maskAutoSize) {
        this.options.step = 1;
        this.stepsCount = this.slides.length;
        this.stepOffsets = [0];
        tmpOffset = 0;
        for (var i = 0; i < this.slides.length; i++) {
          tmpOffset -= $(this.slides[i])[this.fullSizeFunction](true);
          this.stepOffsets.push(tmpOffset);
        }
        this.maxOffset = tmpOffset;
        return;
      }
      // scroll by slide size
      if (typeof this.options.step === 'number' && this.options.step > 0) {
        this.slideDimensions = [];
        this.slides.each($.proxy(function (ind, obj) {
          self.slideDimensions.push($(obj)[self.fullSizeFunction](true));
        }, this));
        // calculate steps count
        this.stepOffsets = [0];
        this.stepsCount = 1;
        tmpOffset = tmpStep = 0;
        while (tmpOffset > this.maxOffset) {
          tmpOffset -= this.getSlideSize(tmpStep, tmpStep + this.options.step);
          tmpStep += this.options.step;
          this.stepOffsets.push(Math.max(tmpOffset, this.maxOffset));
          this.stepsCount++;
        }
      }
      // scroll by mask size
      else {
        // define step size
        this.stepSize = this.maskSize;
        // calculate steps count
        this.stepsCount = 1;
        tmpOffset = 0;
        while (tmpOffset > this.maxOffset) {
          tmpOffset -= this.stepSize;
          this.stepsCount++;
        }
      }
    },
    getSumSize: function () {
      var sum = 0;
      this.slides.each($.proxy(function (ind, obj) {
        sum += $(obj)[this.fullSizeFunction](true);
      }, this));
      this.slider.css(this.innerSizeFunction, sum);
      return sum;
    },
    getStepOffset: function (step) {
      step = step || this.currentStep;
      if (typeof this.options.step === 'number') {
        return this.stepOffsets[this.currentStep];
      } else {
        return Math.min(0, Math.max(-this.currentStep * this.stepSize, this.maxOffset));
      }
    },
    getSlideSize: function (i1, i2) {
      var sum = 0;
      for (var i = i1; i < Math.min(i2, this.slideDimensions.length); i++) {
        sum += this.slideDimensions[i];
      }
      return sum;
    },
    buildPagination: function () {
      if (typeof this.options.generatePagination === 'string') {
        if (!this.pagerHolder) {
          this.pagerHolder = this.gallery.find(this.options.generatePagination);
        }
        if (this.pagerHolder.length && this.oldStepsCount != this.stepsCount) {
          this.oldStepsCount = this.stepsCount;
          this.pagerHolder.empty();
          this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
          for (var i = 0; i < this.stepsCount; i++) {
            $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i + 1);
          }
          this.pagerLinks = this.pagerList.children();
          this.attachPaginationEvents();
        }
      }
    },
    attachPaginationEvents: function () {
      var self = this;
      this.pagerLinksHandler = function (e) {
        e.preventDefault();
        self.numSlide(self.pagerLinks.index(e.currentTarget));
      };
      this.pagerLinks.bind(this.options.event, this.pagerLinksHandler);
    },
    prevSlide: function () {
      if (!(this.options.disableWhileAnimating && this.galleryAnimating)) {
        if (this.currentStep > 0) {
          this.currentStep--;
          this.switchSlide();
        } else if (this.options.circularRotation) {
          this.currentStep = this.stepsCount - 1;
          this.switchSlide();
        }
      }
    },
    nextSlide: function (fromAutoRotation) {
      if (!(this.options.disableWhileAnimating && this.galleryAnimating)) {
        if (this.currentStep < this.stepsCount - 1) {
          this.currentStep++;
          this.switchSlide();
        } else if (this.options.circularRotation || fromAutoRotation === true) {
          this.currentStep = 0;
          this.switchSlide();
        }
      }
    },
    numSlide: function (c) {
      if (this.currentStep != c) {
        this.currentStep = c;
        this.switchSlide();
      }
    },
    switchSlide: function () {
      var self = this;
      this.galleryAnimating = true;
      this.tmpProps = {};
      this.tmpProps[this.animProperty] = this.getStepOffset();
      this.slider.stop().animate(this.tmpProps, {
        duration: this.options.animSpeed,
        complete: function () {
          // animation complete
          self.galleryAnimating = false;
          if (self.resizeQueue) {
            self.onWindowResize();
          }
          // onchange callback
          self.makeCallback('onChange', self);
          self.autoRotate();
        }
      });
      this.refreshState();
      // onchange callback
      this.makeCallback('onBeforeChange', this);
    },
    refreshState: function (initial) {
      if (this.options.step === 1 || this.stepsCount === this.slides.length) {
        this.slides.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
      }
      this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
      this.curNum.html(this.currentStep + 1);
      this.allNum.html(this.stepsCount);
      // initial refresh
      if (this.options.maskAutoSize && typeof this.options.step === 'number') {
        this.tmpProps = {};
        this.tmpProps[this.maskSizeProperty] = this.slides.eq(Math.min(this.currentStep, this.slides.length - 1))[this.slideSizeFunction](true);
        this.mask.stop()[initial ? 'css' : 'animate'](this.tmpProps);
      }
      // disabled state
      if (!this.options.circularRotation) {
        this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
        if (this.currentStep === 0) this.btnPrev.addClass(this.options.disabledClass);
        if (this.currentStep === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
      }
      // add class if not enough slides
      this.gallery.toggleClass('not-enough-slides', this.sumSize <= this.maskSize);
    },
    startRotation: function () {
      this.options.autoRotation = true;
      this.galleryHover = false;
      this.autoRotationStopped = false;
      this.resumeRotation();
    },
    stopRotation: function () {
      this.galleryHover = true;
      this.autoRotationStopped = true;
      this.pauseRotation();
    },
    pauseRotation: function () {
      this.gallery.addClass(this.options.autorotationDisabledClass);
      this.gallery.removeClass(this.options.autorotationActiveClass);
      clearTimeout(this.timer);
    },
    resumeRotation: function () {
      if (!this.autoRotationStopped) {
        this.gallery.addClass(this.options.autorotationActiveClass);
        this.gallery.removeClass(this.options.autorotationDisabledClass);
        this.autoRotate();
      }
    },
    autoRotate: function () {
      var self = this;
      clearTimeout(this.timer);
      if (this.options.autoRotation && !this.galleryHover && !this.autoRotationStopped) {
        this.timer = setTimeout(function () {
          self.nextSlide(true);
        }, this.options.switchTime);
      } else {
        this.pauseRotation();
      }
    },
    bindHandlers: function (handlersList) {
      var self = this;
      $.each(handlersList, function (index, handler) {
        var origHandler = self[handler];
        self[handler] = function () {
          return origHandler.apply(self, arguments);
        };
      });
    },
    makeCallback: function (name) {
      if (typeof this.options[name] === 'function') {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        this.options[name].apply(this, args);
      }
    },
    destroy: function () {
      // destroy handler
      this.isInit = false;
      $(window).unbind('load resize orientationchange', this.onWindowResize);
      this.btnPrev.unbind(this.options.event, this.prevSlideHandler);
      this.btnNext.unbind(this.options.event, this.nextSlideHandler);
      this.pagerLinks.unbind(this.options.event, this.pagerLinksHandler);
      this.gallery.unbind('mouseenter', this.hoverHandler);
      this.gallery.unbind('mouseleave', this.leaveHandler);
      // autorotation buttons handlers
      this.stopRotation();
      this.btnPlay.unbind(this.options.event, this.btnPlayHandler);
      this.btnPause.unbind(this.options.event, this.btnPauseHandler);
      this.btnPlayPause.unbind(this.options.event, this.btnPlayPauseHandler);
      // destroy swipe handler
      if (this.swipeHandler) {
        this.swipeHandler.destroy();
      }
      // remove inline styles, classes and pagination
      var unneededClasses = [this.options.galleryReadyClass, this.options.autorotationActiveClass, this.options.autorotationDisabledClass];
      this.gallery.removeClass(unneededClasses.join(' ')).removeData('ScrollGallery');
      this.slider.add(this.slides).add(this.mask).removeAttr('style');
      this.slides.removeClass(this.options.activeClass);
      if (typeof this.options.generatePagination === 'string') {
        this.pagerHolder.empty();
      }
    }
  };
  // jquery plugin
  $.fn.scrollGallery = function (opt) {
    var args = Array.prototype.slice.call(arguments);
    var method = args[0];
    return this.each(function () {
      var $holder = jQuery(this);
      var instance = $holder.data('ScrollGallery');
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        $holder.data('ScrollGallery', new ScrollGallery($.extend({
          holder: this
        }, opt)));
      } else if (typeof method === 'string' && instance) {
        if (typeof instance[method] === 'function') {
          args.shift();
          instance[method].apply(instance, args);
        }
      }
    });
  };
}(jQuery));
/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    root.jcf = factory(jQuery);
  }
}(this, function ($) {
  'use strict';
  // define version
  var version = '1.1.3';
  // private variables
  var customInstances = [];
  // default global options
  var commonOptions = {
    optionsKey: 'jcf',
    dataKey: 'jcf-instance',
    rtlClass: 'jcf-rtl',
    focusClass: 'jcf-focus',
    pressedClass: 'jcf-pressed',
    disabledClass: 'jcf-disabled',
    hiddenClass: 'jcf-hidden',
    resetAppearanceClass: 'jcf-reset-appearance',
    unselectableClass: 'jcf-unselectable'
  };
  // detect device type
  var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
    isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
  commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);
  var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
  if (isIOS) isIOS = parseFloat(isIOS[2].replace(/_/g, '.'));
  commonOptions.ios = isIOS;
  // create global stylesheet if custom forms are used
  var createStyleSheet = function () {
    var styleTag = $('<style>').appendTo('head'),
      styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');
    // crossbrowser style handling
    var addCSSRule = function (selector, rules, index) {
      if (styleSheet.insertRule) {
        styleSheet.insertRule(selector + '{' + rules + '}', index);
      } else {
        styleSheet.addRule(selector, rules, index);
      }
    };
    // add special rules
    addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
    addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
    addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
    addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');
    // detect rtl pages
    var html = $('html'), body = $('body');
    if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
      html.addClass(commonOptions.rtlClass);
    }
    // handle form reset event
    html.on('reset', function () {
      setTimeout(function () {
        api.refreshAll();
      }, 0);
    });
    // mark stylesheet as created
    commonOptions.styleSheetCreated = true;
  };
  // simplified pointer events handler
  (function () {
    var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
      touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
      eventList, eventMap = {}, eventPrefix = 'jcf-';
    // detect events to attach
    if (pointerEventsSupported) {
      eventList = {
        pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
        pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
        pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
        pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
      };
    } else {
      eventList = {
        pointerover: 'mouseover',
        pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
        pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
        pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
      };
    }
    // create event map
    $.each(eventList, function (targetEventName, fakeEventList) {
      $.each(fakeEventList.split(' '), function (index, fakeEventName) {
        eventMap[fakeEventName] = targetEventName;
      });
    });
    // jQuery event hooks
    $.each(eventList, function (eventName, eventHandlers) {
      eventHandlers = eventHandlers.split(' ');
      $.event.special[eventPrefix + eventName] = {
        setup: function () {
          var self = this;
          $.each(eventHandlers, function (index, fallbackEvent) {
            if (self.addEventListener) {
              self.addEventListener(fallbackEvent, fixEvent, commonOptions.isMobileDevice ? { passive: false } : false);
            } else {
              self['on' + fallbackEvent] = fixEvent;
            }
          });
        },
        teardown: function () {
          var self = this;
          $.each(eventHandlers, function (index, fallbackEvent) {
            if (self.addEventListener) {
              self.removeEventListener(fallbackEvent, fixEvent, commonOptions.isMobileDevice ? { passive: false } : false);
            } else {
              self['on' + fallbackEvent] = null;
            }
          });
        }
      };
    });
    // check that mouse event are not simulated by mobile browsers
    var lastTouch = null;
    var mouseEventSimulated = function (e) {
      var dx = Math.abs(e.pageX - lastTouch.x),
        dy = Math.abs(e.pageY - lastTouch.y),
        rangeDistance = 25;
      if (dx <= rangeDistance && dy <= rangeDistance) {
        return true;
      }
    };
    // normalize event
    var fixEvent = function (e) {
      var origEvent = e || window.event,
        touchEventData = null,
        targetEventName = eventMap[origEvent.type];
      e = $.event.fix(origEvent);
      e.type = eventPrefix + targetEventName;
      if (origEvent.pointerType) {
        switch (origEvent.pointerType) {
          case 2:
            e.pointerType = 'touch';
            break;
          case 3:
            e.pointerType = 'pen';
            break;
          case 4:
            e.pointerType = 'mouse';
            break;
          default:
            e.pointerType = origEvent.pointerType;
        }
      } else {
        e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
      }
      if (!e.pageX && !e.pageY) {
        touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
        e.pageX = touchEventData.pageX;
        e.pageY = touchEventData.pageY;
      }
      if (origEvent.type === 'touchend') {
        lastTouch = { x: e.pageX, y: e.pageY };
      }
      if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
        return;
      } else {
        return ($.event.dispatch || $.event.handle).call(this, e);
      }
    };
  }());
  // custom mousewheel/trackpad handler
  (function () {
    var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
      shimEventName = 'jcf-mousewheel';
    $.event.special[shimEventName] = {
      setup: function () {
        var self = this;
        $.each(wheelEvents, function (index, fallbackEvent) {
          if (self.addEventListener) {
            self.addEventListener(fallbackEvent, fixEvent, false);
          } else {
            self['on' + fallbackEvent] = fixEvent;
          }
        });
      },
      teardown: function () {
        var self = this;
        $.each(wheelEvents, function (index, fallbackEvent) {
          if (self.addEventListener) {
            self.removeEventListener(fallbackEvent, fixEvent, false);
          } else {
            self['on' + fallbackEvent] = null;
          }
        });
      }
    };
    var fixEvent = function (e) {
      var origEvent = e || window.event;
      e = $.event.fix(origEvent);
      e.type = shimEventName;
      // old wheel events handler
      if ('detail' in origEvent) {
        e.deltaY = -origEvent.detail;
      }
      if ('wheelDelta' in origEvent) {
        e.deltaY = -origEvent.wheelDelta;
      }
      if ('wheelDeltaY' in origEvent) {
        e.deltaY = -origEvent.wheelDeltaY;
      }
      if ('wheelDeltaX' in origEvent) {
        e.deltaX = -origEvent.wheelDeltaX;
      }
      // modern wheel event handler
      if ('deltaY' in origEvent) {
        e.deltaY = origEvent.deltaY;
      }
      if ('deltaX' in origEvent) {
        e.deltaX = origEvent.deltaX;
      }
      // handle deltaMode for mouse wheel
      e.delta = e.deltaY || e.deltaX;
      if (origEvent.deltaMode === 1) {
        var lineHeight = 16;
        e.delta *= lineHeight;
        e.deltaY *= lineHeight;
        e.deltaX *= lineHeight;
      }
      return ($.event.dispatch || $.event.handle).call(this, e);
    };
  }());
  // extra module methods
  var moduleMixin = {
    // provide function for firing native events
    fireNativeEvent: function (elements, eventName) {
      $(elements).each(function () {
        var element = this, eventObject;
        if (element.dispatchEvent) {
          eventObject = document.createEvent('HTMLEvents');
          eventObject.initEvent(eventName, true, true);
          element.dispatchEvent(eventObject);
        } else if (document.createEventObject) {
          eventObject = document.createEventObject();
          eventObject.target = element;
          element.fireEvent('on' + eventName, eventObject);
        }
      });
    },
    // bind event handlers for module instance (functions beggining with "on")
    bindHandlers: function () {
      var self = this;
      $.each(self, function (propName, propValue) {
        if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
          // dont use $.proxy here because it doesn't create unique handler
          self[propName] = function () {
            return propValue.apply(self, arguments);
          };
        }
      });
    }
  };
  // public API
  var api = {
    version: version,
    modules: {},
    getOptions: function () {
      return $.extend({}, commonOptions);
    },
    setOptions: function (moduleName, moduleOptions) {
      if (arguments.length > 1) {
        // set module options
        if (this.modules[moduleName]) {
          $.extend(this.modules[moduleName].prototype.options, moduleOptions);
        }
      } else {
        // set common options
        $.extend(commonOptions, moduleName);
      }
    },
    addModule: function (proto) {
      // add module to list
      var Module = function (options) {
        // save instance to collection
        if (!options.element.data(commonOptions.dataKey)) {
          options.element.data(commonOptions.dataKey, this);
        }
        customInstances.push(this);
        // save options
        this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);
        // bind event handlers to instance
        this.bindHandlers();
        // call constructor
        this.init.apply(this, arguments);
      };
      // parse options from HTML attribute
      var getInlineOptions = function (element) {
        var dataOptions = element.data(commonOptions.optionsKey),
          attrOptions = element.attr(commonOptions.optionsKey);
        if (dataOptions) {
          return dataOptions;
        } else if (attrOptions) {
          try {
            return $.parseJSON(attrOptions);
          } catch (e) {
            // ignore invalid attributes
          }
        }
      };
      // set proto as prototype for new module
      Module.prototype = proto;
      // add mixin methods to module proto
      $.extend(proto, moduleMixin);
      if (proto.plugins) {
        $.each(proto.plugins, function (pluginName, plugin) {
          $.extend(plugin.prototype, moduleMixin);
        });
      }
      // override destroy method
      var originalDestroy = Module.prototype.destroy;
      Module.prototype.destroy = function () {
        this.options.element.removeData(this.options.dataKey);
        for (var i = customInstances.length - 1; i >= 0; i--) {
          if (customInstances[i] === this) {
            customInstances.splice(i, 1);
            break;
          }
        }
        if (originalDestroy) {
          originalDestroy.apply(this, arguments);
        }
      };
      // save module to list
      this.modules[proto.name] = Module;
    },
    getInstance: function (element) {
      return $(element).data(commonOptions.dataKey);
    },
    replace: function (elements, moduleName, customOptions) {
      var self = this,
        instance;
      if (!commonOptions.styleSheetCreated) {
        createStyleSheet();
      }
      $(elements).each(function () {
        var moduleOptions,
          element = $(this);
        instance = element.data(commonOptions.dataKey);
        if (instance) {
          instance.refresh();
        } else {
          if (!moduleName) {
            $.each(self.modules, function (currentModuleName, module) {
              if (module.prototype.matchElement.call(module.prototype, element)) {
                moduleName = currentModuleName;
                return false;
              }
            });
          }
          if (moduleName) {
            moduleOptions = $.extend({ element: element }, customOptions);
            instance = new self.modules[moduleName](moduleOptions);
          }
        }
      });
      return instance;
    },
    refresh: function (elements) {
      $(elements).each(function () {
        var instance = $(this).data(commonOptions.dataKey);
        if (instance) {
          instance.refresh();
        }
      });
    },
    destroy: function (elements) {
      $(elements).each(function () {
        var instance = $(this).data(commonOptions.dataKey);
        if (instance) {
          instance.destroy();
        }
      });
    },
    replaceAll: function (context) {
      var self = this;
      $.each(this.modules, function (moduleName, module) {
        $(module.prototype.selector, context).each(function () {
          if (this.className.indexOf('jcf-ignore') < 0) {
            self.replace(this, moduleName);
          }
        });
      });
    },
    refreshAll: function (context) {
      if (context) {
        $.each(this.modules, function (moduleName, module) {
          $(module.prototype.selector, context).each(function () {
            var instance = $(this).data(commonOptions.dataKey);
            if (instance) {
              instance.refresh();
            }
          });
        });
      } else {
        for (var i = customInstances.length - 1; i >= 0; i--) {
          customInstances[i].refresh();
        }
      }
    },
    destroyAll: function (context) {
      if (context) {
        $.each(this.modules, function (moduleName, module) {
          $(module.prototype.selector, context).each(function (index, element) {
            var instance = $(element).data(commonOptions.dataKey);
            if (instance) {
              instance.destroy();
            }
          });
        });
      } else {
        while (customInstances.length) {
          customInstances[0].destroy();
        }
      }
    }
  };
  // always export API to the global window object
  window.jcf = api;
  return api;
}));
/*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function ($, window) {
  'use strict';
  jcf.addModule({
    name: 'Select',
    selector: 'select',
    options: {
      element: null,
      multipleCompactStyle: false
    },
    plugins: {
      ListBox: ListBox,
      ComboBox: ComboBox,
      SelectList: SelectList
    },
    matchElement: function (element) {
      return element.is('select');
    },
    init: function () {
      this.element = $(this.options.element);
      this.createInstance();
    },
    isListBox: function () {
      return this.element.is('[size]:not([jcf-size]), [multiple]');
    },
    createInstance: function () {
      if (this.instance) {
        this.instance.destroy();
      }
      if (this.isListBox() && !this.options.multipleCompactStyle) {
        this.instance = new ListBox(this.options);
      } else {
        this.instance = new ComboBox(this.options);
      }
    },
    refresh: function () {
      var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
        (!this.isListBox() && this.instance instanceof ListBox);
      if (typeMismatch) {
        this.createInstance();
      } else {
        this.instance.refresh();
      }
    },
    destroy: function () {
      this.instance.destroy();
    }
  });

  // combobox module
  function ComboBox(options) {
    this.options = $.extend({
      wrapNative: true,
      wrapNativeOnMobile: true,
      fakeDropInBody: true,
      useCustomScroll: true,
      flipDropToFit: true,
      maxVisibleItems: 10,
      fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
      fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
      optionClassPrefix: 'jcf-option-',
      selectClassPrefix: 'jcf-select-',
      dropContentSelector: '.jcf-select-drop-content',
      selectTextSelector: '.jcf-select-text',
      dropActiveClass: 'jcf-drop-active',
      flipDropClass: 'jcf-drop-flipped'
    }, options);
    this.init();
  }

  $.extend(ComboBox.prototype, {
    init: function () {
      this.initStructure();
      this.bindHandlers();
      this.attachEvents();
      this.refresh();
    },
    initStructure: function () {
      // prepare structure
      this.win = $(window);
      this.doc = $(document);
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
      this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
      this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
      makeUnselectable(this.fakeElement);
      // copy classes from original select
      this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
      // handle compact multiple style
      if (this.realElement.prop('multiple')) {
        this.fakeElement.addClass('jcf-compact-multiple');
      }
      // detect device type and dropdown behavior
      if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
        this.options.wrapNative = true;
      }
      if (this.options.wrapNative) {
        // wrap native select inside fake block
        this.realElement.prependTo(this.fakeElement).css({
          position: 'absolute',
          height: '100%',
          width: '100%'
        }).addClass(this.options.resetAppearanceClass);
      } else {
        // just hide native select
        this.realElement.addClass(this.options.hiddenClass);
        this.fakeElement.attr('title', this.realElement.attr('title'));
        this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
      }
    },
    attachEvents: function () {
      // delayed refresh handler
      var self = this;
      this.delayedRefresh = function () {
        setTimeout(function () {
          self.refresh();
          if (self.list) {
            self.list.refresh();
            self.list.scrollToActiveOption();
          }
        }, 1);
      };
      // native dropdown event handlers
      if (this.options.wrapNative) {
        this.realElement.on({
          focus: this.onFocus,
          change: this.onChange,
          click: this.onChange,
          keydown: this.onChange
        });
      } else {
        // custom dropdown event handlers
        this.realElement.on({
          focus: this.onFocus,
          change: this.onChange,
          keydown: this.onKeyDown
        });
        this.fakeElement.on({
          'jcf-pointerdown': this.onSelectAreaPress
        });
      }
    },
    onKeyDown: function (e) {
      if (e.which === 13) {
        this.toggleDropdown();
      } else if (this.dropActive) {
        this.delayedRefresh();
      }
    },
    onChange: function () {
      this.refresh();
    },
    onFocus: function () {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on('blur', this.onBlur);
        this.toggleListMode(true);
        this.focusedFlag = true;
      }
    },
    onBlur: function () {
      if (!this.pressedFlag) {
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off('blur', this.onBlur);
        this.toggleListMode(false);
        this.focusedFlag = false;
      }
    },
    onResize: function () {
      if (this.dropActive) {
        this.hideDropdown();
      }
    },
    onSelectDropPress: function () {
      this.pressedFlag = true;
    },
    onSelectDropRelease: function (e, pointerEvent) {
      this.pressedFlag = false;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onSelectAreaPress: function (e) {
      // skip click if drop inside fake element or real select is disabled
      var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
      if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
        return;
      }
      // toggle dropdown visibility
      this.selectOpenedByEvent = e.pointerType;
      this.toggleDropdown();
      // misc handlers
      if (!this.focusedFlag) {
        if (e.pointerType === 'mouse') {
          this.realElement.focus();
        } else {
          this.onFocus(e);
        }
      }
      this.pressedFlag = true;
      this.fakeElement.addClass(this.options.pressedClass);
      this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
    },
    onSelectAreaRelease: function (e) {
      if (this.focusedFlag && e.pointerType === 'mouse') {
        this.realElement.focus();
      }
      this.pressedFlag = false;
      this.fakeElement.removeClass(this.options.pressedClass);
      this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
    },
    onOutsideClick: function (e) {
      var target = $(e.target),
        clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;
      if (!clickedInsideSelect) {
        this.hideDropdown();
      }
    },
    onSelect: function () {
      this.refresh();
      if (this.realElement.prop('multiple')) {
        this.repositionDropdown();
      } else {
        this.hideDropdown();
      }
      this.fireNativeEvent(this.realElement, 'change');
    },
    toggleListMode: function (state) {
      if (!this.options.wrapNative) {
        if (state) {
          // temporary change select to list to avoid appearing of native dropdown
          this.realElement.attr({
            size: 4,
            'jcf-size': ''
          });
        } else {
          // restore select from list mode to dropdown select
          if (!this.options.wrapNative) {
            this.realElement.removeAttr('size jcf-size');
          }
        }
      }
    },
    createDropdown: function () {
      // destroy previous dropdown if needed
      if (this.dropdown) {
        this.list.destroy();
        this.dropdown.remove();
      }
      // create new drop container
      this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
      this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
      makeUnselectable(this.dropdown);
      // handle compact multiple style
      if (this.realElement.prop('multiple')) {
        this.dropdown.addClass('jcf-compact-multiple');
      }
      // set initial styles for dropdown in body
      if (this.options.fakeDropInBody) {
        this.dropdown.css({
          position: 'absolute',
          top: -9999
        });
      }
      // create new select list instance
      this.list = new SelectList({
        useHoverClass: true,
        handleResize: false,
        alwaysPreventMouseWheel: true,
        maxVisibleItems: this.options.maxVisibleItems,
        useCustomScroll: this.options.useCustomScroll,
        holder: this.dropdown.find(this.options.dropContentSelector),
        multipleSelectWithoutKey: this.realElement.prop('multiple'),
        element: this.realElement
      });
      $(this.list).on({
        select: this.onSelect,
        press: this.onSelectDropPress,
        release: this.onSelectDropRelease
      });
    },
    repositionDropdown: function () {
      var selectOffset = this.fakeElement.offset(),
        selectWidth = this.fakeElement.outerWidth(),
        selectHeight = this.fakeElement.outerHeight(),
        dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
        winScrollTop = this.win.scrollTop(),
        winHeight = this.win.height(),
        calcTop, calcLeft, bodyOffset, needFlipDrop = false;
      // check flip drop position
      if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
        needFlipDrop = true;
      }
      if (this.options.fakeDropInBody) {
        bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
        if (this.options.flipDropToFit && needFlipDrop) {
          // calculate flipped dropdown position
          calcLeft = selectOffset.left;
          calcTop = selectOffset.top - dropHeight - bodyOffset;
        } else {
          // calculate default drop position
          calcLeft = selectOffset.left;
          calcTop = selectOffset.top + selectHeight - bodyOffset;
        }
        // update drop styles
        this.dropdown.css({
          width: selectWidth,
          left: calcLeft,
          top: calcTop
        });
      }
      // refresh flipped class
      this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
    },
    showDropdown: function () {
      // do not show empty custom dropdown
      if (!this.realElement.prop('options').length) {
        return;
      }
      // create options list if not created
      if (!this.dropdown) {
        this.createDropdown();
      }
      // show dropdown
      this.dropActive = true;
      this.dropdown.appendTo(this.fakeDropTarget);
      this.fakeElement.addClass(this.options.dropActiveClass);
      this.refreshSelectedText();
      this.repositionDropdown();
      this.list.setScrollTop(this.savedScrollTop);
      this.list.refresh();
      // add temporary event handlers
      this.win.on('resize', this.onResize);
      this.doc.on('jcf-pointerdown', this.onOutsideClick);
    },
    hideDropdown: function () {
      if (this.dropdown) {
        this.savedScrollTop = this.list.getScrollTop();
        this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
        this.dropdown.removeClass(this.options.flipDropClass).detach();
        this.doc.off('jcf-pointerdown', this.onOutsideClick);
        this.win.off('resize', this.onResize);
        this.dropActive = false;
        if (this.selectOpenedByEvent === 'touch') {
          this.onBlur();
        }
      }
    },
    toggleDropdown: function () {
      if (this.dropActive) {
        this.hideDropdown();
      } else {
        this.showDropdown();
      }
    },
    refreshSelectedText: function () {
      // redraw selected area
      var selectedIndex = this.realElement.prop('selectedIndex'),
        selectedOption = this.realElement.prop('options')[selectedIndex],
        selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
        selectedOptionText = '',
        selectedOptionClasses,
        self = this;
      if (this.realElement.prop('multiple')) {
        $.each(this.realElement.prop('options'), function (index, option) {
          if (option.selected) {
            selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML;
          }
        });
        if (!selectedOptionText) {
          selectedOptionText = self.realElement.attr('placeholder') || '';
        }
        this.selectText.removeAttr('class').html(selectedOptionText);
      } else if (!selectedOption) {
        if (this.selectImage) {
          this.selectImage.hide();
        }
        this.selectText.removeAttr('class').empty();
      } else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
        selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
        this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);
        if (selectedOptionImage) {
          if (!this.selectImage) {
            this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
          }
          this.selectImage.attr('src', selectedOptionImage).show();
        } else if (this.selectImage) {
          this.selectImage.hide();
        }
        this.currentSelectedText = selectedOption.innerHTML;
        this.currentSelectedImage = selectedOptionImage;
      }
    },
    refresh: function () {
      // refresh fake select visibility
      if (this.realElement.prop('style').display === 'none') {
        this.fakeElement.hide();
      } else {
        this.fakeElement.show();
      }
      // refresh selected text
      this.refreshSelectedText();
      // handle disabled state
      this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
    },
    destroy: function () {
      // restore structure
      if (this.options.wrapNative) {
        this.realElement.insertBefore(this.fakeElement).css({
          position: '',
          height: '',
          width: ''
        }).removeClass(this.options.resetAppearanceClass);
      } else {
        this.realElement.removeClass(this.options.hiddenClass);
        if (this.realElement.is('[jcf-size]')) {
          this.realElement.removeAttr('size jcf-size');
        }
      }
      // removing element will also remove its event handlers
      this.fakeElement.remove();
      // remove other event handlers
      this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
      this.realElement.off({
        focus: this.onFocus
      });
    }
  });

  // listbox module
  function ListBox(options) {
    this.options = $.extend({
      wrapNative: true,
      useCustomScroll: true,
      fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
      selectClassPrefix: 'jcf-select-',
      listHolder: '.jcf-list-wrapper'
    }, options);
    this.init();
  }

  $.extend(ListBox.prototype, {
    init: function () {
      this.bindHandlers();
      this.initStructure();
      this.attachEvents();
    },
    initStructure: function () {
      this.realElement = $(this.options.element);
      this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
      this.listHolder = this.fakeElement.find(this.options.listHolder);
      makeUnselectable(this.fakeElement);
      // copy classes from original select
      this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
      this.realElement.addClass(this.options.hiddenClass);
      this.list = new SelectList({
        useCustomScroll: this.options.useCustomScroll,
        holder: this.listHolder,
        selectOnClick: false,
        element: this.realElement
      });
    },
    attachEvents: function () {
      // delayed refresh handler
      var self = this;
      this.delayedRefresh = function (e) {
        if (e && e.which === 16) {
          // ignore SHIFT key
          return;
        } else {
          clearTimeout(self.refreshTimer);
          self.refreshTimer = setTimeout(function () {
            self.refresh();
            self.list.scrollToActiveOption();
          }, 1);
        }
      };
      // other event handlers
      this.realElement.on({
        focus: this.onFocus,
        click: this.delayedRefresh,
        keydown: this.delayedRefresh
      });
      // select list event handlers
      $(this.list).on({
        select: this.onSelect,
        press: this.onFakeOptionsPress,
        release: this.onFakeOptionsRelease
      });
    },
    onFakeOptionsPress: function (e, pointerEvent) {
      this.pressedFlag = true;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onFakeOptionsRelease: function (e, pointerEvent) {
      this.pressedFlag = false;
      if (pointerEvent.pointerType === 'mouse') {
        this.realElement.focus();
      }
    },
    onSelect: function () {
      this.fireNativeEvent(this.realElement, 'change');
      this.fireNativeEvent(this.realElement, 'click');
    },
    onFocus: function () {
      if (!this.pressedFlag || !this.focusedFlag) {
        this.fakeElement.addClass(this.options.focusClass);
        this.realElement.on('blur', this.onBlur);
        this.focusedFlag = true;
      }
    },
    onBlur: function () {
      if (!this.pressedFlag) {
        this.fakeElement.removeClass(this.options.focusClass);
        this.realElement.off('blur', this.onBlur);
        this.focusedFlag = false;
      }
    },
    refresh: function () {
      this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
      this.list.refresh();
    },
    destroy: function () {
      this.list.destroy();
      this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
      this.fakeElement.remove();
    }
  });

  // options list module
  function SelectList(options) {
    this.options = $.extend({
      holder: null,
      maxVisibleItems: 10,
      selectOnClick: true,
      useHoverClass: false,
      useCustomScroll: false,
      handleResize: true,
      multipleSelectWithoutKey: false,
      alwaysPreventMouseWheel: false,
      indexAttribute: 'data-index',
      cloneClassPrefix: 'jcf-option-',
      containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
      containerSelector: '.jcf-list-content',
      captionClass: 'jcf-optgroup-caption',
      disabledClass: 'jcf-disabled',
      optionClass: 'jcf-option',
      groupClass: 'jcf-optgroup',
      hoverClass: 'jcf-hover',
      selectedClass: 'jcf-selected',
      scrollClass: 'jcf-scroll-active'
    }, options);
    this.init();
  }

  $.extend(SelectList.prototype, {
    init: function () {
      this.initStructure();
      this.refreshSelectedClass();
      this.attachEvents();
    },
    initStructure: function () {
      this.element = $(this.options.element);
      this.indexSelector = '[' + this.options.indexAttribute + ']';
      this.container = $(this.options.containerStructure).appendTo(this.options.holder);
      this.listHolder = this.container.find(this.options.containerSelector);
      this.lastClickedIndex = this.element.prop('selectedIndex');
      this.rebuildList();
    },
    attachEvents: function () {
      this.bindHandlers();
      this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
      this.listHolder.on('jcf-pointerdown', this.onPress);
      if (this.options.useHoverClass) {
        this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
      }
    },
    onPress: function (e) {
      $(this).trigger('press', e);
      this.listHolder.on('jcf-pointerup', this.onRelease);
    },
    onRelease: function (e) {
      $(this).trigger('release', e);
      this.listHolder.off('jcf-pointerup', this.onRelease);
    },
    onHoverItem: function (e) {
      var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
      this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
    },
    onItemPress: function (e) {
      if (e.pointerType === 'touch' || this.options.selectOnClick) {
        // select option after "click"
        this.tmpListOffsetTop = this.list.offset().top;
        this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
      } else {
        // select option immediately
        this.onSelectItem(e);
      }
    },
    onItemRelease: function (e) {
      // remove event handlers and temporary data
      this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);
      // simulate item selection
      if (this.tmpListOffsetTop === this.list.offset().top) {
        this.listHolder.on('click', this.indexSelector, { savedPointerType: e.pointerType }, this.onSelectItem);
      }
      delete this.tmpListOffsetTop;
    },
    onSelectItem: function (e) {
      var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
        pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
        range;
      // remove click event handler
      this.listHolder.off('click', this.indexSelector, this.onSelectItem);
      // ignore clicks on disabled options
      if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
        return;
      }
      if (this.element.prop('multiple')) {
        if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey) {
          // if CTRL/CMD pressed or touch devices - toggle selected option
          this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
        } else if (e.shiftKey) {
          // if SHIFT pressed - update selection
          range = [this.lastClickedIndex, clickedIndex].sort(function (a, b) {
            return a - b;
          });
          this.realOptions.each(function (index, option) {
            option.selected = (index >= range[0] && index <= range[1]);
          });
        } else {
          // set single selected index
          this.element.prop('selectedIndex', clickedIndex);
        }
      } else {
        this.element.prop('selectedIndex', clickedIndex);
      }
      // save last clicked option
      if (!e.shiftKey) {
        this.lastClickedIndex = clickedIndex;
      }
      // refresh classes
      this.refreshSelectedClass();
      // scroll to active item in desktop browsers
      if (pointerType === 'mouse') {
        this.scrollToActiveOption();
      }
      // make callback when item selected
      $(this).trigger('select');
    },
    rebuildList: function () {
      // rebuild options
      var self = this,
        rootElement = this.element[0];
      // recursively create fake options
      this.storedSelectHTML = rootElement.innerHTML;
      this.optionIndex = 0;
      this.list = $(this.createOptionsList(rootElement));
      this.listHolder.empty().append(this.list);
      this.realOptions = this.element.find('option');
      this.fakeOptions = this.list.find(this.indexSelector);
      this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
      delete this.optionIndex;
      // detect max visible items
      var maxCount = this.options.maxVisibleItems,
        sizeValue = this.element.prop('size');
      if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
        maxCount = sizeValue;
      }
      // handle scrollbar
      var needScrollBar = this.fakeOptions.length > maxCount;
      this.container.toggleClass(this.options.scrollClass, needScrollBar);
      if (needScrollBar) {
        // change max-height
        this.listHolder.css({
          maxHeight: this.getOverflowHeight(maxCount),
          overflow: 'auto'
        });
        if (this.options.useCustomScroll && jcf.modules.Scrollable) {
          // add custom scrollbar if specified in options
          jcf.replace(this.listHolder, 'Scrollable', {
            handleResize: this.options.handleResize,
            alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
          });
          return;
        }
      }
      // disable edge wheel scrolling
      if (this.options.alwaysPreventMouseWheel) {
        this.preventWheelHandler = function (e) {
          var currentScrollTop = self.listHolder.scrollTop(),
            maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();
          // check edge cases
          if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
            e.preventDefault();
          }
        };
        this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
      }
    },
    refreshSelectedClass: function () {
      var self = this,
        selectedItem,
        isMultiple = this.element.prop('multiple'),
        selectedIndex = this.element.prop('selectedIndex');
      if (isMultiple) {
        this.realOptions.each(function (index, option) {
          self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
        });
      } else {
        this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
        selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
        if (this.options.useHoverClass) {
          selectedItem.addClass(this.options.hoverClass);
        }
      }
    },
    scrollToActiveOption: function () {
      // scroll to target option
      var targetOffset = this.getActiveOptionOffset();
      if (typeof targetOffset === 'number') {
        this.listHolder.prop('scrollTop', targetOffset);
      }
    },
    getSelectedIndexRange: function () {
      var firstSelected = -1, lastSelected = -1;
      this.realOptions.each(function (index, option) {
        if (option.selected) {
          if (firstSelected < 0) {
            firstSelected = index;
          }
          lastSelected = index;
        }
      });
      return [firstSelected, lastSelected];
    },
    getChangedSelectedIndex: function () {
      var selectedIndex = this.element.prop('selectedIndex'),
        targetIndex;
      if (this.element.prop('multiple')) {
        // multiple selects handling
        if (!this.previousRange) {
          this.previousRange = [selectedIndex, selectedIndex];
        }
        this.currentRange = this.getSelectedIndexRange();
        targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
        this.previousRange = this.currentRange;
        return targetIndex;
      } else {
        // single choice selects handling
        return selectedIndex;
      }
    },
    getActiveOptionOffset: function () {
      // calc values
      var dropHeight = this.listHolder.height(),
        dropScrollTop = this.listHolder.prop('scrollTop'),
        currentIndex = this.getChangedSelectedIndex(),
        fakeOption = this.fakeOptions.eq(currentIndex),
        fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
        fakeOptionHeight = fakeOption.innerHeight();
      // scroll list
      if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
        // scroll down (always scroll to option)
        return fakeOptionOffset - dropHeight + fakeOptionHeight;
      } else if (fakeOptionOffset < dropScrollTop) {
        // scroll up to option
        return fakeOptionOffset;
      }
    },
    getOverflowHeight: function (sizeValue) {
      var item = this.fakeListItems.eq(sizeValue - 1),
        listOffset = this.list.offset().top,
        itemOffset = item.offset().top,
        itemHeight = item.innerHeight();
      return itemOffset + itemHeight - listOffset;
    },
    getScrollTop: function () {
      return this.listHolder.scrollTop();
    },
    setScrollTop: function (value) {
      this.listHolder.scrollTop(value);
    },
    createOption: function (option) {
      var newOption = document.createElement('span');
      newOption.className = this.options.optionClass;
      newOption.innerHTML = option.innerHTML;
      newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);
      var optionImage, optionImageSrc = option.getAttribute('data-image');
      if (optionImageSrc) {
        optionImage = document.createElement('img');
        optionImage.src = optionImageSrc;
        newOption.insertBefore(optionImage, newOption.childNodes[0]);
      }
      if (option.disabled) {
        newOption.className += ' ' + this.options.disabledClass;
      }
      if (option.className) {
        newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
      }
      return newOption;
    },
    createOptGroup: function (optgroup) {
      var optGroupContainer = document.createElement('span'),
        optGroupName = optgroup.getAttribute('label'),
        optGroupCaption, optGroupList;
      // create caption
      optGroupCaption = document.createElement('span');
      optGroupCaption.className = this.options.captionClass;
      optGroupCaption.innerHTML = optGroupName;
      optGroupContainer.appendChild(optGroupCaption);
      // create list of options
      if (optgroup.children.length) {
        optGroupList = this.createOptionsList(optgroup);
        optGroupContainer.appendChild(optGroupList);
      }
      optGroupContainer.className = this.options.groupClass;
      return optGroupContainer;
    },
    createOptionContainer: function () {
      var optionContainer = document.createElement('li');
      return optionContainer;
    },
    createOptionsList: function (container) {
      var self = this,
        list = document.createElement('ul');
      $.each(container.children, function (index, currentNode) {
        var item = self.createOptionContainer(currentNode),
          newNode;
        switch (currentNode.tagName.toLowerCase()) {
          case 'option':
            newNode = self.createOption(currentNode);
            break;
          case 'optgroup':
            newNode = self.createOptGroup(currentNode);
            break;
        }
        list.appendChild(item).appendChild(newNode);
      });
      return list;
    },
    refresh: function () {
      // check for select innerHTML changes
      if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
        this.rebuildList();
      }
      // refresh custom scrollbar
      var scrollInstance = jcf.getInstance(this.listHolder);
      if (scrollInstance) {
        scrollInstance.refresh();
      }
      // refresh selectes classes
      this.refreshSelectedClass();
    },
    destroy: function () {
      this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
      this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
      this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
      this.listHolder.off('jcf-pointerdown', this.onPress);
    }
  });
  // helper functions
  var getPrefixedClasses = function (className, prefixToAdd) {
    return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
  };
  var makeUnselectable = (function () {
    var unselectableClass = jcf.getOptions().unselectableClass;

    function preventHandler(e) {
      e.preventDefault();
    }

    return function (node) {
      node.addClass(unselectableClass).on('selectstart', preventHandler);
    };
  }());
}(jQuery, this));
/*
 * Responsive Layout helper
 */
ResponsiveHelper = (function ($) {
  // init variables
  var handlers = [],
    prevWinWidth,
    win = $(window),
    nativeMatchMedia = false;
  // detect match media support
  if (window.matchMedia) {
    if (window.Window && window.matchMedia === Window.prototype.matchMedia) {
      nativeMatchMedia = true;
    } else if (window.matchMedia.toString().indexOf('native') > -1) {
      nativeMatchMedia = true;
    }
  }

  // prepare resize handler
  function resizeHandler() {
    var winWidth = win.width();
    if (winWidth !== prevWinWidth) {
      prevWinWidth = winWidth;
      // loop through range groups
      $.each(handlers, function (index, rangeObject) {
        // disable current active area if needed
        $.each(rangeObject.data, function (property, item) {
          if (item.currentActive && !matchRange(item.range[0], item.range[1])) {
            item.currentActive = false;
            if (typeof item.disableCallback === 'function') {
              item.disableCallback();
            }
          }
        });
        // enable areas that match current width
        $.each(rangeObject.data, function (property, item) {
          if (!item.currentActive && matchRange(item.range[0], item.range[1])) {
            // make callback
            item.currentActive = true;
            if (typeof item.enableCallback === 'function') {
              item.enableCallback();
            }
          }
        });
      });
    }
  }

  win.bind('load resize orientationchange', resizeHandler);

  // test range
  function matchRange(r1, r2) {
    var mediaQueryString = '';
    if (r1 > 0) {
      mediaQueryString += '(min-width: ' + r1 + 'px)';
    }
    if (r2 < Infinity) {
      mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
    }
    return matchQuery(mediaQueryString, r1, r2);
  }

  // media query function
  function matchQuery(query, r1, r2) {
    if (window.matchMedia && nativeMatchMedia) {
      return matchMedia(query).matches;
    } else if (window.styleMedia) {
      return styleMedia.matchMedium(query);
    } else if (window.media) {
      return media.matchMedium(query);
    } else {
      return prevWinWidth >= r1 && prevWinWidth <= r2;
    }
  }

  // range parser
  function parseRange(rangeStr) {
    var rangeData = rangeStr.split('..');
    var x1 = parseInt(rangeData[0], 10) || -Infinity;
    var x2 = parseInt(rangeData[1], 10) || Infinity;
    return [x1, x2].sort(function (a, b) {
      return a - b;
    });
  }

  // export public functions
  return {
    addRange: function (ranges) {
      // parse data and add items to collection
      var result = { data: {} };
      $.each(ranges, function (property, data) {
        result.data[property] = {
          range: parseRange(property),
          enableCallback: data.on,
          disableCallback: data.off
        };
      });
      handlers.push(result);
      // call resizeHandler to recalculate all events
      prevWinWidth = null;
      resizeHandler();
    }
  };
}(jQuery));
/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function (a, b, c, d) {
  "use strict";

  function e(a, b, c) {
    return setTimeout(j(a, c), b)
  }

  function f(a, b, c) {
    return Array.isArray(a) ? (g(a, c[b], c), !0) : !1
  }

  function g(a, b, c) {
    var e;
    if (a) {
      if (a.forEach) {
        a.forEach(b, c);
      } else if (a.length !== d) {
        for (e = 0; e < a.length;) {
          b.call(c, a[e], e, a), e++;
        }
      } else {
        for (e in a) {
          a.hasOwnProperty(e) && b.call(c, a[e], e, a)
        }
      }
    }
  }

  function h(b, c, d) {
    var e = "DEPRECATED METHOD: " + c + "\n" + d + " AT \n";
    return function () {
      var c = new Error("get-stack-trace"),
        d = c && c.stack ? c.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
        f = a.console && (a.console.warn || a.console.log);
      return f && f.call(a.console, e, d), b.apply(this, arguments)
    }
  }

  function i(a, b, c) {
    var d, e = b.prototype;
    d = a.prototype = Object.create(e), d.constructor = a, d._super = e, c && la(d, c)
  }

  function j(a, b) {
    return function () {
      return a.apply(b, arguments)
    }
  }

  function k(a, b) {
    return typeof a == oa ? a.apply(b ? b[0] || d : d, b) : a
  }

  function l(a, b) {
    return a === d ? b : a
  }

  function m(a, b, c) {
    g(q(b), function (b) {
      a.addEventListener(b, c, !1)
    })
  }

  function n(a, b, c) {
    g(q(b), function (b) {
      a.removeEventListener(b, c, !1)
    })
  }

  function o(a, b) {
    for (; a;) {
      if (a == b) return !0;
      a = a.parentNode
    }
    return !1
  }

  function p(a, b) {
    return a.indexOf(b) > -1
  }

  function q(a) {
    return a.trim().split(/\s+/g)
  }

  function r(a, b, c) {
    if (a.indexOf && !c) return a.indexOf(b);
    for (var d = 0; d < a.length;) {
      if (c && a[d][c] == b || !c && a[d] === b) return d;
      d++
    }
    return -1
  }

  function s(a) {
    return Array.prototype.slice.call(a, 0)
  }

  function t(a, b, c) {
    for (var d = [], e = [], f = 0; f < a.length;) {
      var g = b ? a[f][b] : a[f];
      r(e, g) < 0 && d.push(a[f]), e[f] = g, f++
    }
    return c && (d = b ? d.sort(function (a, c) {
      return a[b] > c[b]
    }) : d.sort()), d
  }

  function u(a, b) {
    for (var c, e, f = b[0].toUpperCase() + b.slice(1), g = 0; g < ma.length;) {
      if (c = ma[g], e = c ? c + f : b, e in a) return e;
      g++
    }
    return d
  }

  function v() {
    return ua++
  }

  function w(b) {
    var c = b.ownerDocument || b;
    return c.defaultView || c.parentWindow || a
  }

  function x(a, b) {
    var c = this;
    this.manager = a, this.callback = b, this.element = a.element, this.target = a.options.inputTarget, this.domHandler = function (b) {
      k(a.options.enable, [a]) && c.handler(b)
    }, this.init()
  }

  function y(a) {
    var b, c = a.options.inputClass;
    return new (b = c ? c : xa ? M : ya ? P : wa ? R : L)(a, z)
  }

  function z(a, b, c) {
    var d = c.pointers.length, e = c.changedPointers.length, f = b & Ea && d - e === 0,
      g = b & (Ga | Ha) && d - e === 0;
    c.isFirst = !!f, c.isFinal = !!g, f && (a.session = {}), c.eventType = b, A(a, c), a.emit("hammer.input", c), a.recognize(c), a.session.prevInput = c
  }

  function A(a, b) {
    var c = a.session, d = b.pointers, e = d.length;
    c.firstInput || (c.firstInput = D(b)), e > 1 && !c.firstMultiple ? c.firstMultiple = D(b) : 1 === e && (c.firstMultiple = !1);
    var f = c.firstInput, g = c.firstMultiple, h = g ? g.center : f.center, i = b.center = E(d);
    b.timeStamp = ra(), b.deltaTime = b.timeStamp - f.timeStamp, b.angle = I(h, i), b.distance = H(h, i), B(c, b), b.offsetDirection = G(b.deltaX, b.deltaY);
    var j = F(b.deltaTime, b.deltaX, b.deltaY);
    b.overallVelocityX = j.x, b.overallVelocityY = j.y, b.overallVelocity = qa(j.x) > qa(j.y) ? j.x : j.y, b.scale = g ? K(g.pointers, d) : 1, b.rotation = g ? J(g.pointers, d) : 0, b.maxPointers = c.prevInput ? b.pointers.length > c.prevInput.maxPointers ? b.pointers.length : c.prevInput.maxPointers : b.pointers.length, C(c, b);
    var k = a.element;
    o(b.srcEvent.target, k) && (k = b.srcEvent.target), b.target = k
  }

  function B(a, b) {
    var c = b.center, d = a.offsetDelta || {}, e = a.prevDelta || {}, f = a.prevInput || {};
    b.eventType !== Ea && f.eventType !== Ga || (e = a.prevDelta = {
      x: f.deltaX || 0,
      y: f.deltaY || 0
    }, d = a.offsetDelta = {
      x: c.x,
      y: c.y
    }), b.deltaX = e.x + (c.x - d.x), b.deltaY = e.y + (c.y - d.y)
  }

  function C(a, b) {
    var c, e, f, g, h = a.lastInterval || b, i = b.timeStamp - h.timeStamp;
    if (b.eventType != Ha && (i > Da || h.velocity === d)) {
      var j = b.deltaX - h.deltaX, k = b.deltaY - h.deltaY, l = F(i, j, k);
      e = l.x, f = l.y, c = qa(l.x) > qa(l.y) ? l.x : l.y, g = G(j, k), a.lastInterval = b
    } else {
      c = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction;
    }
    b.velocity = c, b.velocityX = e, b.velocityY = f, b.direction = g
  }

  function D(a) {
    for (var b = [], c = 0; c < a.pointers.length;) {
      b[c] = {
        clientX: pa(a.pointers[c].clientX),
        clientY: pa(a.pointers[c].clientY)
      }, c++;
    }
    return { timeStamp: ra(), pointers: b, center: E(b), deltaX: a.deltaX, deltaY: a.deltaY }
  }

  function E(a) {
    var b = a.length;
    if (1 === b) return { x: pa(a[0].clientX), y: pa(a[0].clientY) };
    for (var c = 0, d = 0, e = 0; b > e;) {
      c += a[e].clientX, d += a[e].clientY, e++;
    }
    return { x: pa(c / b), y: pa(d / b) }
  }

  function F(a, b, c) {
    return { x: b / a || 0, y: c / a || 0 }
  }

  function G(a, b) {
    return a === b ? Ia : qa(a) >= qa(b) ? 0 > a ? Ja : Ka : 0 > b ? La : Ma
  }

  function H(a, b, c) {
    c || (c = Qa);
    var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]];
    return Math.sqrt(d * d + e * e)
  }

  function I(a, b, c) {
    c || (c = Qa);
    var d = b[c[0]] - a[c[0]], e = b[c[1]] - a[c[1]];
    return 180 * Math.atan2(e, d) / Math.PI
  }

  function J(a, b) {
    return I(b[1], b[0], Ra) + I(a[1], a[0], Ra)
  }

  function K(a, b) {
    return H(b[0], b[1], Ra) / H(a[0], a[1], Ra)
  }

  function L() {
    this.evEl = Ta, this.evWin = Ua, this.pressed = !1, x.apply(this, arguments)
  }

  function M() {
    this.evEl = Xa, this.evWin = Ya, x.apply(this, arguments), this.store = this.manager.session.pointerEvents = []
  }

  function N() {
    this.evTarget = $a, this.evWin = _a, this.started = !1, x.apply(this, arguments)
  }

  function O(a, b) {
    var c = s(a.touches), d = s(a.changedTouches);
    return b & (Ga | Ha) && (c = t(c.concat(d), "identifier", !0)), [c, d]
  }

  function P() {
    this.evTarget = bb, this.targetIds = {}, x.apply(this, arguments)
  }

  function Q(a, b) {
    var c = s(a.touches), d = this.targetIds;
    if (b & (Ea | Fa) && 1 === c.length) return d[c[0].identifier] = !0, [c, c];
    var e, f, g = s(a.changedTouches), h = [], i = this.target;
    if (f = c.filter(function (a) {
        return o(a.target, i)
      }), b === Ea) {
      for (e = 0; e < f.length;) {
        d[f[e].identifier] = !0, e++;
      }
    }
    for (e = 0; e < g.length;) {
      d[g[e].identifier] && h.push(g[e]), b & (Ga | Ha) && delete d[g[e].identifier], e++;
    }
    return h.length ? [t(f.concat(h), "identifier", !0), h] : void 0
  }

  function R() {
    x.apply(this, arguments);
    var a = j(this.handler, this);
    this.touch = new P(this.manager, a), this.mouse = new L(this.manager, a), this.primaryTouch = null, this.lastTouches = []
  }

  function S(a, b) {
    a & Ea ? (this.primaryTouch = b.changedPointers[0].identifier, T.call(this, b)) : a & (Ga | Ha) && T.call(this, b)
  }

  function T(a) {
    var b = a.changedPointers[0];
    if (b.identifier === this.primaryTouch) {
      var c = { x: b.clientX, y: b.clientY };
      this.lastTouches.push(c);
      var d = this.lastTouches, e = function () {
        var a = d.indexOf(c);
        a > -1 && d.splice(a, 1)
      };
      setTimeout(e, cb)
    }
  }

  function U(a) {
    for (var b = a.srcEvent.clientX, c = a.srcEvent.clientY, d = 0; d < this.lastTouches.length; d++) {
      var e = this.lastTouches[d], f = Math.abs(b - e.x), g = Math.abs(c - e.y);
      if (db >= f && db >= g) return !0
    }
    return !1
  }

  function V(a, b) {
    this.manager = a, this.set(b)
  }

  function W(a) {
    if (p(a, jb)) return jb;
    var b = p(a, kb), c = p(a, lb);
    return b && c ? jb : b || c ? b ? kb : lb : p(a, ib) ? ib : hb
  }

  function X() {
    if (!fb) return !1;
    var b = {}, c = a.CSS && a.CSS.supports;
    return ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function (d) {
      b[d] = c ? a.CSS.supports("touch-action", d) : !0
    }), b
  }

  function Y(a) {
    this.options = la({}, this.defaults, a || {}), this.id = v(), this.manager = null, this.options.enable = l(this.options.enable, !0), this.state = nb, this.simultaneous = {}, this.requireFail = []
  }

  function Z(a) {
    return a & sb ? "cancel" : a & qb ? "end" : a & pb ? "move" : a & ob ? "start" : ""
  }

  function $(a) {
    return a == Ma ? "down" : a == La ? "up" : a == Ja ? "left" : a == Ka ? "right" : ""
  }

  function _(a, b) {
    var c = b.manager;
    return c ? c.get(a) : a
  }

  function aa() {
    Y.apply(this, arguments)
  }

  function ba() {
    aa.apply(this, arguments), this.pX = null, this.pY = null
  }

  function ca() {
    aa.apply(this, arguments)
  }

  function da() {
    Y.apply(this, arguments), this._timer = null, this._input = null
  }

  function ea() {
    aa.apply(this, arguments)
  }

  function fa() {
    aa.apply(this, arguments)
  }

  function ga() {
    Y.apply(this, arguments), this.pTime = !1, this.pCenter = !1, this._timer = null, this._input = null, this.count = 0
  }

  function ha(a, b) {
    return b = b || {}, b.recognizers = l(b.recognizers, ha.defaults.preset), new ia(a, b)
  }

  function ia(a, b) {
    this.options = la({}, ha.defaults, b || {}), this.options.inputTarget = this.options.inputTarget || a, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = a, this.input = y(this), this.touchAction = new V(this, this.options.touchAction), ja(this, !0), g(this.options.recognizers, function (a) {
      var b = this.add(new a[0](a[1]));
      a[2] && b.recognizeWith(a[2]), a[3] && b.requireFailure(a[3])
    }, this)
  }

  function ja(a, b) {
    var c = a.element;
    if (c.style) {
      var d;
      g(a.options.cssProps, function (e, f) {
        d = u(c.style, f), b ? (a.oldCssProps[d] = c.style[d], c.style[d] = e) : c.style[d] = a.oldCssProps[d] || ""
      }), b || (a.oldCssProps = {})
    }
  }

  function ka(a, c) {
    var d = b.createEvent("Event");
    d.initEvent(a, !0, !0), d.gesture = c, c.target.dispatchEvent(d)
  }

  var la, ma = ["", "webkit", "Moz", "MS", "ms", "o"], na = b.createElement("div"), oa = "function",
    pa = Math.round, qa = Math.abs, ra = Date.now;
  la = "function" != typeof Object.assign ? function (a) {
    if (a === d || null === a) throw new TypeError("Cannot convert undefined or null to object");
    for (var b = Object(a), c = 1; c < arguments.length; c++) {
      var e = arguments[c];
      if (e !== d && null !== e) {
        for (var f in e) {
          e.hasOwnProperty(f) && (b[f] = e[f])
        }
      }
    }
    return b
  } : Object.assign;
  var sa = h(function (a, b, c) {
      for (var e = Object.keys(b), f = 0; f < e.length;) {
        (!c || c && a[e[f]] === d) && (a[e[f]] = b[e[f]]), f++;
      }
      return a
    }, "extend", "Use `assign`."), ta = h(function (a, b) {
      return sa(a, b, !0)
    }, "merge", "Use `assign`."), ua = 1, va = /mobile|tablet|ip(ad|hone|od)|android/i,
    wa = "ontouchstart" in a, xa = u(a, "PointerEvent") !== d,
    ya = wa && va.test(navigator.userAgent), za = "touch", Aa = "pen", Ba = "mouse", Ca = "kinect",
    Da = 25, Ea = 1, Fa = 2, Ga = 4, Ha = 8, Ia = 1, Ja = 2, Ka = 4, La = 8, Ma = 16, Na = Ja | Ka,
    Oa = La | Ma, Pa = Na | Oa, Qa = ["x", "y"], Ra = ["clientX", "clientY"];
  x.prototype = {
    handler: function () {
    }, init: function () {
      this.evEl && m(this.element, this.evEl, this.domHandler), this.evTarget && m(this.target, this.evTarget, this.domHandler), this.evWin && m(w(this.element), this.evWin, this.domHandler)
    }, destroy: function () {
      this.evEl && n(this.element, this.evEl, this.domHandler), this.evTarget && n(this.target, this.evTarget, this.domHandler), this.evWin && n(w(this.element), this.evWin, this.domHandler)
    }
  };
  var Sa = { mousedown: Ea, mousemove: Fa, mouseup: Ga }, Ta = "mousedown",
    Ua = "mousemove mouseup";
  i(L, x, {
    handler: function (a) {
      var b = Sa[a.type];
      b & Ea && 0 === a.button && (this.pressed = !0), b & Fa && 1 !== a.which && (b = Ga), this.pressed && (b & Ga && (this.pressed = !1), this.callback(this.manager, b, {
        pointers: [a],
        changedPointers: [a],
        pointerType: Ba,
        srcEvent: a
      }))
    }
  });
  var Va = { pointerdown: Ea, pointermove: Fa, pointerup: Ga, pointercancel: Ha, pointerout: Ha },
    Wa = { 2: za, 3: Aa, 4: Ba, 5: Ca }, Xa = "pointerdown",
    Ya = "pointermove pointerup pointercancel";
  a.MSPointerEvent && !a.PointerEvent && (Xa = "MSPointerDown", Ya = "MSPointerMove MSPointerUp MSPointerCancel"), i(M, x, {
    handler: function (a) {
      var b = this.store, c = !1, d = a.type.toLowerCase().replace("ms", ""), e = Va[d],
        f = Wa[a.pointerType] || a.pointerType, g = f == za, h = r(b, a.pointerId, "pointerId");
      e & Ea && (0 === a.button || g) ? 0 > h && (b.push(a), h = b.length - 1) : e & (Ga | Ha) && (c = !0), 0 > h || (b[h] = a, this.callback(this.manager, e, {
        pointers: b,
        changedPointers: [a],
        pointerType: f,
        srcEvent: a
      }), c && b.splice(h, 1))
    }
  });
  var Za = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha }, $a = "touchstart",
    _a = "touchstart touchmove touchend touchcancel";
  i(N, x, {
    handler: function (a) {
      var b = Za[a.type];
      if (b === Ea && (this.started = !0), this.started) {
        var c = O.call(this, a, b);
        b & (Ga | Ha) && c[0].length - c[1].length === 0 && (this.started = !1), this.callback(this.manager, b, {
          pointers: c[0],
          changedPointers: c[1],
          pointerType: za,
          srcEvent: a
        })
      }
    }
  });
  var ab = { touchstart: Ea, touchmove: Fa, touchend: Ga, touchcancel: Ha },
    bb = "touchstart touchmove touchend touchcancel";
  i(P, x, {
    handler: function (a) {
      var b = ab[a.type], c = Q.call(this, a, b);
      c && this.callback(this.manager, b, {
        pointers: c[0],
        changedPointers: c[1],
        pointerType: za,
        srcEvent: a
      })
    }
  });
  var cb = 2500, db = 25;
  i(R, x, {
    handler: function (a, b, c) {
      var d = c.pointerType == za, e = c.pointerType == Ba;
      if (!(e && c.sourceCapabilities && c.sourceCapabilities.firesTouchEvents)) {
        if (d) S.call(this, b, c); else if (e && U.call(this, c)) return;
        this.callback(a, b, c)
      }
    }, destroy: function () {
      this.touch.destroy(), this.mouse.destroy()
    }
  });
  var eb = u(na.style, "touchAction"), fb = eb !== d, gb = "compute", hb = "auto",
    ib = "manipulation", jb = "none", kb = "pan-x", lb = "pan-y", mb = X();
  V.prototype = {
    set: function (a) {
      a == gb && (a = this.compute()), fb && this.manager.element.style && mb[a] && (this.manager.element.style[eb] = a), this.actions = a.toLowerCase().trim()
    }, update: function () {
      this.set(this.manager.options.touchAction)
    }, compute: function () {
      var a = [];
      return g(this.manager.recognizers, function (b) {
        k(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
      }), W(a.join(" "))
    }, preventDefaults: function (a) {
      var b = a.srcEvent, c = a.offsetDirection;
      if (this.manager.session.prevented) return void b.preventDefault();
      var d = this.actions, e = p(d, jb) && !mb[jb], f = p(d, lb) && !mb[lb],
        g = p(d, kb) && !mb[kb];
      if (e) {
        var h = 1 === a.pointers.length, i = a.distance < 2, j = a.deltaTime < 250;
        if (h && i && j) return
      }
      return g && f ? void 0 : e || f && c & Na || g && c & Oa ? this.preventSrc(b) : void 0
    }, preventSrc: function (a) {
      this.manager.session.prevented = !0, a.preventDefault()
    }
  };
  var nb = 1, ob = 2, pb = 4, qb = 8, rb = qb, sb = 16, tb = 32;
  Y.prototype = {
    defaults: {}, set: function (a) {
      return la(this.options, a), this.manager && this.manager.touchAction.update(), this
    }, recognizeWith: function (a) {
      if (f(a, "recognizeWith", this)) return this;
      var b = this.simultaneous;
      return a = _(a, this), b[a.id] || (b[a.id] = a, a.recognizeWith(this)), this
    }, dropRecognizeWith: function (a) {
      return f(a, "dropRecognizeWith", this) ? this : (a = _(a, this), delete this.simultaneous[a.id], this)
    }, requireFailure: function (a) {
      if (f(a, "requireFailure", this)) return this;
      var b = this.requireFail;
      return a = _(a, this), -1 === r(b, a) && (b.push(a), a.requireFailure(this)), this
    }, dropRequireFailure: function (a) {
      if (f(a, "dropRequireFailure", this)) return this;
      a = _(a, this);
      var b = r(this.requireFail, a);
      return b > -1 && this.requireFail.splice(b, 1), this
    }, hasRequireFailures: function () {
      return this.requireFail.length > 0
    }, canRecognizeWith: function (a) {
      return !!this.simultaneous[a.id]
    }, emit: function (a) {
      function b(b) {
        c.manager.emit(b, a)
      }

      var c = this, d = this.state;
      qb > d && b(c.options.event + Z(d)), b(c.options.event), a.additionalEvent && b(a.additionalEvent), d >= qb && b(c.options.event + Z(d))
    }, tryEmit: function (a) {
      return this.canEmit() ? this.emit(a) : void(this.state = tb)
    }, canEmit: function () {
      for (var a = 0; a < this.requireFail.length;) {
        if (!(this.requireFail[a].state & (tb | nb))) return !1;
        a++
      }
      return !0
    }, recognize: function (a) {
      var b = la({}, a);
      return k(this.options.enable, [this, b]) ? (this.state & (rb | sb | tb) && (this.state = nb), this.state = this.process(b), void(this.state & (ob | pb | qb | sb) && this.tryEmit(b))) : (this.reset(), void(this.state = tb))
    }, process: function (a) {
    }, getTouchAction: function () {
    }, reset: function () {
    }
  }, i(aa, Y, {
    defaults: { pointers: 1 }, attrTest: function (a) {
      var b = this.options.pointers;
      return 0 === b || a.pointers.length === b
    }, process: function (a) {
      var b = this.state, c = a.eventType, d = b & (ob | pb), e = this.attrTest(a);
      return d && (c & Ha || !e) ? b | sb : d || e ? c & Ga ? b | qb : b & ob ? b | pb : ob : tb
    }
  }), i(ba, aa, {
    defaults: { event: "pan", threshold: 10, pointers: 1, direction: Pa },
    getTouchAction: function () {
      var a = this.options.direction, b = [];
      return a & Na && b.push(lb), a & Oa && b.push(kb), b
    },
    directionTest: function (a) {
      var b = this.options, c = !0, d = a.distance, e = a.direction, f = a.deltaX, g = a.deltaY;
      return e & b.direction || (b.direction & Na ? (e = 0 === f ? Ia : 0 > f ? Ja : Ka, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? Ia : 0 > g ? La : Ma, c = g != this.pY, d = Math.abs(a.deltaY))), a.direction = e, c && d > b.threshold && e & b.direction
    },
    attrTest: function (a) {
      return aa.prototype.attrTest.call(this, a) && (this.state & ob || !(this.state & ob) && this.directionTest(a))
    },
    emit: function (a) {
      this.pX = a.deltaX, this.pY = a.deltaY;
      var b = $(a.direction);
      b && (a.additionalEvent = this.options.event + b), this._super.emit.call(this, a)
    }
  }), i(ca, aa, {
    defaults: { event: "pinch", threshold: 0, pointers: 2 },
    getTouchAction: function () {
      return [jb]
    },
    attrTest: function (a) {
      return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold || this.state & ob)
    },
    emit: function (a) {
      if (1 !== a.scale) {
        var b = a.scale < 1 ? "in" : "out";
        a.additionalEvent = this.options.event + b
      }
      this._super.emit.call(this, a)
    }
  }), i(da, Y, {
    defaults: { event: "press", pointers: 1, time: 251, threshold: 9 },
    getTouchAction: function () {
      return [hb]
    },
    process: function (a) {
      var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold,
        f = a.deltaTime > b.time;
      if (this._input = a, !d || !c || a.eventType & (Ga | Ha) && !f) {
        this.reset();
      } else if (a.eventType & Ea) {
        this.reset(), this._timer = e(function () {
          this.state = rb, this.tryEmit()
        }, b.time, this);
      } else if (a.eventType & Ga) return rb;
      return tb
    },
    reset: function () {
      clearTimeout(this._timer)
    },
    emit: function (a) {
      this.state === rb && (a && a.eventType & Ga ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = ra(), this.manager.emit(this.options.event, this._input)))
    }
  }), i(ea, aa, {
    defaults: { event: "rotate", threshold: 0, pointers: 2 },
    getTouchAction: function () {
      return [jb]
    },
    attrTest: function (a) {
      return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & ob)
    }
  }), i(fa, aa, {
    defaults: {
      event: "swipe",
      threshold: 10,
      velocity: .3,
      direction: Na | Oa,
      pointers: 1
    }, getTouchAction: function () {
      return ba.prototype.getTouchAction.call(this)
    }, attrTest: function (a) {
      var b, c = this.options.direction;
      return c & (Na | Oa) ? b = a.overallVelocity : c & Na ? b = a.overallVelocityX : c & Oa && (b = a.overallVelocityY), this._super.attrTest.call(this, a) && c & a.offsetDirection && a.distance > this.options.threshold && a.maxPointers == this.options.pointers && qa(b) > this.options.velocity && a.eventType & Ga
    }, emit: function (a) {
      var b = $(a.offsetDirection);
      b && this.manager.emit(this.options.event + b, a), this.manager.emit(this.options.event, a)
    }
  }), i(ga, Y, {
    defaults: {
      event: "tap",
      pointers: 1,
      taps: 1,
      interval: 300,
      time: 250,
      threshold: 9,
      posThreshold: 10
    }, getTouchAction: function () {
      return [ib]
    }, process: function (a) {
      var b = this.options, c = a.pointers.length === b.pointers, d = a.distance < b.threshold,
        f = a.deltaTime < b.time;
      if (this.reset(), a.eventType & Ea && 0 === this.count) return this.failTimeout();
      if (d && f && c) {
        if (a.eventType != Ga) return this.failTimeout();
        var g = this.pTime ? a.timeStamp - this.pTime < b.interval : !0,
          h = !this.pCenter || H(this.pCenter, a.center) < b.posThreshold;
        this.pTime = a.timeStamp, this.pCenter = a.center, h && g ? this.count += 1 : this.count = 1, this._input = a;
        var i = this.count % b.taps;
        if (0 === i) {
          return this.hasRequireFailures() ? (this._timer = e(function () {
            this.state = rb, this.tryEmit()
          }, b.interval, this), ob) : rb
        }
      }
      return tb
    }, failTimeout: function () {
      return this._timer = e(function () {
        this.state = tb
      }, this.options.interval, this), tb
    }, reset: function () {
      clearTimeout(this._timer)
    }, emit: function () {
      this.state == rb && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
    }
  }), ha.VERSION = "2.0.8", ha.defaults = {
    domEvents: !1,
    touchAction: gb,
    enable: !0,
    inputTarget: null,
    inputClass: null,
    preset: [[ea, { enable: !1 }], [ca, { enable: !1 }, ["rotate"]], [fa, { direction: Na }], [ba, { direction: Na }, ["swipe"]], [ga], [ga, {
      event: "doubletap",
      taps: 2
    }, ["tap"]], [da]],
    cssProps: {
      userSelect: "none",
      touchSelect: "none",
      touchCallout: "none",
      contentZooming: "none",
      userDrag: "none",
      tapHighlightColor: "rgba(0,0,0,0)"
    }
  };
  var ub = 1, vb = 2;
  ia.prototype = {
    set: function (a) {
      return la(this.options, a), a.touchAction && this.touchAction.update(), a.inputTarget && (this.input.destroy(), this.input.target = a.inputTarget, this.input.init()), this
    }, stop: function (a) {
      this.session.stopped = a ? vb : ub
    }, recognize: function (a) {
      var b = this.session;
      if (!b.stopped) {
        this.touchAction.preventDefaults(a);
        var c, d = this.recognizers, e = b.curRecognizer;
        (!e || e && e.state & rb) && (e = b.curRecognizer = null);
        for (var f = 0; f < d.length;) {
          c = d[f], b.stopped === vb || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & (ob | pb | qb) && (e = b.curRecognizer = c), f++
        }
      }
    }, get: function (a) {
      if (a instanceof Y) return a;
      for (var b = this.recognizers, c = 0; c < b.length; c++) {
        if (b[c].options.event == a) return b[c];
      }
      return null
    }, add: function (a) {
      if (f(a, "add", this)) return this;
      var b = this.get(a.options.event);
      return b && this.remove(b), this.recognizers.push(a), a.manager = this, this.touchAction.update(), a
    }, remove: function (a) {
      if (f(a, "remove", this)) return this;
      if (a = this.get(a)) {
        var b = this.recognizers, c = r(b, a);
        -1 !== c && (b.splice(c, 1), this.touchAction.update())
      }
      return this
    }, on: function (a, b) {
      if (a !== d && b !== d) {
        var c = this.handlers;
        return g(q(a), function (a) {
          c[a] = c[a] || [], c[a].push(b)
        }), this
      }
    }, off: function (a, b) {
      if (a !== d) {
        var c = this.handlers;
        return g(q(a), function (a) {
          b ? c[a] && c[a].splice(r(c[a], b), 1) : delete c[a]
        }), this
      }
    }, emit: function (a, b) {
      this.options.domEvents && ka(a, b);
      var c = this.handlers[a] && this.handlers[a].slice();
      if (c && c.length) {
        b.type = a, b.preventDefault = function () {
          b.srcEvent.preventDefault()
        };
        for (var d = 0; d < c.length;) {
          c[d](b), d++
        }
      }
    }, destroy: function () {
      this.element && ja(this, !1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null
    }
  }, la(ha, {
    INPUT_START: Ea,
    INPUT_MOVE: Fa,
    INPUT_END: Ga,
    INPUT_CANCEL: Ha,
    STATE_POSSIBLE: nb,
    STATE_BEGAN: ob,
    STATE_CHANGED: pb,
    STATE_ENDED: qb,
    STATE_RECOGNIZED: rb,
    STATE_CANCELLED: sb,
    STATE_FAILED: tb,
    DIRECTION_NONE: Ia,
    DIRECTION_LEFT: Ja,
    DIRECTION_RIGHT: Ka,
    DIRECTION_UP: La,
    DIRECTION_DOWN: Ma,
    DIRECTION_HORIZONTAL: Na,
    DIRECTION_VERTICAL: Oa,
    DIRECTION_ALL: Pa,
    Manager: ia,
    Input: x,
    TouchAction: V,
    TouchInput: P,
    MouseInput: L,
    PointerEventInput: M,
    TouchMouseInput: R,
    SingleTouchInput: N,
    Recognizer: Y,
    AttrRecognizer: aa,
    Tap: ga,
    Pan: ba,
    Swipe: fa,
    Pinch: ca,
    Rotate: ea,
    Press: da,
    on: m,
    off: n,
    each: g,
    merge: ta,
    extend: sa,
    assign: la,
    inherit: i,
    bindFn: j,
    prefixed: u
  });
  var wb = "undefined" != typeof a ? a : "undefined" != typeof self ? self : {};
  wb.Hammer = ha, "function" == typeof define && define.amd ? define(function () {
    return ha
  }) : "undefined" != typeof module && module.exports ? module.exports = ha : a[c] = ha
}(window, document, "Hammer");
/*! Picturefill - v2.3.1 - 2015-04-09
 * http://scottjehl.github.io/picturefill
 * Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
document.createElement('picture');
window.matchMedia || (window.matchMedia = function () {
  "use strict";
  var a = window.styleMedia || window.media;
  if (!a) {
    var b = document.createElement("style"), c = document.getElementsByTagName("script")[0],
      d = null;
    b.type = "text/css", b.id = "matchmediajs-test", c.parentNode.insertBefore(b, c), d = "getComputedStyle" in window && window.getComputedStyle(b, null) || b.currentStyle, a = {
      matchMedium: function (a) {
        var c = "@media " + a + "{ #matchmediajs-test { width: 1px; } }";
        return b.styleSheet ? b.styleSheet.cssText = c : b.textContent = c, "1px" === d.width
      }
    }
  }
  return function (b) {
    return { matches: a.matchMedium(b || "all"), media: b || "all" }
  }
}()), function (a, b, c) {
  "use strict";

  function d(b) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = b : "function" == typeof define && define.amd && define("picturefill", function () {
      return b
    }), "object" == typeof a && (a.picturefill = b)
  }

  function e(a) {
    var b, c, d, e, f, i = a || {};
    b = i.elements || g.getAllElements();
    for (var j = 0, k = b.length; k > j; j++) {
      if (c = b[j], d = c.parentNode, e = void 0, f = void 0, "IMG" === c.nodeName.toUpperCase() && (c[g.ns] || (c[g.ns] = {}), i.reevaluate || !c[g.ns].evaluated)) {
        if (d && "PICTURE" === d.nodeName.toUpperCase()) {
          if (g.removeVideoShim(d), e = g.getMatch(c, d), e === !1) continue
        } else {
          e = void 0;
        }
        (d && "PICTURE" === d.nodeName.toUpperCase() || !g.sizesSupported && c.srcset && h.test(c.srcset)) && g.dodgeSrcset(c), e ? (f = g.processSourceSet(e), g.applyBestCandidate(f, c)) : (f = g.processSourceSet(c), (void 0 === c.srcset || c[g.ns].srcset) && g.applyBestCandidate(f, c)), c[g.ns].evaluated = !0
      }
    }
  }

  function f() {
    function c() {
      clearTimeout(d), d = setTimeout(h, 60)
    }

    g.initTypeDetects(), e();
    var d, f = setInterval(function () {
      return e(), /^loaded|^i|^c/.test(b.readyState) ? void clearInterval(f) : void 0
    }, 250), h = function () {
      e({ reevaluate: !0 })
    };
    a.addEventListener ? a.addEventListener("resize", c, !1) : a.attachEvent && a.attachEvent("onresize", c)
  }

  if (a.HTMLPictureElement) {
    return void d(function () {
    });
  }
  b.createElement("picture");
  var g = a.picturefill || {}, h = /\s+\+?\d+(e\d+)?w/;
  g.ns = "picturefill", function () {
    g.srcsetSupported = "srcset" in c, g.sizesSupported = "sizes" in c, g.curSrcSupported = "currentSrc" in c
  }(), g.trim = function (a) {
    return a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, "")
  }, g.makeUrl = function () {
    var a = b.createElement("a");
    return function (b) {
      return a.href = b, a.href
    }
  }(), g.restrictsMixedContent = function () {
    return "https:" === a.location.protocol
  }, g.matchesMedia = function (b) {
    return a.matchMedia && a.matchMedia(b).matches
  }, g.getDpr = function () {
    return a.devicePixelRatio || 1
  }, g.getWidthFromLength = function (a) {
    var c;
    if (!a || a.indexOf("%") > -1 != !1 || !(parseFloat(a) > 0 || a.indexOf("calc(") > -1)) return !1;
    a = a.replace("vw", "%"), g.lengthEl || (g.lengthEl = b.createElement("div"), g.lengthEl.style.cssText = "border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden", g.lengthEl.className = "helper-from-picturefill-js"), g.lengthEl.style.width = "0px";
    try {
      g.lengthEl.style.width = a
    } catch (d) {
    }
    return b.body.appendChild(g.lengthEl), c = g.lengthEl.offsetWidth, 0 >= c && (c = !1), b.body.removeChild(g.lengthEl), c
  }, g.detectTypeSupport = function (b, c) {
    var d = new a.Image;
    return d.onerror = function () {
      g.types[b] = !1, e()
    }, d.onload = function () {
      g.types[b] = 1 === d.width, e()
    }, d.src = c, "pending"
  }, g.types = g.types || {}, g.initTypeDetects = function () {
    g.types["image/jpeg"] = !0, g.types["image/gif"] = !0, g.types["image/png"] = !0, g.types["image/svg+xml"] = b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1"), g.types["image/webp"] = g.detectTypeSupport("image/webp", "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=")
  }, g.verifyTypeSupport = function (a) {
    var b = a.getAttribute("type");
    if (null === b || "" === b) return !0;
    var c = g.types[b];
    return "string" == typeof c && "pending" !== c ? (g.types[b] = g.detectTypeSupport(b, c), "pending") : "function" == typeof c ? (c(), "pending") : c
  }, g.parseSize = function (a) {
    var b = /(\([^)]+\))?\s*(.+)/g.exec(a);
    return { media: b && b[1], length: b && b[2] }
  }, g.findWidthFromSourceSize = function (c) {
    for (var d, e = g.trim(c).split(/\s*,\s*/), f = 0, h = e.length; h > f; f++) {
      var i = e[f], j = g.parseSize(i), k = j.length, l = j.media;
      if (k && (!l || g.matchesMedia(l)) && (d = g.getWidthFromLength(k))) break
    }
    return d || Math.max(a.innerWidth || 0, b.documentElement.clientWidth)
  }, g.parseSrcset = function (a) {
    for (var b = []; "" !== a;) {
      a = a.replace(/^\s+/g, "");
      var c, d = a.search(/\s/g), e = null;
      if (-1 !== d) {
        c = a.slice(0, d);
        var f = c.slice(-1);
        if (("," === f || "" === c) && (c = c.replace(/,+$/, ""), e = ""), a = a.slice(d + 1), null === e) {
          var g = a.indexOf(",");
          -1 !== g ? (e = a.slice(0, g), a = a.slice(g + 1)) : (e = a, a = "")
        }
      } else {
        c = a, a = "";
      }
      (c || e) && b.push({ url: c, descriptor: e })
    }
    return b
  }, g.parseDescriptor = function (a, b) {
    var c, d = b || "100vw", e = a && a.replace(/(^\s+|\s+$)/g, ""),
      f = g.findWidthFromSourceSize(d);
    if (e) {
      for (var h = e.split(" "), i = h.length - 1; i >= 0; i--) {
        var j = h[i], k = j && j.slice(j.length - 1);
        if ("h" !== k && "w" !== k || g.sizesSupported) {
          if ("x" === k) {
            var l = j && parseFloat(j, 10);
            c = l && !isNaN(l) ? l : 1
          }
        } else {
          c = parseFloat(parseInt(j, 10) / f)
        }
      }
    }
    return c || 1
  }, g.getCandidatesFromSourceSet = function (a, b) {
    for (var c = g.parseSrcset(a), d = [], e = 0, f = c.length; f > e; e++) {
      var h = c[e];
      d.push({ url: h.url, resolution: g.parseDescriptor(h.descriptor, b) })
    }
    return d
  }, g.dodgeSrcset = function (a) {
    a.srcset && (a[g.ns].srcset = a.srcset, a.srcset = "", a.setAttribute("data-pfsrcset", a[g.ns].srcset))
  }, g.processSourceSet = function (a) {
    var b = a.getAttribute("srcset"), c = a.getAttribute("sizes"), d = [];
    return "IMG" === a.nodeName.toUpperCase() && a[g.ns] && a[g.ns].srcset && (b = a[g.ns].srcset), b && (d = g.getCandidatesFromSourceSet(b, c)), d
  }, g.backfaceVisibilityFix = function (a) {
    var b = a.style || {}, c = "webkitBackfaceVisibility" in b, d = b.zoom;
    c && (b.zoom = ".999", c = a.offsetWidth, b.zoom = d)
  }, g.setIntrinsicSize = function () {
    var c = {}, d = function (a, b, c) {
      b && a.setAttribute("width", parseInt(b / c, 10))
    };
    return function (e, f) {
      var h;
      e[g.ns] && !a.pfStopIntrinsicSize && (void 0 === e[g.ns].dims && (e[g.ns].dims = e.getAttribute("width") || e.getAttribute("height")), e[g.ns].dims || (f.url in c ? d(e, c[f.url], f.resolution) : (h = b.createElement("img"), h.onload = function () {
        if (c[f.url] = h.width, !c[f.url]) {
          try {
            b.body.appendChild(h), c[f.url] = h.width || h.offsetWidth, b.body.removeChild(h)
          } catch (a) {
          }
        }
        e.src === f.url && d(e, c[f.url], f.resolution), e = null, h.onload = null, h = null
      }, h.src = f.url)))
    }
  }(), g.applyBestCandidate = function (a, b) {
    var c, d, e;
    a.sort(g.ascendingSort), d = a.length, e = a[d - 1];
    for (var f = 0; d > f; f++) {
      if (c = a[f], c.resolution >= g.getDpr()) {
        e = c;
        break
      }
    }
    e && (e.url = g.makeUrl(e.url), b.src !== e.url && (g.restrictsMixedContent() && "http:" === e.url.substr(0, "http:".length).toLowerCase() ? void 0 !== window.console && console.warn("Blocked mixed content image " + e.url) : (b.src = e.url, g.curSrcSupported || (b.currentSrc = b.src), g.backfaceVisibilityFix(b))), g.setIntrinsicSize(b, e))
  }, g.ascendingSort = function (a, b) {
    return a.resolution - b.resolution
  }, g.removeVideoShim = function (a) {
    var b = a.getElementsByTagName("video");
    if (b.length) {
      for (var c = b[0], d = c.getElementsByTagName("source"); d.length;) {
        a.insertBefore(d[0], c);
      }
      c.parentNode.removeChild(c)
    }
  }, g.getAllElements = function () {
    for (var a = [], c = b.getElementsByTagName("img"), d = 0, e = c.length; e > d; d++) {
      var f = c[d];
      ("PICTURE" === f.parentNode.nodeName.toUpperCase() || null !== f.getAttribute("srcset") || f[g.ns] && null !== f[g.ns].srcset) && a.push(f)
    }
    return a
  }, g.getMatch = function (a, b) {
    for (var c, d = b.childNodes, e = 0, f = d.length; f > e; e++) {
      var h = d[e];
      if (1 === h.nodeType) {
        if (h === a) return c;
        if ("SOURCE" === h.nodeName.toUpperCase()) {
          null !== h.getAttribute("src") && void 0 !== typeof console && console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");
          var i = h.getAttribute("media");
          if (h.getAttribute("srcset") && (!i || g.matchesMedia(i))) {
            var j = g.verifyTypeSupport(h);
            if (j === !0) {
              c = h;
              break
            }
            if ("pending" === j) return !1
          }
        }
      }
    }
    return c
  }, f(), e._ = g, d(e)
}(window, window.document, new window.Image);
