/**
 *  Outlander PHEV Thermostat
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
    definition (name: "Outlander PHEV Thermostat", namespace: "vzakharchenko", author: "Василий Захарченко", cstHandler: true) {
        capability "Thermostat Operating State"
        capability "Health Check"
        command "forceOn"
        command "forceOff"
        command "update"
        command "update2"
        command "updateall"
        command "markDeviceOnline"
        command "markDeviceOffline"
    }


    simulator {
        // TODO: define status and reply messages here
    }

    tiles {
        // TODO: define your main and details tiles here
    }
}

def forceOn() {
}

def forceOff() {
}

def update(value) {
    debug("Value1: ${value}")
}


def update2(value) {
    debug("Value2: ${value}")
}


def updateall(value, value2) {
    debug("Value1: ${value}, Value2:${value2}")
    if(value == 0){
        sendEvent(name: "thermostatOperatingState", value: 'idle')
    } else {
        def state = 'idle';
        if (value2 == 1){
            state = 'cooling';
        } else {
            state = 'heating';
        }
        sendEvent(name: "thermostatOperatingState", value: state)
    }

}

def debug(message) {
    def debug = false;
    if (debug) {
        log.debug message
    }
}

def markDeviceOnline() {
    debug("switchStatus: ${device.currentValue('switch')};")
    setDeviceHealth("online")
}

def markDeviceOffline() {
    sendEvent(name: "thermostatOperatingState", value: "offline", descriptionText: "The device is offline")
    setDeviceHealth("offline")
}

private setDeviceHealth(String healthState) {
    List validHealthStates = ["online", "offline"]
    healthState = validHealthStates.contains(healthState) ? healthState : device.currentValue("healthStatus")
    sendEvent(name: "DeviceWatch-DeviceStatus", value: healthState)
    sendEvent(name: "healthStatus", value: healthState)
}
