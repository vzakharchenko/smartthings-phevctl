# Smartthings and SMS Remote control for Outlander PHEV
SMS and Smartthings application wrapper over phevctl
- [![Node.js CI](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/build.yml/badge.svg)](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/build.yml)
- [![docker](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/docker.yml/badge.svg)](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/docker.yml)
- [![NPM](https://nodei.co/npm/smartthings-phevctl.png)](https://npmjs.org/package/smartthings-phevctl)
- [![donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://secure.wayforpay.com/button/b7a954a7c7177)

![smartthings.gif](./img/smartthings.gif)
![smartthings.gif](./img/smartthings1.gif)
![Charger.png](./img/Charger.png)![doorLock.png](./img/doorLock.png)![](./img/message1.png)

## Features:
- [can work over sms without smartthings](https://github.com/vzakharchenko/smartthings-phevctl/wiki/SMSServiceWithoutSmartthings)
- [receive PHEV errors over SMS ](https://github.com/vzakharchenko/smartthings-phevctl/wiki/supportedSMSErrorCodes)
- [receive Theft Alarm Notifications (if the theft alarm is enabled in the ETACS ) ](https://github.com/vzakharchenko/smartthings-phevctl/wiki/supportedSMSErrorCodes#theft-alarm-codes)
- switch on/off condition/heater
- receive warning message from the remote EV and send it in push Notification.
- send Notification "Pre A/C has stopped. Possible causes of this are as follows: Door is Open. Main battery level is Low. Drive Battery temperature is Low."
- change mode of air conditioner: heater/cool/windscreen for 10/20/30 mins,
- show battery level
- support google home
- check if doors are closed
- Thermostat Operating State
- Support SMS if use mikrotik LTE
- [support wifi EVSE (Electric Vehicle (EV) Charging Stations)](#evse-electric-vehicle-ev-charging-stations)
- [SMS commands](https://github.com/vzakharchenko/smartthings-phevctl/wiki/supportedSMSCommands)


## comparison of installation types

| Installation Type                                                           | Execute action(heating/cooling/headlights and etc...)  | Smartthings Hub required | Internet connection required | can send/receive SMS | MikroTik LtAP mini LTE kit must be installed | Raspberry Pi must be installed | Send Push Notifications |
|-----------------------------------------------------------------------------|--------------------------------------------------------|----------------------|------------------------------|----------------------|----------------------------------------------|--------------------------------|-------------------------|
| Cloud Installation (run smartthings-phevctl on the cloud)                   | Immediately                                            | No                   | Yes                          | No                   | Yes                                          | No                             | Yes                     |
| Cloud Installation with rapberry Pi(Cloud is forwarded smartthings-phevctl) | Immediately                                            | No                   | No                           | Yes                  | Yes                                          | Yes                            | Yes                     |
| Сontrol over SMS without smartthings                                        | 1-2 minutes delay                                      | No                   | No                           | Yes                  | Yes                                          | Yes                            | No                     |
| Local Network Installation(under NAT)                                       | Immediately                                            | Yes                  | Yes                          | No                   | Yes                                          | No                             | Yes                     |
| Run without cloud and without Smartthings Hub                               | 2-5 minutes delay                                      | No                   | No                           | Yes                  | Yes                                          | Yes                            | Yes                     |



## Cloud Installation
- [cloud installation](https://github.com/vzakharchenko/remote-ctrl-gsm/blob/master/cloud/README.md)
- [hetzner cloud](https://github.com/vzakharchenko/remote-ctrl-gsm/wiki/gsm-extender-hetzner-cloud)
- [scaleway cloud](https://github.com/vzakharchenko/remote-ctrl-gsm/wiki/gsm-extender-scaleway-cloud)
## Without cloud installation
- [control over SMS without smartthings](https://github.com/vzakharchenko/smartthings-phevctl/wiki/SMSServiceWithoutSmartthings)
- [Local Network Installation(under NAT)](https://github.com/vzakharchenko/smartthings-phevctl#local-network-installationunder-nat)
- [Run without cloud and without Smartthings Hub](https://github.com/vzakharchenko/smartthings-phevctl#run-without-cloud-and-without-smartthings-hub)


## Outlander PHEV Registration
- First need to register your phone on the original application [Android](https://play.google.com/store/apps/details?id=com.inventec.iMobile2) or [Apple](https://apps.apple.com/ua/app/outlander-phev-remote-ctrl/id1107478931?l=ru) or (Modified application)[https://github.com/vzakharchenko/remote-ctrl-gsm]
- [start Smartthings-phevctl Server](https://github.com/vzakharchenko/smartthings-phevctl#installation-steps)
- open server and enter your phone mac.

## Installation Steps
1. [Install Server using Docker](https://github.com/vzakharchenko/smartthings-phevctl#server-docker-installation) or [raspberry Pi zero](https://github.com/vzakharchenko/smartthings-phevctl#raspberry-pi-zero-installation) or  [Manual Installation](https://github.com/vzakharchenko/smartthings-phevctl#server-manual-installation)
2. [create Device Handler](https://github.com/vzakharchenko/smartthings-phevctl#create-custom-dht)
3. [create smartapp](https://github.com/vzakharchenko/smartthings-phevctl#create-smartapp)
4. [Configure smartthings application on android or apple](https://github.com/vzakharchenko/smartthings-phevctl#configure-smartthings-application)
5. [Get "Smartthings Application Id" and "Smartthings Application Secret"](https://github.com/vzakharchenko/smartthings-phevctl#get-smartthings-application-id-and-smartthings-application-secret)
6. [Configure Server](https://github.com/vzakharchenko/smartthings-phevctl#configure-server)
7. [Add Smartthings devices](https://github.com/vzakharchenko/smartthings-phevctl#add-a-new-smartthings-device)

## Server Docker Installation
- Install docker
```
sudo su
curl -sSL https://get.docker.com | bash
usermod -aG docker $USER
```
- Supported Architectures: amd64,x86-64,arm64,ppc64le,arm/v7
```
docker -d run --name=smartthings-phevctl  -p 8080:8080 -p 8099:8099 -p 8098:8098 --restart=always vassio/smartthings-phevctl
```
or
```
echo "{}">/opt/remote-ctrl-gsm.json
docker -d run --name=smartthings-phevctl  -p 8080:8080 -p 8099:8099 -p 8098:8098 -v /opt/config/remote-ctrl-gsm.json:/opt/remote-ctrl-gsm.json --restart=always vassio/smartthings-phevctl
```

# Raspberry Pi Zero installation
1. Download [Raspberry Pi OS Lite](https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-os-32-bit)
2. write the Raspberry Pi OS image to the SD card using [balenaEtcher](https://www.balena.io/etcher/) or analog
3. [write empty "ssh" and wpa_supplicant.conf files on sdcard (boot) ](https://desertbot.io/blog/headless-pi-zero-w-wifi-setup-windows)
4. install phevctl, node and smartthings-phevctl
```
sudo su
apt-get upgrade -y && apt-get -y install build-essential cmake git python3-distutils
mkdir /opt/phevctl
cd /opt/phevctl && git clone https://github.com/papawattu/msg-core
cd /opt/phevctl &&  git clone https://github.com/vzakharchenko/phevcore.git
cd /opt/phevctl && git clone https://github.com/DaveGamble/cJSON.git
cd /opt/phevctl && git clone https://github.com/vzakharchenko/phevctl
cd /opt/phevctl/cJSON && mkdir build && cd build && cmake .. && make && make install
cd /opt/phevctl/msg-core && mkdir build && cd build && cmake .. && make && make install
cd /opt/phevctl/phevcore && mkdir build && cd build && cmake .. && make && make install
cd /opt/phevctl/phevctl && mkdir -p build && cd build && cmake .. && make
rm -f /usr/bin/phevctl
ln -sf /opt/phevctl/phevctl/build/phevctl /usr/bin/phevctl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
source ~/.bashrc
nvm install --lts
# You can go drink coffee)
npm i pm2 -g
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp ${HOME}
pm2 startup -u root
npm i smartthings-phevctl -g
pm2 start `npm root -g`/smartthings-phevctl/smartthings-phevctl.js
pm2 save
```

## Server Manual Installation
```
sudo su
apt-get upgrade -y && apt-get -y install build-essential cmake git
mkdir /opt/phevctl
cd /opt/phevctl && git clone https://github.com/papawattu/msg-core
cd /opt/phevctl &&  git clone https://github.com/vzakharchenko/phevcore.git
cd /opt/phevctl && git clone https://github.com/DaveGamble/cJSON.git
cd /opt/phevctl && git clone https://github.com/vzakharchenko/phevctl
cd /opt/phevctl/cJSON && mkdir build && cd build && cmake .. && make && make install
cd /opt/phevctl/msg-core && mkdir build && cd build && cmake .. && make && make install
cd /opt/phevctl/phevcore && mkdir build && cd build && cmake .. && make && make install
cd /opt/phevctl/phevctl && mkdir -p build && cd build && cmake .. && make
rm -f /usr/bin/phevctl
wget -qO- https://getpm2.com/install.sh | bash
env PATH=$PATH:/usr/bin pm2 startup systemd -u ${currentUser} --hp ${HOME}
npm i smartthings-phevctl -g
pm2 start `npm root -g`/smartthings-phevctl/smartthings-phevctl.js
pm2 save
```


## Smartthings installation

### Create Custom DHT
1. open [https://graph.api.smartthings.com/](https://graph.api.smartthings.com/)
2. open your location/ or create a new one ![](./img/dht1.png)
3. open "My Device Handler" and "create New Device Handler"![](./img/dht2.png)
4. select from code and add [Outlander PHEV Action.groovy](./dht/Outlander PHEV Action.groovy), [Outlander PHEV Battery.groovy](./dht/Outlander PHEV Battery.groovy), [Outlander PHEV Thermostat.groovy](./dht/Outlander PHEV Thermostat.groovy) and [Outlander PHEV Doors.groovy](./dht/Outlander PHEV Doors.groovy) ![](./img/dht3.png)
5. click save

### Create SmartApp
1. open [https://graph.api.smartthings.com/](https://graph.api.smartthings.com/)
2. open your location ![](./img/dht1.png)
3. create a new SmartApp ![](./img/smartapp1.png)
4. select from code and add [remote-ctrl-gsm.groovy](./smartapp/remote-ctrl-gsm.groovy)  ![](./img/smartapp2.png)
5. open smartapp application and click "App Settings"  ![](./img/smartapp3.png) ![](./img/smartapp4.png)
6. enable "OAuth" ![](./img/smartapp5.png)
7. Save and publish application  ![](./img/smartapp6.png)

### Configure Smartthings application

1. open smartthings application in Phone [Android](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect) or [Apple](https://apps.apple.com/us/app/smartthings/id1222822904)
2. select location ![](./img/smartthings1.png)
3. add SmartApp ![](./img/smartthings2.png)
4. add "remote-ctrl-gsm" ![](./img/smartthings3.png)
5. set IP and port of server and click save ![](./img/smartthings4.png)

### Get "Smartthings Application Id" and "Smartthings Application Secret"
1. open [https://graph.api.smartthings.com/](https://graph.api.smartthings.com/)
2. select smartapps in your location ![](./img/smartapp7.png)
3. select your smartapp ![](./img/smartapp8.png)
4. get "Smartthings Application Id" and "Smartthings Application Secret" from the page ![](./img/smartapp9.png)

### Configure Server

1. open server ```http://<IP>:8080```
2. default login/password: admin/admin
3. configure "Smartthings Application Id", "Smartthings Application Secret" and mac address ![](./img/settings.png)
4. click save

### Add a new Smartthings device
1. select devices->add Device ![](./img/addDevice.png)
2. Device will be appear om Smartthings App

## Local Network Installation(under NAT)
- install [Smartthings Hub)[https://www.samsung.com/us/smart-home/smartthings/hubs/] on location.
- during installation smartapp select hub. ![](./img/smartapp10.png)

## Run without cloud and without Smartthings Hub
- [Configure Smartthings application without cloud and hub](https://github.com/vzakharchenko/smartthings-phevctl#configure-smartthings-application)
- during installation smartapp select "Setup my devices without cloud". ![](./img/nocloud.png)

# Authentication
## Local authentication (default)
default login/password: ```admin/admin```
### change password for user
![](./img/users1.png)

### add a new User
![](./img/users2.png)

## Keycloak authentication

![](./img/keycloak.png)

restart Application
## Keycloak authorization
![](./img/authorization.png)
restart Application
## Thermostat operation state
![](./img/thermo1.png)
![](./img/thermo2.png)
![](./img/thermo3.png)


## Push Notification
![](./img/message3.png)
![](./img/message1.png)
![](./img/message2.png)

# EVSE Electric Vehicle (EV) Charging Stations

## Scripts for [energy star charging stations](https://energy-star.com.ua/)
![](./img/pr2-large.jpg)

- Slow charging(slowCharge.sh)
```
curl --header "application/x-www-form-urlencoded"   --request POST   --data 'cur_set=7&charge_start=1&adaptive_mode_status=1&adaptive_mode_voltage=220&timer=0&timer_start=0'   http://192.168.4.1/ajax
```
- Normal charging(fastCharge.sh)

```
curl --header "application/x-www-form-urlencoded"   --request POST   --data 'cur_set=16&charge_start=1&adaptive_mode_status=0&adaptive_mode_voltage=220&timer=0&timer_start=0'   http://192.168.4.1/ajax
```
- Disable charging(disableCharge.sh)

```
curl --header "application/x-www-form-urlencoded"   --request POST   --data 'cur_set=7&charge_start=0&adaptive_mode_status=1&adaptive_mode_voltage=220&timer=0&timer_start=0'   http://192.168.4.1/ajax
```

- Mikrotik Configuration
```
/interface wireless security-profiles
add authentication-types=wpa2-psk group-ciphers=tkip mode=dynamic-keys name=EVSE supplicant-identity=MikroTik unicast-ciphers=tkip wpa-pre-shared-key=<EVSE_PASSWORD> wpa2-pre-shared-key=<EVSE_PASSWORD>
/interface wireless
set [ find default-name=wlan1 ] disabled=no frequency=2447 mode=station-pseudobridge name=EVSE_CHARGER security-profile=EVSE ssid=<EVSE_SSID>

/interface bridge
add dhcp-snooping=yes fast-forward=no igmp-snooping=yes name=bridgeEVSE
/interface bridge port
add bridge=bridgeEVSE broadcast-flood=no edge=no-discover interface=EVSE_CHARGER multicast-router=disabled trusted=yes unknown-multicast-flood=no unknown-unicast-flood=no
/interface bridge settings
set allow-fast-path=no

/ip dhcp-client
add add-default-route=no disabled=no interface=bridgeCar use-peer-dns=no use-peer-ntp=no
add add-default-route=no disabled=no interface=bridgeEVSE use-peer-dns=no use-peer-ntp=no
```

## add authorization for EVSE Charging

- start proxy application
```
npm i pm2 -g
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp ${HOME}
pm2 startup -u root
npm i smartthings-phevctl -g
pm2 start `npm root -g`/smartthings-phevctl/evse-proxy.js
pm2 save
```

- configure evse-proxy
```
nano ~/.remote-ctrl-gsm/config.json
```
```json
{
 "evseServer": {
  "/": "https://192.168.4.1",
  "style.css": "https://192.168.4.1/style.css",
  "es.js": "https://192.168.4.1/es.js",
  "ajax": "https://192.168.4.1/ajax"
 },
 "users": [
  {
   "id": "0",
   "username": "admin",
   "password": "admin"
  }
 ],
 "port": 8011,
 "role":"<KEYCLOAK_REALM>:<KEYCLOAK_CLIENT>"
}
```
- Keycloak authorization
example keycloak.json:
```
{
  "realm": "<REALM>",
  "auth-server-url": "https://<KEYCLOAK_URL>/auth/",
  "ssl-required": "external",
  "resource": "<CLIENT_ID>",
  "credentials": {
    "secret": "<CLIENT_SECRET>"
  },
  "confidential-port": 0
}
```
Keycloak security role:
```
{
 "evseServer": {
  ...
 }
 ],
 "role":"<KEYCLOAK_REALM>:<KEYCLOAK_CLIENT>"
}
```

