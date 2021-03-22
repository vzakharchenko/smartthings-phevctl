import * as React from 'react';
import {
  Alert, Button, Select, Table,
} from 'antd';
import { getLabels } from '../utils/Localization';
import { fetchBackend, sendToBackend } from '../utils/restCalls';

export class NotificationSettings extends React.Component {
    state = {
      settings: {},
      changed: false,
      error: '',
      smsCodes: null,
      notifications: null,
      loading: false,
    };

    async componentDidMount() {
      await this.reload();
    }

    async onSaveClick() {
      const {
        settings,
        notifications,
      } = this.state;
      this.setState({ loading: true });
      const copyConfig = JSON.parse(JSON.stringify(settings.data));
      copyConfig.notifications = notifications;
      try {
        const res = await sendToBackend('/ui/settings', 'POST', copyConfig);
        const status = JSON.parse(res.data);
        if (status.status === 'OK') {
          const event = { changed: false };
          await this.props.reload();
          await this.reload();
          this.setState(event);
        } else {
          this.setState({ error: status.message });
        }
      } finally {
        this.setState({ loading: false });
      }
    }

    getColumns() {
      return [
        {
          title: getLabels().code,
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: getLabels().description,
          dataIndex: 'description',
          key: 'description',
          render: (text) => <a>{text}</a>,
        },
        {
          title: getLabels().value,
          dataIndex: 'description',
          key: 'description',
          render: (text, data) => (
            <Select
              style={{ width: 200 }}
              defaultValue={this.state.notifications[data.name]}
              onChange={(event) => {
                if (event) {
                  const newState = { changed: true };
                  this.state.notifications[data.name] = event;
                  newState.notifications = this.state.notifications;
                  this.setState(newState);
                }
              }}
            >
              <Select.Option disabled={!this.state.settings.data.smartthings.sendNotification && !this.state.settings.data.smartthings.sms.enabled && !this.state.settings.data.smartthings.sms.sendSMSNotification} value="both">{getLabels().both}</Select.Option>
              <Select.Option disabled={!this.state.settings.data.smartthings.sms.enabled && !this.state.settings.data.smartthings.sms.sendSMSNotification} value="sms">{getLabels().onlySMS}</Select.Option>
              <Select.Option disabled={!this.state.settings.data.smartthings.sendNotification} value="push">{getLabels().onlyPush}</Select.Option>
              <Select.Option value="none">{getLabels().none}</Select.Option>

            </Select>
          ),
        },
      ];
    }

    async reload() {
      const { data } = await fetchBackend('/ui/settings');
      const settings = JSON.parse(data);
      const respCodes = await fetchBackend('/ui/sms/codes');
      const smsCodes = JSON.parse(respCodes.data);
      this.setState({
        settings,
        smsCodes,
        notifications: settings.data.notifications,
      });
    }

    render() {
      const {
        settings, changed, loading, error, smsCodes, notifications,
      } = this.state;
      if (settings.status === 'OK' && smsCodes != null) {
        const data = [];
        Object.keys(notifications).forEach((nk) => {
          data.push({
            name: nk,
            status: notifications[nk],
            description: smsCodes[nk] || getLabels()[nk],
          });
        });
        return (
          <div>
            {error ? (
              <Alert
                message={error}
                showIcon
                type="error"
                closable
              />
            ) : null}
            <Table pagination={false} columns={this.getColumns()} dataSource={data} />
            <Button
              type="primary"
              loading={loading}
              block
              disabled={!changed}
              onClick={async () => {
                await this.onSaveClick();
              }}
            >
              {getLabels().save || 'Save'}
            </Button>
          </div>
        );
      }
      return null;
    }
}
