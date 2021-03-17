/**
 *  Outlander PHEV Action
 *
 *  Copyright 2021 Vasyl Zakharchenko
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
    definition (name: "Outlander PHEV Action", namespace: "vzakharchenko", author: "Vasyl Zakharchenko", vid: "generic-switch") {
        capability "Actuator"
        capability "Sensor"
        capability "Switch"
        capability "Momentary"
        capability "Health Check"
        command "forceOn"
        command "forceOff"
        command "update"
        command "update2"
        command "updateall"
        command "markDeviceOnline"
        command "markDeviceOffline"
    }

    tiles {
        multiAttributeTile(name: "switch", type: "lighting", width: 6, height: 4, canChangeIcon: true) {
            tileAttribute("device.switch", key: "PRIMARY_CONTROL") {
                attributeState "on", label: '${name}', action: "switch.off", icon: "st.Home.home30", backgroundColor: "#00A0DC", nextState: "off", defaultState: true
                attributeState "off", label: '${name}', action: "switch.on", icon: "st.Home.home30", backgroundColor: "#FFFFFF", nextState: "on"
            }
        }

        main(["switch"])
        details(["switch"])
    }
}
def on() {
    forceOn();
}

def push() {
    forceOn();
}

def off() {
}

def installed() {

}

def markDeviceOnline() {
    def currentState = device.currentValue("healthStatus");
    setDeviceHealth("online")
    if (currentState == 'offline'){
        forceOff();
    }
}

def markDeviceOffline() {
    sendEvent(name: "switch", value: "offline", descriptionText: "The device is offline")
    setDeviceHealth("offline")
}

def forceOn() {
    sendEvent(name: "switch", value: "on")
}

def forceOff() {
    sendEvent(name: "switch", value: "off")
}

def update(value) {

}


def update2(value) {

}


def updateall(value, value2) {

}

private setDeviceHealth(String healthState) {
    List validHealthStates = ["online", "offline"]
    healthState = validHealthStates.contains(healthState) ? healthState : device.currentValue("healthStatus")
    sendEvent(name: "DeviceWatch-DeviceStatus", value: healthState)
    sendEvent(name: "healthStatus", value: healthState)
}


def debug(message) {
    def debug = false;
    if (debug) {
        log.debug message
    }
}
