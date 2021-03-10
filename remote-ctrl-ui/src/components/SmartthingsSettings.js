import * as React from 'react';
import {
  Alert, Button, Checkbox, Image, InputNumber, Select, Table,
} from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import MaskedInput from 'antd-mask-input';
import TextArea from 'antd/es/input/TextArea';
import { PoweroffOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Modal from 'antd/es/modal/Modal';
import { getLabels, setLanguage } from '../utils/Localization';
import { fetchBackend, sendToBackend } from '../utils/restCalls';

export class SmartthingsSettings extends React.Component {
    state = {
      settings: {},
      servicePort: '',
      uiPort: '',
      smartthingsAppId: '',
      smartthingsAppSecret: '',
      macAddress: '',
      actionTimeout: 0,
      language: 'English',
      changed: false,
      loading: false,
      error: '',
      keycloakJson: '',
      executeUpdate: true,
      sendNotification: true,
      batteryFactory: 1.0,
      isModalVisible: false,
    };

    async componentDidMount() {
      await this.reload();
    }

    async onSaveClick() {
      const {
        uiPort,
        servicePort,
        settings,
        smartthingsAppId,
        smartthingsAppSecret,
        macAddress,
        keycloakJson,
        language,
        actionTimeout,
        batteryFactory,
        executeUpdate,
        sendNotification,
        shard,
      } = this.state;
      this.setState({ loading: true });
      const copyConfig = JSON.parse(JSON.stringify(settings.data));
      if (smartthingsAppId) {
        copyConfig.smartthings.appId = smartthingsAppId;
      }
      if (smartthingsAppSecret) {
        copyConfig.smartthings.appSecret = smartthingsAppSecret;
      }
      if (shard) {
        copyConfig.smartthings.shard = shard;
      }
      if (macAddress) {
        copyConfig.macAddress = macAddress;
      }
      if (servicePort) {
        copyConfig.port = servicePort;
      }
      if (uiPort) {
        copyConfig.portUI = uiPort;
      }
      if (actionTimeout) {
        copyConfig.smartthings.timeout = actionTimeout;
      }
      if (language) {
        copyConfig.language = language;
      }
      if (batteryFactory) {
        copyConfig.batteryFactory = batteryFactory;
      }
      copyConfig.smartthings.executeUpdate = executeUpdate;
      copyConfig.smartthings.sendNotification = sendNotification;
      try {
        let res = await fetchBackend(`/ui/smartthings/check?appId=${smartthingsAppId}&secret=${smartthingsAppSecret}`);
        let status = JSON.parse(res.data);
        if (status.status === 'OK') {
          res = await sendToBackend('/ui/settings', 'POST', copyConfig);
          status = JSON.parse(res.data);
          if (status.status === 'OK') {
            const event = { changed: false };
            if (keycloakJson) {
              res = await sendToBackend('/ui/settings/saveKeycloak', 'POST', { keycloakJson });
              status = JSON.parse(res.data);
              if (status.status !== 'OK') {
                event.error = status.message;
              } else {
                event.error = '';
              }
            }
            await this.props.reload();
            await this.reload();
            this.setState(event);
          } else {
            this.setState({ error: status.message });
          }
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
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => {
            if (text === 'smartthingsAppId'
                || text === 'smartthingsAppSecret') {
              return (
                <div>
                  <a>{getLabels()[text] || text}</a>
                  <Button
                    type="text"
                    icon={<QuestionCircleOutlined />}
                    onClick={() => {
                      this.setState({ isModalVisible: true });
                    }}
                  />
                  <Modal
                    title={getLabels().modalHelp + getLabels()[text] || text}
                    visible={this.state.isModalVisible}
                    onCancel={(
                    ) => { this.setState({ isModalVisible: false }); }}
                    footer={[
                      <Button
                        key="ok"
                        type="primary"
                        onClick={() => {
                          this.setState({ isModalVisible: false });
                        }}
                      >
                        Ok
                      </Button>,
                    ]}
                  >
                    <p>
                      {getLabels().modalStep1}
                      <Button
                        type="link"
                        onClick={() => {
                          window.open('https://graph.api.smartthings.com', '_blank');
                        }}
                      >
                        https://graph.api.smartthings.com/
                      </Button>
                    </p>
                    <p>{getLabels().modalStep2}</p>
                    <Image
                      width={400}
                      src="/img/smartapp1.png"
                    />
                    <p>{getLabels().modalStep3}</p>
                    <Image
                      width={400}
                      src="/img/smartapp2.png"
                    />
                    <p>{getLabels().modalStep4 + getLabels()[text] || text}</p>
                    <Image
                      width={400}
                      src="/img/smartapp3.png"
                    />
                  </Modal>
                </div>
              );
            }
            return <a>{getLabels()[text] || text}</a>;
          },
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          render: (text, data) => {
            const value = this.state[data.name];
            if (data.name === 'macAddress') {
              return (
                <MaskedInput
                  mask="##:##:##:##:##:##"
                  name={getLabels().macAddress || text}
                  value={value}
                  placeholder="xx:xx:xx:xx:xx:xx"
                  onChange={
                            (newValue) => {
                              if (newValue.target.value && !newValue.target.value.includes('_')) {
                                const newState = { changed: true };
                                newState.macAddress = newValue.target.value;
                                this.setState(newState);
                              }
                            }
                        }
                />
              );
            }
            if (data.name === 'keycloakJson') {
              return (
                <TextArea
                  onChange={
                                (newValue) => {
                                  if (newValue.target.value) {
                                    const newState = { changed: true };
                                    newState.keycloakJson = newValue.target.value;
                                    this.setState(newState);
                                  }
                                }
                            }
                  placeholder="Keycloak Json"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              );
            }
            if (data.name === 'executeUpdate') {
              return (
                <Checkbox
                  checked={this.state.executeUpdate}
                  onChange={(e) => {
                    const newState = { changed: true };
                    newState.executeUpdate = e.target.checked;
                    this.setState(newState);
                  }}
                />
              );
            }
            if (data.name === 'sendNotification') {
              return (
                <div>
                  <Checkbox
                    checked={this.state.sendNotification}
                    onChange={(e) => {
                      const newState = { changed: true };
                      newState.sendNotification = e.target.checked;
                      this.setState(newState);
                    }}
                  >
                    {getLabels().testNotificationLabel}
                  </Checkbox>
                  <br />
                  <Button
                    type="primary"
                    icon={<PoweroffOutlined />}
                    loading={this.state.loading}
                    onClick={async () => {
                      this.setState({ loading: true });
                      try {
                        await sendToBackend('/ui/settings/testNotification', 'POST', { message: 'Test Message' });
                      } finally {
                        this.setState({ loading: false });
                      }
                    }}
                  >
                    {getLabels().testNotification}
                  </Button>
                </div>
              );
            }
            if (data.name === 'actionTimeout') {
              return (
                <InputNumber
                  style={{
                    width: 200,
                  }}
                  defaultValue={this.state.actionTimeout}
                  min="0"
                  max="300000"
                  step="1000"
                  onChange={
                        (newValue) => {
                          if (newValue) {
                            const newState = { changed: true };
                            newState.actionTimeout = newValue;
                            this.setState(newState);
                          }
                        }
                      }
                  stringMode
                />
              );
            }
            if (data.name === 'batteryFactory') {
              return (
                <InputNumber
                  style={{
                    width: 200,
                  }}
                  defaultValue={this.state.batteryFactory}
                  min="0"
                  max="10"
                  step="0.0001"
                  onChange={
                        (newValue) => {
                          if (newValue) {
                            const newState = { changed: true };
                            newState.batteryFactory = newValue;
                            this.setState(newState);
                          }
                        }
                      }
                  stringMode
                />
              );
            }
            if (data.name === 'shard') {
              return value;
            }
            if (data.name === 'language') {
              return (
                <Select
                  defaultValue={this.state.language}
                  style={{ width: 200 }}
                  onChange={(lang) => {
                    this.setState({ language: lang, changed: true });
                  }}
                >
                  <Select.Option value="English">English</Select.Option>
                  <Select.Option value="Russian">Russian</Select.Option>
                </Select>
              );
            }
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
        servicePort: settings.data.port,
        uiPort: settings.data.portUI,
        smartthingsAppId: settings.data.smartthings.appId,
        smartthingsAppSecret: settings.data.smartthings.appSecret,
        macAddress: settings.data.macAddress,
        shard: settings.data.smartthings.shard,
        authenticationType: settings.data.connectionType,
        actionTimeout: settings.data.smartthings.timeout,
        batteryFactory: settings.data.batteryFactory || 1.0,
        language: settings.data.language || 'English',
        executeUpdate: settings.data.smartthings.executeUpdate,
        sendNotification: settings.data.smartthings.sendNotification,
      });
    }

    render() {
      const {
        settings, changed, loading, error,
      } = this.state;
      if (settings.status === 'OK') {
        const data = [
          {
            name: 'macAddress',
            value: settings.data.macAddress,
          },
          {
            name: 'shard',
            value: settings.data.smartthings.shard,
          },
          {
            name: 'smartthingsAppId',
            value: settings.data.smartthings.appId,
          },
          {
            name: 'smartthingsAppSecret',
            value: settings.data.smartthings.appSecret,
          },
          {
            name: 'keycloakJson',
            value: '',
          },
          {
            name: 'actionTimeout',
            value: settings.data.smartthings.timeout,
          },
          {
            name: 'executeUpdate',
            value: settings.data.smartthings.executeUpdate,
          },
          {
            name: 'sendNotification',
            value: settings.data.smartthings.sendNotification,
          },
          {
            name: 'language',
            value: settings.data.language,
          },
          {
            name: 'batteryFactory',
            value: settings.data.batteryFactory || 1.0,
          },
        ];
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
            <Table columns={this.getColumns()} dataSource={data} />
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
