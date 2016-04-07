#!/bin/sh

# v0.1
# Mazda Philippines
# Creator: WunderkindTech Solutions
# Date Modified: 02/21/2016
# =================================
#

hc=$(hwclock)
hcyr=${hc:20:4}
syr=$(date +'%Y')

if [ $syr == 1970 ] && [ $hcyr == 1970 ]; then
  date -s "2016-04-07 01:00:00"
else
  hwclock -s
fi

websocketd --port=9999 sh &
