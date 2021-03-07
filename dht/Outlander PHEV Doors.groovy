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
        capability "Contact Sensor"

        capability "Configuration"
        command "forceOn"
        command "forceOff"
        command "update"
        command "update2"
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
    debug("new State = "+value)
    sendEvent(name: "contact", value: value == 1 ? "closed": "open")
}


def update2(value) {

}


def debug(message) {
    def debug = false;
    if (debug) {
        log.debug message
    }
}
