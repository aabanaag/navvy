#!/bin/sh

# v0.1
# Mazda Philippines
# Creator: WunderkindTech Solutions
# Date Modified: 03/11/2016
# =================================
#
# Purpose: Uninstall Navvy via USB

version='v0.1'

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

emnavi='/jci/gui/apps/emnavi.bak'
if [ -f $emnavi ]; then
  rm -rf /jci/gui/apps/emnavi
  mv /jci/gui/apps/emnavi.bak /jci/gui/apps/emnavi
else
  cp -a files/emnavi /jci/gui/apps/emnavi
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

/jci/tools/jci-dialog --title="Mazda Philippines" --text="Navvy Uninstall Complete" --ok-label='OK' --no-cancel &
