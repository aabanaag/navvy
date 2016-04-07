#!/bin/sh

# v0.2
# Mazda Philippines
# Creator: WunderkindTech Solutions
# Date Modified: 03/11/2016
# =================================
#
# Purpose: Run OSRM Route service
#
# CHANGELOG:

ROOT='/tmp/mnt/data_persist/dev/navvy/osrm'

EXTRACTED_OSM_DATA='/jci/gui/apps/emnavi/controls/Compass/resources/map/philippines-latest.osrm'
if [ -d $ROOT ] && [ -f $EXTRACTED_OSM_DATA ]; then
  cd ${ROOT}
  ./run-routed.sh ${EXTRACTED_OSM_DATA} -p 5001
fi
