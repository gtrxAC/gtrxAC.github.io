#!/bin/sh

# Ask where to install
echo "Press ENTER to download to: ${PWD}"
echo "A new directory called AssaultCube_v1.2.0.2 will be created there."
echo "If you want to use a different directory, press Ctrl+C, change to the directory with cd, and ."
read acinstalldir
if ["$acinstalldir" = ""]; then acinstalldir=$PWD; fi

# Download
curl -L https://github.com/assaultcube/AC/releases/download/v1.2.0.2/AssaultCube_v1.2.0.2.tar.bz2 -o ${acinstalldir}/AC.tar.bz2

# Unpack
tar -xvjf ${acinstalldir}/AC.tar.bz2

# Allow execution
acinstalldir=${acinstalldir}/AssaultCube_v1.2.0.2
cd $acinstalldir
chmod +x bin_unix/linux_64_client
chmod +x assaultcube.sh

# Ask to create a desktop entry
echo ""
echo ""
echo "Press ENTER to add AssaultCube to your applications menu (recommended)."
echo "If you don't want to do this, press n and ENTER."
read c

# Create a desktop entry if requested
if [ "$c" != "n" ]
then
	# Download the logo used for the entry
	appdir=~/.local/share/applications/assaultcube.desktop
	echo "[Desktop Entry]" > $appdir
	echo "Version=1.0" >> $appdir
	echo "Type=Application" >> $appdir
	echo "Name=AssaultCube" >> $appdir
	echo "Comment=Realistic first-person-shooter" >> $appdir
	echo "Exec=${acinstalldir}/assaultcube.sh" >> $appdir
	echo "Icon=${acinstalldir}/docs/images/icon.png" >> $appdir
	echo "Path=${acinstalldir}" >> $appdir
	echo "Categories=Game;" >> $appdir
	chmod +x $appdir
fi

echo ""
echo ""
echo "Installed successfully! Do you want to launch AssaultCube now?"
echo "Press ENTER to launch or close this window."
read c

exec ${acinstalldir}/assaultcube.sh
