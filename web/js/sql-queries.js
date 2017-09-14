var admin1ChoroplethQuery = _.template('WITH gadm28 as (select the_geom_webmercator FROM gadm28_adm1 WHERE iso = \'<%= iso %>\')\n' +
  ' SELECT gadm28.the_geom_webmercator, count(synthesys.home_insti)\n' +
  ' FROM  sanitized_data as synthesys, gadm28\n' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)\n' +
  ' GROUP BY gadm28.the_geom_webmercator'
);

var countryChorplethQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 as iso FROM  gadm28_countries)\n' +
  'SELECT gadm28.the_geom_webmercator, gadm28.iso, COUNT(synthesys.home_insti) AS count\n' +
  'FROM  sanitized_data AS synthesys, gadm28\n' +
  'WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)\n' +
  'and synthesys.discipline <%= discipline %> \n' +
  'AND synthesys.synth_roun = <%= funding_round %>' +
  'GROUP BY gadm28.the_geom_webmercator, gadm28.iso'
);

var genderCountryPieChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')\n' +
  ' SELECT synthesys.gender, count(*)\n' +
  ' FROM  sanitized_data as synthesys, gadm28\n' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.gender'
);

var genderPieChartQuery = _.template('SELECT gender, count(synthesys.gender)\n' +
  ' FROM  sanitized_data as synthesys\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.gender'
);

var disciplineCountryBubbleChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')\n' +
  ' SELECT synthesys.discipline, count(*)\n' +
  ' FROM  sanitized_data as synthesys, gadm28\n' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)\n' +
  ' AND synthesys.discipline IS NOT null\n' +
  ' GROUP BY synthesys.discipline\n' +
  ' ORDER BY count DESC'
);

var disciplineBubbleChartQuery = _.template('SELECT synthesys.discipline, count(*)\n' +
  ' FROM sanitized_data AS synthesys\n' +
  ' WHERE synthesys.discipline IS NOT null\n' +
  ' AND synthesys.synth_roun = <%= funding_round %> \n' +
  ' GROUP BY synthesys.discipline\n' +
  ' ORDER BY count DESC'
);

var researchersCountryBarChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')\n' +
  ' SELECT synthesys.start_year AS year, count(*)\n' +
  ' FROM sanitized_data AS synthesys, gadm28\n' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)\n' +
  ' AND synthesys.start_year IS NOT null\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.start_year\n' +
  ' ORDER BY synthesys.start_year ASC'
);

var researchersBarChartQuery = _.template('SELECT synthesys.start_year AS year, count(*)\n' +
  ' FROM sanitized_data AS synthesys\n' +
  ' WHERE synthesys.start_year IS NOT null\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.start_year\n' +
  ' ORDER BY synthesys.start_year ASC'
);

var researcherCountryDonutChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')\n' +
  ' SELECT synthesys.researcher AS year, count(*)\n' +
  ' FROM sanitized_data AS synthesys, gadm28\n' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)\n' +
  ' AND synthesys.researcher IS NOT null\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.researcher\n' +
  ' ORDER BY synthesys.count DESC'
);

var researcherDonutChartQuery = _.template('SELECT synthesys.researcher, count(*)\n' +
  ' FROM sanitized_data AS synthesys\n' +
  ' WHERE synthesys.researcher IS NOT null\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.researcher\n' +
  ' ORDER BY synthesys.count ASC'
);

var institutesVisitedCountryTreeChartQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')\n' +
  ' SELECT synthesys.inst_id AS institute_id, count(*)\n' +
  ' FROM sanitized_data AS synthesys, gadm28\n' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)\n' +
  ' AND synthesys.inst_short IS NOT null\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.inst_id\n' +
  ' ORDER BY synthesys.count DESC'
);

var institutesVisitedTreeChartQuery = _.template('SELECT synthesys.inst_id AS institute_id, count(*)\n' +
  ' FROM sanitized_data AS synthesys\n' +
  ' WHERE synthesys.inst_short IS NOT null\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' GROUP BY synthesys.inst_id\n' +
  ' ORDER BY synthesys.count DESC'
);

var dynamicSentenceCountryQuery = _.template('WITH gadm28 AS (SELECT the_geom_webmercator, iso2 FROM  gadm28_countries WHERE iso2 = \'<%= iso2 %>\')\n' +
  ' SELECT COUNT(DISTINCT(synthesys.home_insti)) as institutes,\n' +
  ' COUNT(synthesys.visit_days) AS total_visitors,\n' +
  ' SUM(synthesys.visit_days) AS days\n' +
  ' FROM sanitized_data AS synthesys, gadm28\n' +
  ' WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>' +
  ' AND synthesys.visit_days IS NOT null'
);

var dynamicSenteceQuery = _.template('SELECT COUNT(DISTINCT(synthesys.home_insti)) as institutes,\n' +
  ' COUNT(synthesys.visit_days) AS total_visitors,\n' +
  ' SUM(synthesys.visit_days) AS days\n' +
  ' FROM sanitized_data AS synthesys\n' +
  ' WHERE synthesys.visit_days IS NOT null\n' +
  ' <%= discipline %>' +
  ' <%= funding_round %>'
);

// TODO Sankey

// TODO Publication Tables
