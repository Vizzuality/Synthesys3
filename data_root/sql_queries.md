## Synthesis3 examples

##### Query examples from which to build the Synthesis 3 widgets.

```sql
SELECT gadm28.cartodb_id,gadm28.the_geom_webmercator, gadm28.the_geom, gadm28.iso, count(synthesys.home_insti)
FROM gadm28_adm1 as gadm28 , sanitized_new_data as synthesys
where ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator) group by gadm28.cartodb_id, gadm28.the_geom, gadm28.the_geom_webmercator,gadm28.iso
```

The below shows how to join all polygons of a single country together (union) and then apply that polygon to the synthesys data to obtain a country-wide count.

```sql
with gadm28 as (select st_union(the_geom_webmercator) from  gadm28_adm1 where iso='ESP')


SELECT *
FROM  sanitized_new_data as synthesys
where ST_Intersects( synthesys.the_geom_webmercator, (select * from gadm28))  
```

## Admin-level 1 choropleth for a single country

The below can create a choropleth within a country.

```sql
with gadm28 as (select the_geom_webmercator from  gadm28_adm1 where iso='ESP')

SELECT gadm28.the_geom_webmercator, count(synthesys.home_insti)
FROM  sanitized_new_data as synthesys, gadm28
where ST_Intersects(  gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)
group by gadm28.the_geom_webmercator
```

If you need to show the admin1 choropleth with filters by discipline the following may be added. (Note, this isn't called for in the first designs, however I am putting it in here incase of scope creep as it is a simple extension of the earlier query.)

```sql
with gadm28 as (select the_geom_webmercator from  gadm28_adm1 where iso='ESP')

SELECT gadm28.the_geom_webmercator, count(synthesys.home_insti)
FROM  sanitized_new_data as synthesys, gadm28
where ST_Intersects(  gadm28.the_geom_webmercator, synthesys.the_geom_webmercator) and discipline like  'Earth Sciences & Environment'
group by gadm28.the_geom_webmercator
```


### National level Choropleth (counts over all countries)

The below shows how to call the GADM28_COUNTRIES table to plot the count per country with no filters applied.

```sql
WITH gadm28 AS (SELECT the_geom_webmercator, iso2 as iso FROM  gadm28_countries)
 SELECT gadm28.the_geom_webmercator, gadm28.iso, COUNT(synthesys.home_insti) AS count
 FROM  sanitized_new_data AS synthesys, gadm28
 WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)
 GROUP BY gadm28.the_geom_webmercator, gadm28.iso

```

The two filters which may be added to the above (counts by country choropleth) will be either filters by discipline or by funding round:

e.g. by discipline:
```sql
WITH gadm28 AS (SELECT the_geom_webmercator, iso2 as iso FROM  gadm28_countries)
 SELECT gadm28.the_geom_webmercator, gadm28.iso, COUNT(synthesys.home_insti) AS count
 FROM  sanitized_data AS synthesys, gadm28
 WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)
 and synthesys.discipline like 'Earth Sciences & Environment'
 GROUP BY gadm28.the_geom_webmercator, gadm28.iso
```

e.g. by funding round:
```sql
WITH gadm28 AS (SELECT the_geom_webmercator, iso2 as iso FROM  gadm28_countries)
 SELECT gadm28.the_geom_webmercator, gadm28.iso, COUNT(synthesys.home_insti) AS count
 FROM  sanitized_data AS synthesys, gadm28
 WHERE ST_Intersects(gadm28.the_geom_webmercator, synthesys.the_geom_webmercator)
 and synthesys.funding_ro like 'R1'
 GROUP BY gadm28.the_geom_webmercator, gadm28.iso
```


## widgets
#### Gender donut chart
* No filter

```sql
SELECT gender, count(*) FROM sanitized_new_data group by gender
```

* Filter by discipline

```sql
SELECT gender, count(synthesys.gender)
FROM  sanitized_data as synthesys
where discipline like  'Earth Sciences & Environment'
group by synthesys.gender
```

* Filter by funding round

```sql
SELECT gender, count(synthesys.gender)
FROM  sanitized_data as synthesys
where funding_ro like  'R1'
group by synthesys.gender
```


* Filter by Country

```sql
with gadm28 as (select the_geom_webmercator, iso2 as iso from  gadm28_countries where iso2='ES')

SELECT gender, count(synthesys.gender)
FROM  sanitized_data as synthesys, gadm28
where ST_Intersects(  gadm28.the_geom_webmercator, synthesys.the_geom_webmercator) and discipline like  'Earth Sciences & Environment'
group by synthesys.gender
```
