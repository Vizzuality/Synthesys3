var choroplethCountryQuery = _.template('WITH gadm28 as (select the_geom_webmercator FROM gadm28_adm1 WHERE iso = \'<%= iso %>\')' +
  ' SELECT gadm28.the_geom_webmercator, count(synthesys.home_insti)' +
  ' FROM  sanitized_data as synthesys, gadm28' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  ' GROUP BY gadm28.the_geom_webmercator'
);

var choroplethQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 as iso FROM  gadm28_countries)' +
  'SELECT gadm28.the_geom_webmercator, gadm28.iso, COUNT(synthesys.home_insti) AS count' +
  'FROM  sanitized_data AS synthesys, gadm28' +
  'WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  'and synthesys.discipline <%= discipline %> ' +
  'AND synthesys.synth_roun = <%= funding_round %>' +
  'GROUP BY gadm28.the_geom_webmercator, gadm28.iso'
);

var genderCountryPieChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')' +
  ' SELECT synthesys.gender, count(*)' +
  ' FROM  sanitized_data as synthesys, gadm28' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.gender'
);

var genderPieChartQuery = _.template('SELECT gender, count(synthesys.gender)' +
  ' FROM  sanitized_data as synthesys' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.gender'
);

var disciplineCountryBubbleChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')' +
  ' SELECT synthesys.discipline, count(*)' +
  ' FROM  sanitized_data as synthesys, gadm28' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  ' AND synthesys.discipline IS NOT null' +
  ' GROUP BY synthesys.discipline' +
  ' ORDER BY count DESC'
);

var disciplineBubbleChartQuery = _.template('SELECT synthesys.discipline, count(*)' +
  ' FROM sanitized_data AS synthesys' +
  ' WHERE synthesys.discipline IS NOT null' +
  ' AND synthesys.synth_roun = <%= funding_round %> ' +
  ' GROUP BY synthesys.discipline' +
  ' ORDER BY count DESC'
);

var researchersCountryLineChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')' +
  ' SELECT synthesys.start_year AS year, count(*)' +
  ' FROM sanitized_data AS synthesys, gadm28' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  ' AND synthesys.start_year IS NOT null' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.start_year' +
  ' ORDER BY synthesys.start_year ASC'
);

var researchersLineChartQuery = _.template('SELECT synthesys.start_year AS year, count(*)' +
  ' FROM sanitized_data AS synthesys' +
  ' WHERE synthesys.start_year IS NOT null' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.start_year' +
  ' ORDER BY synthesys.start_year ASC'
);

var researcherCountryDonutChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')' +
  ' SELECT synthesys.researcher AS year, count(*)' +
  ' FROM sanitized_data AS synthesys, gadm28' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  ' AND synthesys.researcher IS NOT null' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.researcher' +
  ' ORDER BY synthesys.count DESC'
);

var researcherDonutChartQuery = _.template('SELECT synthesys.researcher, count(*)' +
  ' FROM sanitized_data AS synthesys' +
  ' WHERE synthesys.researcher IS NOT null' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.researcher' +
  ' ORDER BY synthesys.count ASC'
);

var institutesVisitedCountryTreeChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')' +
  ' SELECT synthesys.inst_id AS institute_id, count(*)' +
  ' FROM sanitized_data AS synthesys, gadm28' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  ' AND synthesys.inst_short IS NOT null' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.inst_id' +
  ' ORDER BY synthesys.count DESC'
);

var institutesVisitedTreeChartQuery = _.template('SELECT synthesys.inst_id AS institute_id, count(*)' +
  ' FROM sanitized_data AS synthesys' +
  ' WHERE synthesys.inst_short IS NOT null' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.inst_id' +
  ' ORDER BY synthesys.count DESC'
);

var papersPerYearCountryBarChartQuery = _.template('SELECT year, count(title)' +
  ' FROM publications' +
  ' WHERE iso = \'<%= iso %>\'' +
  ' AND publicationstatus = \'Published\'' +
  ' AND year != \'1914\'' +
  ' AND year != \'1990\'' +
  ' And year != \'201\'' +
  ' And year != \'no_data\'' +
  ' GROUP BY year' +
  ' ORDER BY year'
);

var papersPerYearBarChartQuery = _.template('SELECT year, count(title)' +
  ' FROM publications' +
  ' WHERE publicationstatus = \'Published\'' +
  ' AND year != \'1914\'' +
  ' AND year != \'1990\'' +
  ' AND year != \'201\'' +
  ' AND year != \'no_data\'' +
  ' <%= discipline %>' +
  ' GROUP BY year' +
  ' ORDER BY year'
);


var dynamicSentenceCountryQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')' +
  ' SELECT COUNT(DISTINCT(synthesys.home_insti)) as institutes,' +
  ' COUNT(synthesys.visit_days) AS total_visitors,' +
  ' SUM(synthesys.visit_days) AS days' +
  ' FROM sanitized_data AS synthesys, gadm28' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' AND synthesys.visit_days IS NOT null'
);

var dynamicSenteceQuery = _.template('SELECT COUNT(DISTINCT(synthesys.home_insti)) as institutes,' +
  ' COUNT(synthesys.visit_days) AS total_visitors,' +
  ' SUM(synthesys.visit_days) AS days' +
  ' FROM sanitized_data AS synthesys' +
  ' WHERE synthesys.visit_days IS NOT null' +
  ' <%= discipline %>' +
  ' <%= funding_round %>'
);

var researchersSankeyChartQuery = _.template('with gadm28 as (SELECT the_geom_webmercator, iso, name_1 FROM  gadm28_adm1 WHERE iso = \'<%= iso %>\')' +
  ' SELECT gadm28.name_1, COUNT(synthesys.home_insti) as counts, synthesys.inst_id' +
  ' FROM  sanitized_data as synthesys, gadm28' +
  ' where ST_Intersects(  gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)' +
  ' GROUP BY gadm28.name_1, inst_id' +
  ' ORDER BY inst_id'
);

// TODO Publication Tables