import * as React from 'react';
import {
  Alert, Button, Table,
} from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { getLabels, setLanguage } from '../utils/Localization';
import { fetchBackend, sendToBackend } from '../utils/restCalls';

export class CronSettings extends React.Component {
    state = {
      settings: {},
      changed: false,
      error: '',
      updateDevices: '',
      syncDevices: '',
      cloudDevices: '',
      shutdown: '',
      loading: false,
    };

    async componentDidMount() {
      await this.reload();
    }

    async onSaveClick() {
      const {
        settings,
        updateDevices,
        syncDevices,
        cloudDevices,
        shutdown,
      } = this.state;
      this.setState({ loading: true });
      const copyConfig = JSON.parse(JSON.stringify(settings.data));
      if (updateDevices) {
        copyConfig.cron.updateDevices = updateDevices;
      }
      if (syncDevices) {
        copyConfig.cron.syncDevices = syncDevices;
      }
      if (cloudDevices) {
        copyConfig.cron.cloudDevices = cloudDevices;
      }
      if (shutdown) {
        copyConfig.cron.shutdown = shutdown;
      }
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
          title: getLabels().name,
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{getLabels()[text] || text}</a>,
        },
        {
          title: getLabels().value,
          dataIndex: 'value',
          key: 'value',
          render: (text, data) => {
            const value = this.state[data.name];
            return (
              <Paragraph editable={{
                onChange: (newValue) => {
                  if (newValue) {
                    const newState = { changed: true };
                    newState[data.name] = newValue;
                    this.setState(newState);
                  }
                },
              }}
              >
                {value}
              </Paragraph>
            );
          },
        },
      ];
    }

    async reload() {
      const { data } = await fetchBackend('/ui/settings');
      const settings = JSON.parse(data);
      setLanguage(settings.data.language || 'English');
      this.setState({
        settings,
        updateDevices: settings.data.cron.updateDevices,
        syncDevices: settings.data.cron.syncDevices,
        cloudDevices: settings.data.cron.cloudDevices,
        shutdown: settings.data.cron.shutdown,
      });
    }

    render() {
      const {
        settings, changed, loading, error,
      } = this.state;
      if (settings.status === 'OK') {
        const data = [{
          name: 'updateDevices',
          value: settings.data.cron.updateDevices,
        },
        {
          name: 'syncDevices',
          value: settings.data.cron.syncDevices,
        }];
        if (!settings.data.smartthings.useCloud) {
          data.push({
            name: 'cloudDevices',
            value: settings.data.cron.syncDevices,
          });
        }
        if (settings.data.ups && settings.data.ups !== 'none') {
          data.push({
            name: 'shutdown',
            value: settings.data.cron.shutdown,
          });
        }
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
