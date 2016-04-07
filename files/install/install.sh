#!/bin/sh

# v0.4
# Mazda Philippines
# Creator: WunderkindTech Solutions
# Date Modified: 03/11/2016
# =================================
#
# Purpose: Install Navvy via USB
#
# CHANGELOG:
# 3/11/16 - Initial
# 3/14/16 - Add deleted controls&templates [Fix for Emnavi Navteq bug]
# 3/23/16 - Remove fps.js
# 4/07/16 - Add OSRM-Backend service

# ALLOW READ | WRITE COMMANDS
mount -o rw,remount /

# Check if sm.conf.bak exist if not then proceed with backup
# Disable watchdog to avoid reboot loops
sm='/jci/sm/sm.conf.bak'
if [ ! -f $sm ]; then
  cp -a /jci/sm/sm.conf /jci/sm/sm.conf.bak

  sed -i 's/watchdog_enable="true"/watchdog_enable="false"/g' /jci/sm/sm.conf
  sed -i 's|args="-u /jci/gui/index.html"|args="-u /jci/gui/index.html --noWatchdogs"|g' /jci/sm/sm.conf
fi

# Check if opera.ini.bak exist if not then proceed with backup
# Edit Opera.ini then Edit to allow userjs and XMLHttpRequest
opera='/jci/opera/opera_home/opera.ini.bak'
if [ ! -f $opera ]; then
  cp -a /jci/opera/opera_home/opera.ini /jci/opera/opera_home/opera.ini.bak
  # edit now
  sed -i 's/User JavaScript=0/User JavaScript=1/g' /jci/opera/opera_home/opera.ini
  count=$(grep -c "Allow File XMLHttpRequest=" /jci/opera/opera_home/opera.ini)
  if [ "$count" = "0" ]; then
      sed -i '/User JavaScript=.*/a Allow File XMLHttpRequest=1' /jci/opera/opera_home/opera.ini
  else
      sed -i 's/Allow File XMLHttpRequest=.*/Allow File XMLHttpRequest=1/g' /jci/opera/opera_home/opera.ini
  fi
fi

# Check if fps.js.bak and stage_wifi.sh.bak exist if not then proceed with backup
fps='/jci/opera/opera_dir/userjs/fps.js.bak'
if [ ! -f $fps ]; then
  mv /jci/opera/opera_dir/userjs/fps.js /jci/opera/opera_dir/userjs/fps.js.bak
fi

emnavi='/jci/gui/apps/emnavi.bak'
if [ ! -f $emnavi ]; then
  mv /jci/gui/apps/emnavi /jci/gui/apps/emnavi.bak
fi

stage_wifi='/jci/scripts/stage_wifi.sh.bak'
navvy_route='/jci/scripts/navvy_route.sh.bak'
navvy_extract='/jci/scripts/navvy_extract.sh.bak'
if [ ! -f $stage_wifi ] && [ ! -f $navvy_route ] && [ ! -f $navvy_extract ]; then
  mv /jci/scripts/stage_wifi.sh /jci/scripts/stage_wifi.sh.bak
  mv /jci/scripts/navvy_route.sh /jci/scripts/navvy_route.sh.bak
  mv /jci/scripts/navvy_extract.sh /jci/scripts/navvy_extract.sh.bak
fi

for USB in a b c d e
do
	INSTALLSH=/tmp/mnt/sd${USB}1
	if [ -e "${INSTALLSH}/install.sh" ]
	then
		cd ${INSTALLSH}
		break
	fi
done


cp -a files/emnavi /jci/gui/apps/emnavi
cp -a files/resources/* /tmp/mnt/data_persist/dev/
cp -a files/scripts/* /jci/scripts

ln -s /tmp/mnt/sd_nav/ /jci/gui/apps/emnavi/controls/Compass/resources

chmod 755 /jci/gui/apps/emnavi/controls/Compass/resources/*
chmod 755 /tmp/mnt/data_persist/dev/navvy/bin/websocketd
chmod 755 /tmp/mnt/data_persist/dev/navvy/osrm

/jci/tools/jci-dialog --title="Mazda Philippines" --text="Navvy v0.4 Install Complete" --ok-label='OK' --no-cancel &
