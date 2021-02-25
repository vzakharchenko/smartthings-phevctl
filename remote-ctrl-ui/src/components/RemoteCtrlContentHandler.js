import * as React from "react";
import {SmartthingsSettings} from "./SmartthingsSettings";
import {SmartthingsAddDevice} from "./SmartthingsAddDevice";
import {SmartthingsViewDevice} from "./SmartthingsViewDevice";
import {AddUser} from "./AddUser";
import {ViewUser} from "./ViewUser";


export const CONTENTS = {
    SmartthingsSettings: 'SMARTTHINGS_SETTINGS',
    SmartthingsAddDevice: 'SMARTTHINGS_ADD_DEVICE',
    SmartthingsViewDevice: 'SMARTTHINGS_VIEW_DEVICE',
    AddUser: 'ADD_USER',
    ViewUser: 'VIEW_USER',
}

export class RemoteCtrlContentHandler extends React.Component {


    render() {
        const contentPage = this.props.name;
        const reload = this.props.reload;
        const id = this.props.id;
        if (contentPage === CONTENTS.SmartthingsSettings) {
            return <SmartthingsSettings reload={reload}/>
        } else if (contentPage === CONTENTS.SmartthingsAddDevice) {
            return <SmartthingsAddDevice reload={reload}/>
        } else if (contentPage === CONTENTS.SmartthingsViewDevice) {
            return <SmartthingsViewDevice reload={reload} deviceId={id}/>
        } else if (contentPage === CONTENTS.AddUser) {
            return <AddUser reload={reload}/>
        }else if (contentPage === CONTENTS.ViewUser) {
            return <ViewUser reload={reload} userId={id}/>
        }
        return null;
    }
}
