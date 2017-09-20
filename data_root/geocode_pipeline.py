import pandas as pd
import json
import numpy as np
import geocoder
from shapely.geometry import Point
from tqdm import tqdm
import geopandas as gpd
import time

# Read your dataset and a mapping of bad to good locations
df = pd.read_csv("./Data/FullExportAnon_v4.csv", encoding="mac_cyrillic")

with open('./Data/master_clean.json','r') as f:
    known_errors = json.load(f)

# Define a function to geocode
def search_location(place):
    """
    Use Geopy to geocode an address string  https://github.com/geopy/geopy
    """
    g = geocoder.google(place)
    return g.geojson

# Before starting, clean out nan entries from the dataframe and replace them
# with nil locations
nan_mask = []
for n, item in enumerate(df['User_NHM.Home_Institution_Name'].values):
    if item != item:
        print(n, item)
        nan_mask.append(n)
df['User_NHM.Home_Institution_Name'][nan_mask] = 'nil'

# Now create a list of good (geocodeable places)
original_places = list(df['User_NHM.Home_Institution_Name'].values)

good_ones = []
for k in known_errors:
    good_ones.append(known_errors[k])

clean_items = []

for item in original_places:
    if item in known_errors:
        clean_items.append(known_errors[item])
    else:
        clean_items.append(item)

# Now geocode these data
geo_points = {}  # a dictionary mapped to set of clean items (780 uniques)
attempt = 0
while len(geo_points) < len(set(clean_items)):  # unique locations (-1 is for nan loci)
    badly_coded = []
    for site in tqdm(set(clean_items)):
        if site not in geo_points:
            attempts = 0
            sucsess = False
            r = {}
            # Try three times to get a geocode for a site
            while sucsess != True and attempts < 3:
                try:
                    r = search_location(site)
                except:
                    r = {}
                    coordinates = False
                attempts += 1
                status = r.get('properties',{}).get('status',False)
                if status == "OVER_QUERY_LIMIT":
                    #print(f"{site}: attempt {attempts} - {status}")
                    time.sleep(3) # if we hit Q limit, have a break for a few secs...
            coordinates = r.get('geometry',{}).get('coordinates', False)
            if coordinates:
                #lat_lng = (r.get('properties').get('lat'), r.get('properties').get('lng'))
                #p = Point(lat_lng)
                p = Point(coordinates)
                geo_points[site]=p
            else:
                badly_coded.append(site)
    attempt += 1
    print(f"badly coded={len(badly_coded)}")

# Next we need to identify the COUNTRY ISO and ADMIN1 CODE for each geolocation
# based on gadm28_admin1 shapefile.
# be careful to handle the nil/nan entries.


table_subset = []
for n, row in enumerate(df.iterrows()):
    home_inst = clean_items[n]
    if home_inst != 'nil':  # Dont code the home institute
        gender = row[1][3]
        researcher_status = row[1][4]
        funding_round = row[1][26]
        start_year = row[1][14]
        visit_days = row[1][18]
        discipline = row[1][10]
        synth_round = row[1][26]
        inst_short_name = row[1][24]
        table_subset.append([home_inst, gender, researcher_status, start_year, discipline,
                             visit_days, funding_round, inst_short_name, synth_round])
        
tmp_frame = pd.DataFrame(table_subset,columns=['home_institute','gender','researcher_status', 'start_year',
                                       'discipline','visit_days','funding_round','inst_short_name','synth_round'])

glist = []
for place in tmp_frame['home_institute'].values:
    if place in geo_points:
        glist.append(geo_points[place])
    else:
        print(f"ERROR: not found {place}")

# table_subset
gdf = gpd.GeoDataFrame(tmp_frame,columns=['home_institute','gender','researcher_status', 'start_year',
                                       'discipline','visit_days','funding_round','inst_short_name','synth_round'],
                 geometry=glist, crs={'proj':'longlat', 'ellps':'WGS84', 'datum':'WGS84'})
        

nilmask = gdf['home_institute'] != "nil"
gdf = gdf[nilmask]

gdf.to_file('./sanitized_data.shp', driver='ESRI Shapefile')