import * as React from 'react';
import { SmartthingsSettings } from './SmartthingsSettings';
import { SmartthingsAddDevice } from './SmartthingsAddDevice';
import { SmartthingsViewDevice } from './SmartthingsViewDevice';
import { AddUser } from './AddUser';
import { ViewUser } from './ViewUser';
import { CONTENTS } from './Constants';
import { SmartthingsSMS } from './SmartthingsSMS';
import { CronSettings } from './CronSettings';
import { NotificationSettings } from './NotificationSettings';
import { SmartthingsUPS } from './SmartthingsUPS';
import { SmartthingsGPIO } from './SmartthingsGPIO';

export class RemoteCtrlContentHandler extends React.Component {
  render() {
    const contentPage = this.props.name;
    const { reload } = this.props;
    const { id } = this.props;
    if (contentPage === CONTENTS.SmartthingsSettings) {
      return <SmartthingsSettings reload={reload} />;
    } if (contentPage === CONTENTS.SmartthingsAddDevice) {
      return <SmartthingsAddDevice reload={reload} />;
    } if (contentPage === CONTENTS.SmartthingsViewDevice) {
      return <SmartthingsViewDevice reload={reload} deviceId={id} />;
    } if (contentPage === CONTENTS.AddUser) {
      return <AddUser reload={reload} />;
    } if (contentPage === CONTENTS.ViewUser) {
      return <ViewUser reload={reload} userId={id} />;
    } if (contentPage === CONTENTS.SMS) {
      return <SmartthingsSMS />;
    } if (contentPage === CONTENTS.UPS) {
      return <SmartthingsUPS />;
    } if (contentPage === CONTENTS.GPIO) {
      return <SmartthingsGPIO />;
    } if (contentPage === CONTENTS.CRON) {
      return <CronSettings />;
    } if (contentPage === CONTENTS.NOTIFICATION) {
      return <NotificationSettings />;
    }
    return null;
  }
}
