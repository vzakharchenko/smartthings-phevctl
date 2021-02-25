import * as React from "react";
import Sider from "antd/lib/layout/Sider";
import {Menu} from "antd";
import Layout, {Footer, Header} from "antd/lib/layout/layout";
import {AppstoreAddOutlined, DesktopOutlined, UserOutlined,} from '@ant-design/icons';
import SubMenu from "antd/lib/menu/SubMenu";
import {CONTENTS, RemoteCtrlContentHandler} from "./RemoteCtrlContentHandler";
import {fetchBackend} from "../utils/restCalls";
import {getLabels} from "../utils/Localization";

export class RemoteCtrlMain extends React.Component {

    state = {
        collapsed: false,
        selectorPage: null,
        settings: null,
        componentId: null,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({collapsed});
    };

    reload = async (selectorPage, id) => {
        const {data} = await fetchBackend('/ui/settings');
        let settings = JSON.parse(data);
        if (settings.data.smartthings.appId && settings.data.smartthings.appSecret){
            await fetchBackend('/ui/settings/syncDevices');
        }
        const res = await fetchBackend('/ui/settings');
        settings = JSON.parse(res.data);
        const newState = {settings: settings};
        if (selectorPage) {
            newState.selectorPage = selectorPage;
        }
        if (id) {
            newState.componentId = id;
        }
        this.setState(newState);
    }

    async componentDidMount() {
        await this.reload();
    }

    onSmartThingsSettingClick = () => {
        this.setState({selectorPage: CONTENTS.SmartthingsSettings});
    };

    onSmartThingsAddDeviceClick = () => {
        this.setState({selectorPage: CONTENTS.SmartthingsAddDevice});
    };

    onAddUsersClick = () => {
        this.setState({selectorPage: CONTENTS.AddUser});
    };


    onSmartThingsViewDeviceClick = (deviceId) => {
        this.setState({
            selectorPage: CONTENTS.SmartthingsViewDevice,
            componentId:deviceId
        });
    };
    onViewUserClick = (userId) => {
        this.setState({
            selectorPage: CONTENTS.ViewUser,
            componentId:userId
        });
    };

    render() {
        const {collapsed, selectorPage, componentId, settings} = this.state;
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                    <div className="logo"/>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" icon={<DesktopOutlined/>}
                                   onClick={this.onSmartThingsSettingClick}>{getLabels().settings}
                        </Menu.Item>
                        <SubMenu key="devices" icon={<AppstoreAddOutlined/>} title={getLabels().devices} disabled={!(settings && settings.data.smartthings.appId &&  settings.data.smartthings.appSecret) }>
                            {(settings && settings.data.smartthings.devices) ?
                                settings.data.smartthings.devices.map((device) => {
                                    return <Menu.Item key={device.id} onClick={() => {
                                        this.onSmartThingsViewDeviceClick(device.id);
                                    }}>{device.deviceLabel}</Menu.Item>
                                })
                                : null}
                            <Menu.Item key="addDevice"
                                       onClick={this.onSmartThingsAddDeviceClick}>{getLabels().addDevice}</Menu.Item>
                        </SubMenu>{
                        settings && settings.data.connectionType === 'local'?
                        <SubMenu key="sub1" icon={<UserOutlined/>} title={getLabels().users}>
                            {(settings && settings.data.users) ?
                                settings.data.users.map((user) => {
                                    return <Menu.Item key={user.id} onClick={() => {
                                        this.onViewUserClick(user.id);
                                    }}>{user.username}</Menu.Item>
                                })
                                : null}
                            <Menu.Item key="addUser" onClick={()=>{
                                this.onAddUsersClick()
                            }}>{getLabels().addUser}</Menu.Item>
                        </SubMenu>:null}
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{padding: 0}}/>
                    <RemoteCtrlContentHandler
                        name={selectorPage || CONTENTS.SmartthingsSettings}
                        id={componentId}
                        reload={this.reload}
                    />
                    <Footer style={{textAlign: 'center'}}> ©2021 Created by Vasyl Zakharchenko</Footer>
                </Layout>
            </Layout>
        );
    }
}
