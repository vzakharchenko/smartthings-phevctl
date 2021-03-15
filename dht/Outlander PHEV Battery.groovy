/**
 *  Outlander PHEV Battery
 *
 *  Copyright 2021 Василий Захарченко
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 */
metadata {
    definition (name: "Outlander PHEV Battery", namespace: "vzakharchenko", author: "Василий Захарченко") {
        capability "Battery"
        capability "Power Source"
        capability "Configuration"
        capability "Health Check"
        command "update"
        command "update2"
        command "forceOn"
        command "forceOff"
        command "updateall"
        command "markDeviceOnline"
        command "markDeviceOffline"
    }

    tiles {

        valueTile("battery", "device.battery", inactiveLabel: false, decoration: "flat", width: 2, height: 2) {
            state "battery", label:'${currentValue}% battery', unit:""
        }
        main "battery"
    }
}

// parse events into attributes
def update(currentValue) {
    if (Integer.parseInt(currentValue) >5 && Integer.parseInt(currentValue) <101){
        if (Integer.parseInt(currentValue) <10){
            sendEvent(name: "battery", value: 0)
        }  else{
            sendEvent(name: "battery", value: currentValue)
        }
    }

}
def update2(currentValue) {
    sendEvent(name: "powerSource", value: currentValue == "0" ? 'battery': 'mains')
}

def forceOn() {
}

def forceOff() {
}

def updateall(value, value2) {

}

def markDeviceOnline() {
    debug("switchStatus: ${device.currentValue('switch')};")
    setDeviceHealth("online")
}

def markDeviceOffline() {
    sendEvent(name: "battery", value: "offline", descriptionText: "The device is offline")
    setDeviceHealth("offline")
}

private setDeviceHealth(String healthState) {
    List validHealthStates = ["online", "offline"]
    healthState = validHealthStates.contains(healthState) ? healthState : device.currentValue("healthStatus")
    sendEvent(name: "DeviceWatch-DeviceStatus", value: healthState)
    sendEvent(name: "healthStatus", value: healthState)
}
