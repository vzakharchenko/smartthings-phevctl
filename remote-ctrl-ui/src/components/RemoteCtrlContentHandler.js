import * as React from 'react';
import { SmartthingsSettings } from './SmartthingsSettings';
import { SmartthingsAddDevice } from './SmartthingsAddDevice';
import { SmartthingsViewDevice } from './SmartthingsViewDevice';
import { AddUser } from './AddUser';
import { ViewUser } from './ViewUser';
import { CONTENTS } from './Constants';

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
    }
    return null;
  }
}
