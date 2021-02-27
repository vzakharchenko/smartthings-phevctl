# Smartthings Remote control for Outlander PHEV

[![Node.js CI](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/build.yml/badge.svg)](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/build.yml)
[![docker](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/docker.yml/badge.svg)](https://github.com/vzakharchenko/smartthings-phevctl/actions/workflows/docker.yml)
[![NPM](https://nodei.co/npm/smartthings-phevctl.png)](https://npmjs.org/package/smartthings-phevctl)

![smartthings.gif](./img/smartthings.gif)
![smartthings.gif](./img/smartthings1.gif)

## Server Docker Installation
```
docker run --name=smartthings-phevctl  -p 8080:8080 -p 8099:8099 vassio/smartthings-phevctl
```
## Server Manual Installation
```
sudo touch /bin/phevctl
sudo echo "docker run papawattu/phevctl $*">/bin/phevctl
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
4. select from code and add [Outlander PHEV Action.groovy](./dht/Outlander PHEV Action.groovy)![](./img/dht3.png)
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

1. open smartthings application in Phone (Android)[https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect&hl=en&gl=US] or (Apple)[https://apps.apple.com/us/app/smartthings/id1222822904]
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

# Authentication
## Local authentication (default)
### change password for user
![](./img/users1.png)

### add a new User
![](./img/users2.png)

## Keycloak authentication

![](./img/keycloak.png)

restart Application



