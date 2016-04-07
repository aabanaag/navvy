#!/bin/sh

# v0.1
# Mazda Philippines
# Creator: WunderkindTech Solutions
# Date Modified: 03/11/2016
# =================================
#
# Purpose: Run OSRM Extract service
#
# CHANGELOG:

ROOT='/tmp/mnt/data_persist/dev/navvy/osrm'

RAW_OSM_DATA='/jci/apps/emnavi/controls/Compass/resources/map/philippines.osm.pbf'
EXTRACTED_OSM_DATA='/jci/apps/emnavi/controls/Compass/resources/map/philippines.osrm'
if [ -f $ROOT ] && [ -f $RAW_OSM_DATA ] && [ ! -f $EXTRACTED_OSM_DATA ]; then
  cd ${ROOT}
  ./osrm-extract ${RAW_OSM_DATA}
fi
