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
      sms: true,
      smsType: 'none',
      smsPassword: '',
      sendNotification: true,
      sendSMSNotification: false,
      smsCar: 'any',
      useSmartthings: false,
      useCloud: false,
      batteryFactory: 1.0,
      isModalVisible: false,
      theft: false,
      upsMaxTimeHours: 8,
      upsMinValue: -0.14,
      role: '',
      ups: 'none',
      roles: [],
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
        smsPassword,
        sms,
        smsType,
        ups,
        upsMaxTimeHours,
        upsMinValue,
        sendSMSNotification,
        shard,
        useSmartthings,
        smsCar,
        theft,
        role,
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
      copyConfig.smartthings.sms.enabled = sms;
      if (smsType) {
        copyConfig.smartthings.sms.smsType = smsType;
      }
      if (smsPassword) {
        copyConfig.smartthings.sms.password = smsPassword;
      }
      if (smsCar) {
        copyConfig.smartthings.sms.smsCar = smsCar;
        copyConfig.smartthings.sms.sendSMSNotification = sendSMSNotification;
      }
      if (role) {
        copyConfig.role = role;
      }
      if (ups) {
        copyConfig.ups = ups;
        copyConfig.upsMaxTimeHours = upsMaxTimeHours;
        copyConfig.upsMinValue = upsMinValue;
      }
      copyConfig.smartthings.useSmartthings = useSmartthings;
      copyConfig.theft = theft;
      copyConfig.smartthings.executeUpdate = executeUpdate;
      copyConfig.smartthings.sendNotification = sendNotification;
      try {
        let res;
        let status = { status: 'OK' };
        if (useSmartthings) {
          res = await fetchBackend(`/ui/smartthings/check?appId=${smartthingsAppId}&secret=${smartthingsAppSecret}`);
          status = JSON.parse(res.data);
        }
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
          title: getLabels().name,
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
          title: getLabels().value,
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
            if (data.name === 'role') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.setState({
                      role: event,
                      changed: true,
                    });
                  }}
                  defaultValue={this.state.role || 'none'}
                >
                  {this.state.roles.map((r) => <Select.Option value={r}>{r}</Select.Option>)}
                  <Select.Option value="none">{getLabels().noneRole}</Select.Option>
                </Select>
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
            if (data.name === 'smsCar') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.setState({
                      smsCar: event,
                      changed: true,
                    });
                  }}
                  defaultValue={this.state.smsCar || 'any'}
                >
                  <Select.Option value="any">{getLabels().any}</Select.Option>
                  <Select.Option value="2019">{getLabels().phev2019}</Select.Option>
                </Select>
              );
            }
            if (data.name === 'smsType') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.setState({
                      smsType: event,
                      changed: true,
                    });
                  }}
                  defaultValue={this.state.smsType || 'none'}
                >
                  <Select.Option value="none">{getLabels().noneSMS}</Select.Option>
                  <Select.Option value="mikrotik">{getLabels().mikrotikSMS}</Select.Option>
                  <Select.Option value="huaweiHiLink">{getLabels().huaweiHiLinkSMS}</Select.Option>
                </Select>
              );
            }
            if (data.name === 'sms') {
              return (
                <Checkbox
                  checked={this.state.sms}
                  onChange={(e) => {
                    const newState = { changed: true };
                    newState.sms = e.target.checked;
                    this.setState(newState);
                  }}
                />
              );
            }
            if (data.name === 'theft') {
              return (
                <Checkbox
                  checked={this.state.theft}
                  onChange={(e) => {
                    const newState = { changed: true };
                    newState.theft = e.target.checked;
                    this.setState(newState);
                  }}
                />
              );
            }
            if (data.name === 'sendSMSNotification') {
              return (
                <Checkbox
                  checked={this.state.sendSMSNotification}
                  onChange={(e) => {
                    const newState = { changed: true };
                    newState.sendSMSNotification = e.target.checked;
                    this.setState(newState);
                  }}
                />
              );
            }
            if (data.name === 'useSmartthings') {
              return (
                <Checkbox
                  checked={this.state.useSmartthings}
                  onChange={(e) => {
                    const newState = { changed: true };
                    newState.useSmartthings = e.target.checked;
                    this.setState(newState);
                  }}
                />
              );
            }
            if (data.name === 'useCloud') {
              return this.state.useCloud ? getLabels().Yes : getLabels().No;
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
            if (data.name === 'ups') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.setState({
                      ups: event,
                      changed: true,
                    });
                  }}
                  defaultValue={this.state.ups || 'none'}
                >
                  <Select.Option value="none">{getLabels().noneUPS}</Select.Option>
                  <Select.Option value="ups1">{getLabels().UPS1}</Select.Option>
                </Select>
              );
            }
            if (data.name === 'upsMaxTimeHours') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.setState({
                      upsMaxTimeHours: event,
                      changed: true,
                    });
                  }}
                  defaultValue={this.state.upsMaxTimeHours || '8'}
                >
                  <Select.Option value="1">{getLabels().ups1H}</Select.Option>
                  <Select.Option value="4">{getLabels().ups4H}</Select.Option>
                  <Select.Option value="8">{getLabels().ups8H}</Select.Option>
                  <Select.Option value="24">{getLabels().ups1D}</Select.Option>
                  <Select.Option value="48">{getLabels().ups2D}</Select.Option>
                </Select>
              );
            }
            if (data.name === 'upsMinValue') {
              return (
                <InputNumber
                  style={{
                    width: 200,
                  }}
                  defaultValue={this.state.upsMinValue}
                  min="-1"
                  max="0"
                  step="0.01"
                  onChange={
                              (newValue) => {
                                if (newValue) {
                                  const newState = { changed: true };
                                  newState.upsMinValue = newValue;
                                  this.setState(newState);
                                }
                              }
                          }
                  stringMode
                />
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
      let roles = [];
      if (settings.data.connectionType === 'keycloak') {
        const res = await fetchBackend('/ui/keycloak/roles');
        roles = JSON.parse(res.data);
      }
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
        theft: settings.data.theft,
        executeUpdate: settings.data.smartthings.executeUpdate,
        sendNotification: settings.data.smartthings.sendNotification,
        sms: settings.data.smartthings.sms.enabled,
        smsType: settings.data.smartthings.sms.smsType,
        smsCar: settings.data.smartthings.sms.smsCar || 'any',
        smsPassword: settings.data.smartthings.sms.password,
        useSmartthings: settings.data.smartthings.useSmartthings,
        useCloud: settings.data.smartthings.useCloud,
        role: settings.data.role,
        ups: settings.data.ups,
        upsMaxTimeHours: settings.data.upsMaxTimeHours,
        upsMinValue: settings.data.upsMinValue,
        roles,
        sendSMSNotification: !!settings.data.smartthings.sms.sendSMSNotification,
      });
    }

    render() {
      const {
        settings, changed, useSmartthings, loading, error, sms, role,
      } = this.state;
      if (settings.status === 'OK') {
        const data = [{
          name: 'macAddress',
          value: settings.data.macAddress,
        }, {
          name: 'theft',
          value: settings.data.theft,
        },
        {
          name: 'useSmartthings',
          value: settings.data.smartthings.useSmartthings,
        },
        {
          name: 'useCloud',
          value: settings.data.smartthings.useCloud,
        }];
        if (useSmartthings) {
          data.push({
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
            name: 'sendNotification',
            value: settings.data.smartthings.sendNotification,
          });
        }

        data.push(
          {
            name: 'keycloakJson',
            value: '',
          },
        );
        if (settings.data.connectionType === 'keycloak') {
          data.push(
            {
              name: 'role',
              value: role,
            },
          );
        }
        data.push({
          name: 'actionTimeout',
          value: settings.data.smartthings.timeout,
        },
        {
          name: 'executeUpdate',
          value: settings.data.smartthings.executeUpdate,
        },
        {
          name: 'language',
          value: settings.data.language,
        },
        {
          name: 'batteryFactory',
          value: settings.data.batteryFactory || 1.0,
        },
        {
          name: 'sms',
          value: settings.data.smartthings.sms.enabled,
        });
        if (sms) {
          data.push({
            name: 'smsType',
            value: settings.data.smartthings.sms.smsType || 'none',
          });
          data.push({
            name: 'smsPassword',
            value: settings.data.smartthings.sms.password,
          });
          data.push({
            name: 'smsCar',
            value: settings.data.smartthings.sms.smsCar,
          });
          data.push({
            name: 'sendSMSNotification',
            value: settings.data.smartthings.sms.sendSMSNotification,
          });
        }
        data.push({
          name: 'ups',
          value: settings.data.ups,
        });
        if (settings.data.ups && settings.data.ups !== 'none') {
          data.push({
            name: 'upsMaxTimeHours',
            value: settings.data.upsMaxTimeHours,
          });
          data.push({
            name: 'upsMinValue',
            value: settings.data.upsMinValue,
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
