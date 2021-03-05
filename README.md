# Smartthings Remote control for Outlander PHEV

[![Node.js CI](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/build.yml/badge.svg)](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/build.yml)
[![docker](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/docker.yml/badge.svg)](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/docker.yml)
[![NPM](https://nodei.co/npm/smartthings-phevctl.png)](https://npmjs.org/package/smartthings-phevctl)

![smartthings.gif](./img/smartthings.gif)
![smartthings.gif](./img/smartthings1.gif)

## Features:
- switch on/off condition/heater
- change mode of air conditioner: heater/cool/windscreen for 10/20/30 mins,
- show battery level
- support google home
- possibility to control over voice(by Google assistant)

## Cloud Installation
- [cloud installation](https://github.com/vzakharchenko/remote-ctrl-gsm/blob/master/cloud/README.md)
- [hetzner cloud](https://github.com/vzakharchenko/remote-ctrl-gsm/wiki/gsm-extender-hetzner-cloud)
- [scaleway cloud](https://github.com/vzakharchenko/remote-ctrl-gsm/wiki/gsm-extender-scaleway-cloud)

## Installation Steps
1. [Install Server using Docker](https://github.com/vzakharchenko/smartthings-phevctl#server-docker-installation) or  [Manual Installation](https://github.com/vzakharchenko/smartthings-phevctl#server-manual-installation)
2. [create Device Handler](https://github.com/vzakharchenko/smartthings-phevctl#create-custom-dht)
3. [create smartapp](https://github.com/vzakharchenko/smartthings-phevctl#create-smartapp)
4. [Configure smartthings application on android or apple](https://github.com/vzakharchenko/smartthings-phevctl#configure-smartthings-application)
5. [Get "Smartthings Application Id" and "Smartthings Application Secret"](https://github.com/vzakharchenko/smartthings-phevctl#get-smartthings-application-id-and-smartthings-application-secret)
6. [Configure Server](https://github.com/vzakharchenko/smartthings-phevctl#configure-server)
7. [Add Smartthings devices](https://github.com/vzakharchenko/smartthings-phevctl#add-a-new-smartthings-device)

## Server Docker Installation
- Supported Architectures: amd64,x86-64,arm64,ppc64le,arm/v7
```
docker run --name=smartthings-phevctl  -p 8080:8080 -p 8099:8099 vassio/smartthings-phevctl
```
## Server Manual Installation
```
sudo touch /bin/phevctl
sudo echo "docker run vassio/phevctl $*">/bin/phevctl
sudo chmod +x /bin/phevctl
wget -qO- https://getpm2.com/install.sh | bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ${currentUser} --hp ${HOME}
sudo npm i smartthings-phevctl -g
sudo pm2 start `npm root -g`/smartthings-phevctl/smartthings-phevctl.js
sudo pm2 save
```


## Smartthings installation

### Create Custom DHT
1. open [https://graph.api.smartthings.com/](https://graph.api.smartthings.com/)
2. open your location/ or create a new one ![](./img/dht1.png)
3. open "My Device Handler" and "create New Device Handler"![](./img/dht2.png)
4. select from code and add [Outlander PHEV Action.groovy](./dht/Outlander PHEV Action.groovy) and [Outlander PHEV Battery.groovy](./dht/Outlander PHEV Battery.groovy) ![](./img/dht3.png)
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



