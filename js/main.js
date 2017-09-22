(function () {
  "use strict";
  // FIXME: use env variables instead => http://harpjs.com/docs/development/globals
  var _env = 'production';
  var $ = jQuery;
  var BASE_URL = 'https://synthesys.carto.com/api/v2/sql';
  var TABLE_MAX_SIZE = 2;

  // initial state
  var _state = {
    filters: {
      discipline: '',
      funding_round: '',
      iso: '',
      iso2: ''
    },
    table: {
      rows: [],
      total_pages: 0,
      current: 0, // TODO: update this key on pagination clicks and call renderTable();
      orderBy: null,
      sortOrder: 'asc'
    }
  };

  // side-effects
  function _setFilters(payload) {
    var prevState = Object.assign({}, _state);
    _state.filters = Object.assign({}, _state.filters, payload);
    devTools('SET_FILTERS', payload, prevState);
  }

  function _setTable(payload) {
    var prevState = Object.assign({}, _state);
    _state.table = Object.assign({}, _state.table, payload);
    devTools('SET_TABLE', payload, prevState);
  }

  // main
  $(function () {
    init();
    render();
  });

  // lifecycle

  // This is meant to be called only once
  function init() {
    setFilters();
    setCountrySearch();
    initSlickCarousel();
    initMobileNav();
    initCarousel();
    initCustomForms();
    initTableHeader();
  }

  // This is meant to be called everytime a filter changes
  function render() {
    initDynamicSentence();
    initHighcharts();
    initBubbleChart();
    initSankeyChart();
    initBubbleChart();
    initTableBody();
  }

  // General inits
  function initSlickCarousel() {
    $('.info-slider').slick({
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

  function initMobileNav() {
    $('body').mobileNav({
      menuActiveClass: 'nav-active',
      menuOpener: '.nav-opener'
    });
    $('body').mobileNav({
      menuActiveClass: 'filter-active',
      menuOpener: '.filter-by'
    });
    $('body').mobileNav({
      menuActiveClass: 'research-active',
      menuOpener: '.research-opener'
    });
    $('.autocomplete').mobileNav({
      menuActiveClass: 'auto-active',
      menuOpener: '.opener',
      hideOnClickOutside: true,
      menuDrop: '.drop'
    });
  }

  function initCarousel() {
    $('.testimonial-slider').scrollGallery({
      mask: '.mask',
      slider: '.slideset',
      slides: '.slide',
      stretchSlideToMask: true
    });
  }

  function initCustomForms() {
    jcf.setOptions('Select', {
      wrapNative: false,
      wrapNativeOnMobile: false,
    });
    jcf.replaceAll();
  }

  // Overview inits
  function initSankeyChart() {
    $('.tree-chart').each(function () {
      var chartsHolder = $(this);

      function drawChart(data, obj) {
        chartsHolder.empty();
        var chartBlock = $('<div class="chart-block">').appendTo(chartsHolder);
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
          .style("stroke-width", function (d) {
            return d.target.value;
          })
          .attr("d", diagonal);
        resize();
        $(window)
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
          var xOffset = nodeEnter[0][0].getBBox().width * 1.5;
          g.attr("transform", "translate(" + xOffset + ", 0)");
          link.attr("d", diagonal);
          nodeEnter.attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
          });
        }
      }

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

      if (_state.filters.iso) {
        chartsHolder.parent().parent().removeClass('is-hidden');
        var query = researchersSankeyChartQuery(_state.filters).trim();
        $.getJSON(BASE_URL, { q: query }, function (data) {
          var apiData = parseResearchersSankeyChartData(data);
          ResponsiveHelper.addRange({
            '768..': {
              on: function () {
                drawChart(apiData.tree, {
 textWidth: 200,
 varticalSpacing: 79,
 leftOffset: 18
                });
              }
            },
            '..767': {
              on: function () {
                drawChart(apiData.tree, {
 textWidth: 90,
 varticalSpacing: 70,
 leftOffset: 12
                });
              }
            }
          });
        }.bind(this));
      } else {
        chartsHolder.closest('.col').addClass('is-hidden');
      }
    });
  }

  function initBubbleChart() {
    var isIE = window.navigator.msPointerEnabled;
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
    var query;
    if (_state.filters.iso2) {
      query = disciplineCountryBubbleChartQuery(_state.filters).trim();
    } else {
      var params = prefixFiltersForQuery('AND', '', 'synthesys.synth_roun =');
      query = disciplineBubbleChartQuery(params).trim();
    }
    $('.bubbles-chart').each(function () {
      var holder = $(this);
      holder.empty();
      if (!_state.filters.discipline) {
        holder.closest('.col').removeClass('is-hidden');
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
        $.getJSON(BASE_URL, { q: query }, function (data) {
          var root = parseDisciplineBubbleChartData(data);
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
          node.append("svg:text")
            .attr("dy", "1.5em")
            .style("text-anchor", "middle")
            .style("fill", "#fff")
            .text(function (d) {
              return d.className;
            });
          if (isIE) {
            var addEvents = function addEvents(self) {
              $(self).off('mouseenter').on('mouseenter', function () {
                d3.select(self).select("circle")
 .attr("class", "selected_circle");
                $('.node').each(function () {
 var n = $(this);
 n.one('mouseenter', function () {
   svg[0][0].appendChild(this);
   addEvents(this);
 });
                });
              });
              $(self).off('mouseleave').on('mouseleave', function () {
                d3.select(self).select("circle")
 .attr("class", "default_circle");
              });
            }
            $(node[0]).each(function () {
              var n = $(this);
              n.one('mouseenter', function () {
                svg[0][0].appendChild(this);
                addEvents(this);
              });
            });
            $(svg[0]).on('mouseleave', function () {
              $('.node').each(function () {
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
        }.bind(this));

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
      } else {
        holder.closest('.col').addClass('is-hidden');
      }
    });
  }

  function initHighcharts() {
    $('.gender-donut-chart').each(function () {
      var query, params;
      if (_state.filters.iso2) {
        params = prefixFiltersForQuery('AND', 'discipline like', 'funding_ro like');
        query = genderCountryPieChartQuery(params).trim();
      } else {
        params = prefixFiltersForQuery('WHERE', 'discipline like', 'funding_ro like');
        query = genderPieChartQuery(params).trim();
      }
      $.getJSON(BASE_URL, { q: query }, function (data) {
        var apiData = parseGenderPieChartData(data);
        renderPieChart(this, apiData);
      }.bind(this));
    });
    $('.line-chart').each(function () {
      var holder = $(this);
      var query;
      var params = prefixFiltersForQuery('AND', 'discipline like', 'funding_ro like');
      if (_state.filters.iso2) {
        query = researchersCountryLineChartQuery(params).trim();
      } else {
        query = researchersLineChartQuery(params).trim();
      }
      $.getJSON(BASE_URL, { q: query }, function (data) {
        var apiData = parseResearchersLineChartData(data);
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
              pointStart: apiData.yearStart,
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
              data: apiData.yearCount
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
          var opts = {
            name: chart.series[0].name.toUpperCase(),
            max: chart.yAxis[0].dataMax
          };
          var legend = $(_.template('<div class="chart-max-val"><span> <%= name %> </span><b> <%= max %> k</b></div>')(opts));
          var oldLegend = holder.parent().find('.chart-max-val');
          if (oldLegend[0]) {
            oldLegend.replaceWith(legend);
          } else {
            legend.insertBefore(holder);
          }
        });
      }.bind(this));
    });
    $('.map-chart').each(function () {
      var query, params;
      if (_state.filters.iso2) {
        query = choroplethCountryQuery(_state.filters).trim();
      } else if (_state.filters.funding_round) {
        params = prefixFiltersForQuery('AND','', 'synthesys.synth_roun =');
        query = choroplethFundingRoundQuery(params).trim();
      } else {
        params = prefixFiltersForQuery('AND', 'synthesys.discipline =', '');
        query = choroplethQuery(params).trim();
      }
      var holder = $(this);
      $.getJSON(BASE_URL, { q: query, format: 'geojson' }, function (geojson) {
        var polygons = Highcharts.geojson(geojson);
        var mapData = parseChoroplethMapChartData(polygons);
        Highcharts.mapChart({
          chart: {
            renderTo: holder[0],
            height: 600
          },
          title: {
            text: ''
          },
          plotOptions: {
            map: {
              allAreas: true,
              borderColor: '#fff'
            }
          },
          tooltip: {
            headerFormat: '',
            pointFormat: '{point.properties.discipline} <b>{point.properties.count}</b>'
          },
          series: [{
            data: mapData,
            showInLegend: false,
            states: {
              hover: {
                borderWidth: 2,
                brightness: 0
              }
            }
          }]
        });
      });
    });
    $('.researcher-type-donut-chart').each(function () {
      var params = prefixFiltersForQuery('AND', 'discipline like', 'funding_ro like');
      var query;
      if (_state.filters.iso2) {
        query = researcherCountryDonutChartQuery(params).trim();
      } else {
        query = researcherDonutChartQuery(params).trim();
      }
      $.getJSON(BASE_URL, { q: query }, function (data) {
        var apiData = parseResearcherTypeDonutChartData(data);
        renderPieChart(this, apiData, {
          height: 400,
          heightResponsive: 370,
          center: ['50%', '70%'],
          centerResponsive: ['50%', '75%']
        });
      }.bind(this));
    })
    $('.column-chart').each(function () {
      var query;
      if (_state.filters.iso) {
        query = papersPerYearCountryBarChartQuery(_state.filters).trim();
      } else {
        var params = prefixFiltersForQuery('AND', 'discipline like', '');
        query = papersPerYearBarChartQuery(params).trim();
      }
      $.getJSON(BASE_URL, { q: query }, function (data) {
        var apiData = parsePapersByYearBarChartData(data);
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
                ]
              },
              groupPadding: 0,
              pointPadding: 0.2,
            }
          },
          tooltip: {
            headerFormat: '',
            pointFormat: 'Papers per {point.name}: <b>{point.y}</b>'
          },
          series: [{
            name: 'Population',
            data: apiData.columns
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
      }.bind(this));
    });
    $('.treemap-chart').each(function () {
      var holder = $(this);
      var query;
      var params = prefixFiltersForQuery('AND', 'discipline like', 'funding_ro like');
      if (_state.filters.iso2) {
        query = institutesVisitedCountryTreeChartQuery(params).trim();
      } else {
        query = institutesVisitedTreeChartQuery(params).trim();
      }
      $.getJSON(BASE_URL, { q: query }, function (data) {
        var apiData = parseInstitutesVisitedTreeChartData(data);
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
            data: apiData.institutesCount
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
            $(chart.legend.box.parentGroup.div).css('top', chart.clipBox.height + 15);
          }
        });
      }.bind(this));
    });
  }

  function initDynamicSentence() {
    var query, params;
    if (_state.filters.iso2) {
      params = prefixFiltersForQuery('AND', 'discipline like', 'funding_ro like');
      query = dynamicSentenceCountryQuery(params).trim();
    } else {
      params = prefixFiltersForQuery('AND', 'discipline like', 'funding_ro like');
      query = dynamicSenteceQuery(params).trim();
    }
    $.getJSON(BASE_URL, { q: query }, function (data) {
      var sentence = parseDynamicSentenceData(data);
      $('.js-dynamic-sentence').html(sentence);
    }.bind(this));
  }

  function renderPieChart(selector, data, options) {
    var config = Object.assign({
      height: 280,
      heightResponsive: 349,
      center: ['50%', '50%'],
      centerResponsive: ['50%', '57%']
    }, options);
    Highcharts.chart({
      chart: {
        renderTo: selector,
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: config.height
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
          center: config.center,
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
        data: data
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 450
          },
          chartOptions: {
            chart: {
              height: config.heightResponsive
            },
            plotOptions: {
              pie: {
                size: 213,
                center: config.centerResponsive
              }
            }
          }
        }]
      }
    });
  }

  function initTableHeader() {
    var sortList = Array.prototype.slice.call($('.js-table-sort'))
      sortList.forEach(function (sort) {
      $(sort).click(onSortTable);
    });
  }

  function initTableBody() {
    var tableContent = $('.js-table-body');
    tableContent.html('');

    var query;
    if (_state.filters.iso) {
      query = publicationsCountryTableQuery(_state.filters).trim();
    } else {
      var params = prefixFiltersForQuery('AND', 'discipline =', 'synthround =');
      query = publicationTableQuery(params).trim();
    }
    $.getJSON(BASE_URL, { q: query }, function (data) {
      var payload = {
        rows: orderTableData(data.rows, _state.table),
        totalPages: Math.ceil(data.total_rows/TABLE_MAX_SIZE)
      };

      _setTable(payload);
      renderTable();
    });
  }

  // Filters
  function updateFilter(e) {
    e.preventDefault();
    e.stopPropagation();
    var payload = {};
    var el = $(e.currentTarget);
    var type = el.data('filter-type');
    var data = el.data('value');
    var label = el.find('a').html();
    if (typeof data === 'undefined') {
      data = e.currentTarget.value;
    }
    if (type === 'country') {
      $('*[data-filter-value="' + type + '"]').html(label);
      el.closest('.autocomplete, .auto-active').removeClass('auto-active');
      payload.iso = data;
      payload.iso2 = ISO_TO_ISO2[data];
      _setFilters(payload);
      $('.js-country-filter-dependent').each(function () {
        this.textContent = data && label;
      });
    } else {
      payload[type] = data;
      _setFilters(payload)
    }
    render();
  };

  function restoreFilters() {
    var filters = Array.prototype.slice.call($('.js-filter'));
    filters.forEach(function (filter) {
      var type = $(filter).data('filter-type');
      if (_state.filters[type] || (_state.filters.iso && type === 'country')) {
        if (type !== 'country') {
          $(filter).val('').trigger('change');
        } else {
          filter.children[0].click();
        }
      }
    })
  }

  function setFilters() {
    var filters = Array.prototype.slice.call($('.js-filter'));
    filters.forEach(function (filter) {
      var type = $(filter).data('filter-type');
      var data = FILTERS_DATA[type];
      if (type !== 'country') {
        setFilter(filter, data);
      } else {
        setCountryFilter(filter, data);
      }
    });
    $('.js-filter-restore').click(restoreFilters);
  }

  // TODO: instead of adding another filter the behaviour should be to replace existing filters
  function setFilter(filter, data) {
    if (!data) return;
    data.forEach(function (item) {
      var optionEl = _.template('<option value="<%= value %>"> <%= label %> </option>')(item);
      $(filter).append(optionEl);
    });
    $(filter.children[0]).click(updateFilter);
    $(filter).change(updateFilter);
  }

  function setCountryFilter(filter, data) {
    if (!data) return;
    data.forEach(function (item, i) {
      var optionEl = _.template('<li data-filter-type="country" data-value="<%= value %>"><a><%= label %></a></li>')(item);
      $(filter).append(optionEl);
      $(filter.children[i]).click(updateFilter);
    });
    $(filter.children[0]).click(updateFilter);
  }

  function setCountrySearch() {
    $('.js-country-search').on('input', _.debounce(function (e) {
      const value = e.currentTarget.value.toUpperCase();
      const data = FILTERS_DATA['country'].filter(function (item) {
        return item.label.toUpperCase().indexOf(value) > -1;
      });
      data.unshift({ value: '', label: 'Select a Country' });
      var countryFilter = $('*[data-filter-type="country"]');
      countryFilter.html('');
      setCountryFilter(countryFilter[0], data);
    }, 700))
  }

  // Table
  function onSortTable(e) {
    var payload = {};
    var orderKey = $(e.currentTarget).data('orderby');
    function toggleSortOrder() {
      return _state.table.sortOrder === 'asc' ? 'desc' : 'asc';
    }

    payload.sortOrder = !_state.table.orderBy || _state.table.orderBy === orderKey ? toggleSortOrder() : 'asc';
    payload.orderBy = orderKey;
    payload.rows = orderTableData(_state.table.rows, payload);
    _setTable(payload);

    renderTable();
  }

  function orderTableData(data, options) {
    return options.orderBy ? _.orderBy(data, [options.orderBy], [options.sortOrder]) : data;
  }

  function mapDataToTableMarkup(data) {
    var tableRow = _.template(
      '<tr>' +
      '  <td class="col1"><%= year %></td>' +
      '  <td class="col2"><%= title %></td>' +
      '  <td class="col3">' +
      '    <p><%= publisher %></p>' +
      '    <a href="<%= url %>" class="more <% if(url === \'no_data\') print(\'is-hidden\')%>">Go to Paper</a>' +
      '  </td>' +
      '  <td class="col4"><%= authors %></td>' +
      '  <td class="col5"><%= volume %></td>' +
      '  <td class="col6"><%= pages %></td>' +
      '</tr>'
    );

    return data.map(function (row) { return tableRow(row) });
  }

  function getTablePage(rows, index, maxSize) {
    return rows.slice(index, index + maxSize);
  }

  function renderTable() {
    var page = getTablePage(_state.table.rows, _state.table.current, TABLE_MAX_SIZE);
    var markup = mapDataToTableMarkup(page);

    $('.js-table-body').html(markup);
  }

  // Utils
  function getSelectedCountry() {
    return FILTERS_DATA.country.find(function (country) {
      return country.value === _state.filters.iso
    });
  }

  function prefixFiltersForQuery(firstClause, disciplinePrefix, fundingPrefix) {
    var secondClause = 'AND';
    var prefix = Object.assign({}, _state.filters);
    if (_state.filters.discipline) {
      prefix = Object.assign({}, _state.filters, {
        discipline: firstClause + ' ' + disciplinePrefix + ' \'' + _state.filters.discipline + '\'',
        funding_round: _state.filters.funding_round && secondClause + ' ' + fundingPrefix + ' \'' + _state.filters.funding_round + '\''
      });
    }
    if (!_state.filters.discipline && _state.filters.funding_round) {
      prefix = Object.assign({}, _state.filters, {
        funding_round: firstClause + ' ' + fundingPrefix + ' \'' + _state.filters.funding_round + '\''
      });
    }
    return prefix;
  }

  function devTools(type, payload, prevState) {
    if (_env === 'debug') console.info(type, { payload: payload, state: _state, prevState: prevState });
  }

  // Parsers
  function parseGenderPieChartData(res) {
    return res.rows
      .map(function (row) {
        return {
          name: row.gender === 'M' ? 'man' : 'woman',
          y: row.count,
          color: row.gender === 'M' ? '#4cc9a0' : '#435caf'
        };
      });
  }

  function parseResearchersLineChartData(res) {
    return {
      yearStart: res.rows[0] ? res.rows[0].year : [],
      yearCount: res.rows.map(function (row) {
        return row.count;
      })
    };
  }

  function parseResearcherTypeDonutChartData(res) {
    var colors = ['#4cc9a0', '#74ebc3', '#b3c3f9', '#7e93d7', '#435caf'];
    return res.rows
      .map(function (row, i) {
        return {
          name: RESEARCHER_TYPES[row.researcher],
          y: row.count,
          color: colors[i]
        }
      });
  }

  function parsePapersByYearBarChartData(res) {
    return {
      columns: res.rows.map(function (row) {
        return [row.year, row.count];
      })
    };
  }

  function parseInstitutesVisitedTreeChartData(res) {
    var apiData = {};
    apiData.institutesCount = res.rows.map(function (row) {
      return {
        name: INSTITUTES[row.institute_id],
        value: row.count,
        colorValue: row.count
      };
    });
    return apiData;
  }

  function parseResearchersSankeyChartData(res) {
    var rootColor = '#09112d';
    var linkColor = '#7e8fc8';
    var selectedCountry = getSelectedCountry();
    var instituteLinks = _.values(res.rows.map(function (row) {
        return {
          name: INSTITUTES[row.inst_id],
          parent: selectedCountry,
          value: row.counts,
          level: linkColor
        };
      })
      .reduce(function (acc, next) {
        var institute = {};
        institute[next.name] = acc[next.name] ?
          Object.assign({},
            acc[next.name],
            { value: next.value + acc[next.name].value })
          : next;
        return Object.assign({}, acc, institute);
      }, {}));
    var root = {
      name: selectedCountry && selectedCountry.label,
      parent: "null",
      level: rootColor,
      value: 0,
      children: instituteLinks
    };
    return { tree: root };
  }

  function parseDynamicSentenceData(res) {
    var country = _state.filters.iso && getSelectedCountry();
    var data = Object.assign(res.rows[0], { verb: country ? 'and was' : 'were' });
    var sentence = _.template('<strong> <%= total_visitors %> </strong>' +
      '  <% if (total_visitors > 1) print ("visitors"); else print("visitor") %>,' +
      ' from <strong><%= institutes %> </strong>' +
      ' <% if (institutes > 1) print ("institutes"); else print("institute") %>,' +
      ' <%= verb %> granted a total of' +
      ' <strong> <%= days %> </strong> research' +
      ' <% if (days > 1) print ("days"); else print("day") %>.');
    if (country) return country.label + ' had' + sentence(data);
    return sentence(data);
  }

  function parseDisciplineBubbleChartData(res) {
    return {
      name: 'Root',
      children: res.rows.map(function (row) {
        return { name: row.discipline, size: row.count }
      })
    }
  }

  function parseChoroplethMapChartData(polygons) {
    var domain = polygons.map(function (polygon) { return polygon.properties.count });
    var colors = ['#6f93f1', '#3751b4', '#2c46b7', '#1c2c8c', '#142672'];
    var getColor = d3.scale.quantile()
      .domain(domain)
      .range(colors);
    return polygons.map(function (polygon) {
      return Object.assign({}, polygon, { color: getColor(polygon.properties.count)});
    });
  }

}());
