import * as React from 'react';
import { Table } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import MaskedInput from 'antd-mask-input';
import TextArea from 'antd/es/input/TextArea';
import { getLabels } from '../utils/Localization';
import { fetchBackend } from '../utils/restCalls';

export class SmartthingsSMS extends React.Component {
    state = {
      loadingPage: true,
      // eslint-disable-next-line react/no-unused-state
      settings: null,
      mikrotikSMS: null,
      smsCommands: null,
      smsCodes: null,
      phone: '',
    };

    async componentDidMount() {
      await this.reload();
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
            if (data.name === 'phone') {
              return (
                <MaskedInput
                  mask="+############"
                  name={getLabels().phone || text}
                  value={this.state.phone}
                  placeholder="+xxxxxxxxxxxx"
                  onChange={
                          (newValue) => {
                            if (newValue.target.value && !newValue.target.value.includes('_')) {
                              const newState = { phone: newValue.target.value };
                              this.setState(newState);
                            }
                          }
                      }
                />
              );
            }
            if (data.name === 'applicationHost') {
              return this.currentHost();
            }
            if (data.name === 'applicationId') {
              return this.state.settings.data.smartthings.sms.appId;
            }
            if (data.name === 'applicationSecret') {
              return this.state.settings.data.smartthings.sms.secret;
            }
            if (data.name === 'smsCodes') {
              return (
                <Table
                  pagination={false}
                  columns={[
                    {
                      title: getLabels().code,
                      dataIndex: 'name',
                      key: 'name',
                    }, {
                      title: getLabels().description,
                      dataIndex: 'value',
                      key: 'value',
                    }]}
                  dataSource={
                         Object.keys(this.state.smsCodes).map((code) => ({
                           name: code,
                           value: this.state.smsCodes[code],
                         }))
                       }
                />
              );
            }
            if (data.name === 'smsCommands') {
              return (
                <Table
                  pagination={false}
                  columns={[{
                    title: 'Commands',
                    dataIndex: 'name',
                    key: 'name',
                  }]}
                  dataSource={
                  this.state.smsCommands.map((command) => ({
                    name: command,
                  }))
                }
                />
              );
            }
            if (data.name === 'mikrotikScript') {
              return (
                <TextArea
                  autoSize={{ minRows: 30, maxRows: 100 }}
                  value={
                  this.state.mikrotikSMS
                    .replace('PHONE_NUMBER', this.state.phone)
                    .replace('CURRENT_HOST', this.currentHost())
                    .replace('APP_ID', this.state.settings.data.smartthings.sms.appId)
                    .replace('APP_SECRET', this.state.settings.data.smartthings.sms.secret)
                }
                />
              );
            }
            return (
              <Paragraph editable={{
                onChange: (newValue) => {
                  if (newValue) {
                    const newState = {};
                    newState[data.name] = newValue;
                    this.setState(newState);
                  }
                },
              }}
              >
                {text}
              </Paragraph>
            );
          },
        },
      ];
    }

    currentHost() {
      return `${window.location.protocol}//${window.location.hostname}:${this.state.settings.data.portSMS}`;
    }

    async reload() {
      this.setState({
        loadingPage: true,
      });
      let settings = null;
      let mikrotikSMS = null;
      let smsCommands = null;
      let smsCodes = null;
      try {
        const { data } = await fetchBackend('/ui/settings');
        settings = JSON.parse(data);
        const resp = await fetchBackend('/mikrotikSMS.script');
        const respHelp = await fetchBackend('/ui/sms/help');
        const respCodes = await fetchBackend('/ui/sms/codes');
        mikrotikSMS = resp.data;
        smsCommands = JSON.parse(respHelp.data);
        smsCodes = JSON.parse(respCodes.data);
      } finally {
        this.setState({
          // eslint-disable-next-line react/no-unused-state
          settings,
          mikrotikSMS,
          smsCommands,
          smsCodes,
          loadingPage: false,
        });
      }
    }

    render() {
      const {
        loadingPage,
        phone,
      } = this.state;

      const data = [
        {
          name: 'phone',
          value: phone,
        },
        {
          name: 'applicationHost',
          value: 'applicationHost',
        },
        {
          name: 'applicationId',
          value: 'applicationId',
        },
        {
          name: 'applicationSecret',
          value: 'applicationSecret',
        },
      ];

      if (phone) {
        data.push({
          name: 'mikrotikScript',
          value: 'mikrotikScript',
        });
      }
      data.push({
        name: 'smsCommands',
        value: 'smsCommands',
      });
      return loadingPage ? <spin /> : (
        <div>
          <Table pagination={false} columns={this.getColumns()} dataSource={data} />
        </div>
      );
    }
}
