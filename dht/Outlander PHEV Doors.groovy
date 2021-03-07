/**
 *  Outlander PHEV Doors
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
    definition (name: "Outlander PHEV Doors", namespace: "vzakharchenko", author: "Василий Захарченко") {
        capability "Actuator"
        capability "Lock"
        command "forceOn"
        command "forceOff"
        command "update"
        command "update2"
    }


    tiles(scale: 2) {
        multiAttributeTile(name:"toggle", type:"generic",  decoration:"flat", width:6, height:4) {
            tileAttribute ("device.lock", key:"PRIMARY_CONTROL") {
                attributeState "locked", label:'locked', icon:"st.locks.lock.locked", backgroundColor:"#00A0DC"
                attributeState "unlocked", icon:"st.locks.lock.unlocked", backgroundColor:"#ffffff"
                attributeState "unknown", label:"unknown", icon:"st.locks.lock.unknown", backgroundColor:"#ffffff"
            }
            tileAttribute("device.displayName", key: "SECONDARY_CONTROL") {
                attributeState "displayName", label: 'Model:  ${currentValue}'
            }
        }
        main "toggle"
        details(["toggle"])
    }
}

def forceOn() {
}

def forceOff() {
}

def update(value) {
    debug("new State = "+value)
    sendEvent(name: "lock", value: value == 1 ? "locked": "unlocked", data: [method: "auto", codeId: "1"])
}


def update2(value) {

}


def debug(message) {
    def debug = false;
    if (debug) {
        log.debug message
    }
}

def lock(){
}


def unlock(){
}
