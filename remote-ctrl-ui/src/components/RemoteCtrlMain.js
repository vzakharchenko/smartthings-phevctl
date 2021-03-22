import * as React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { Menu, Spin } from 'antd';
import Layout, { Footer, Header } from 'antd/lib/layout/layout';
import {
  AppstoreAddOutlined, DesktopOutlined,
  LogoutOutlined, MessageOutlined,
  NotificationOutlined, ScheduleOutlined, UserOutlined,
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import Title from 'antd/es/typography/Title';
import { RemoteCtrlContentHandler } from './RemoteCtrlContentHandler';
import { fetchBackend } from '../utils/restCalls';
import { getLabels } from '../utils/Localization';
import { CONTENTS } from './Constants';

export class RemoteCtrlMain extends React.Component {
    state = {
      collapsed: false,
      selectorPage: null,
      settings: null,
      componentId: null,
      loading: false,
    };

    async componentDidMount() {
      await this.reload();
    }

    reload = async (selectorPage, id) => {
      this.setState({ loading: true });
      const newState = {};
      try {
        const { data } = await fetchBackend('/ui/settings');
        let settings = JSON.parse(data);
        if (settings.data.smartthings.appId && settings.data.smartthings.appSecret) {
          await fetchBackend('/ui/settings/syncDevices');
        }
        const res = await fetchBackend('/ui/settings');
        settings = JSON.parse(res.data);
        newState.settings = settings;
        if (selectorPage) {
          newState.selectorPage = selectorPage;
        }
        if (id) {
          newState.componentId = id;
        }
      } finally {
        newState.loading = false;
        this.setState(newState);
      }
    }

    onCollapse = (collapsed) => {
      this.setState({ collapsed });
    };

    onSmartThingsSettingClick = () => {
      this.setState({ selectorPage: CONTENTS.SmartthingsSettings });
    };

    onSMSClick = () => {
      this.setState({ selectorPage: CONTENTS.SMS });
    };

    onNotificationClick = () => {
      this.setState({ selectorPage: CONTENTS.NOTIFICATION });
    };

    onCRONClick = () => {
      this.setState({ selectorPage: CONTENTS.CRON });
    };

    onSmartThingsAddDeviceClick = () => {
      this.setState({ selectorPage: CONTENTS.SmartthingsAddDevice });
    };

    onAddUsersClick = () => {
      this.setState({ selectorPage: CONTENTS.AddUser });
    };

    onSmartThingsViewDeviceClick = (deviceId) => {
      this.setState({
        selectorPage: CONTENTS.SmartthingsViewDevice,
        componentId: deviceId,
      });
    };

    onViewUserClick = (userId) => {
      this.setState({
        selectorPage: CONTENTS.ViewUser,
        componentId: userId,
      });
    };

    render() {
      const {
        collapsed, selectorPage, componentId, settings, loading,
      } = this.state;
      return loading ? (
        <div>
          <Spin size="large" />
          <Title>{getLabels().loading}</Title>
        </div>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item
                key="1"
                icon={<DesktopOutlined />}
                onClick={this.onSmartThingsSettingClick}
              >
                {getLabels().settings}
              </Menu.Item>
              <SubMenu key="devices" icon={<AppstoreAddOutlined />} title={getLabels().devices} disabled={!(settings && settings.data.smartthings.useSmartthings && settings.data.smartthings.appId && settings.data.smartthings.appSecret)}>
                {(settings && settings.data.smartthings.devices)
                  ? settings.data.smartthings.devices.map((device) => (
                    <Menu.Item
                      key={device.id}
                      onClick={() => {
                        this.onSmartThingsViewDeviceClick(device.id);
                      }}
                    >
                      {device.deviceLabel}
                    </Menu.Item>
                  ))
                  : null}
                <Menu.Item
                  key="addDevice"
                  onClick={this.onSmartThingsAddDeviceClick}
                >
                  {getLabels().addDevice}
                </Menu.Item>
              </SubMenu>
              {
                        settings && settings.data.connectionType === 'local'
                          ? (
                            <SubMenu key="sub1" icon={<UserOutlined />} title={getLabels().users}>
                              {(settings && settings.data.users)
                                ? settings.data.users.map((user) => (
                                  <Menu.Item
                                    key={user.id}
                                    onClick={() => {
                                      this.onViewUserClick(user.id);
                                    }}
                                  >
                                    {user.username}
                                  </Menu.Item>
                                ))
                                : null}
                              <Menu.Item
                                key="addUser"
                                onClick={() => {
                                  this.onAddUsersClick();
                                }}
                              >
                                {getLabels().addUser}
                              </Menu.Item>
                            </SubMenu>
                          ) : null
}
              {
                    settings && settings.data.smartthings.sms.enabled
                      ? (
                        <Menu.Item
                          key="subSMS"
                          icon={<MessageOutlined />}
                          onClick={this.onSMSClick}
                        >
                          {getLabels().sms}
                        </Menu.Item>
                      ) : null
                }
              {
                    settings && (settings.data.smartthings.sms.sendSMSNotification
                        || settings.data.smartthings.sendNotification)
                      ? (
                        <Menu.Item
                          key="subNotification"
                          icon={<NotificationOutlined />}
                          onClick={this.onNotificationClick}
                        >
                          {getLabels().notification}
                        </Menu.Item>
                      ) : null
                }
              <Menu.Item
                key="subCron"
                icon={<ScheduleOutlined />}
                onClick={this.onCRONClick}
              >
                {getLabels().cron}
              </Menu.Item>
              {
                  settings && settings.data.connectionType === 'keycloak'
                    ? (
                      <Menu.Item
                        key="subLogout"
                        icon={<LogoutOutlined />}
                        onClick={() => {
                          window.location.href = '/logout';
                        }}
                      >
                        {getLabels().logout}
                      </Menu.Item>
                    ) : null
                }

            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <RemoteCtrlContentHandler
              name={selectorPage || CONTENTS.SmartthingsSettings}
              id={componentId}
              reload={this.reload}
            />
            <Footer style={{ textAlign: 'center' }}> ©2021 Created by Vasyl Zakharchenko</Footer>
          </Layout>
        </Layout>
      );
    }
}
