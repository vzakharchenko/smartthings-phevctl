import * as React from "react";
import {fetchBackend, sendToBackend} from "../utils/restCalls";
import {Alert, Button, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {getLabels} from "../utils/Localization";
import MaskedInput from 'antd-mask-input'
import TextArea from "antd/es/input/TextArea";


export class SmartthingsSettings extends React.Component {

    state = {
        settings: {},
        servicePort: '',
        uiPort: '',
        smartthingsAppId: '',
        smartthingsAppSecret: '',
        macAddress: '',
        changed: false,
        loading: false,
        error: '',
        keycloakJson: ''
    };

    async reload() {
        const {data} = await fetchBackend('/ui/settings');
        const settings = JSON.parse(data);
        this.setState({
            settings: settings,
            servicePort: settings.data.port,
            uiPort: settings.data.portUI,
            smartthingsAppId: settings.data.smartthings.appId,
            smartthingsAppSecret: settings.data.smartthings.appSecret,
            macAddress: settings.data.macAddress,
            shard: settings.data.smartthings.shard,
            authenticationType: settings.data.connectionType
        });
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
            shard,
        } = this.state;
        this.setState({loading: true});
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
        try {
            let res = await fetchBackend(`/ui/smartthings/check?appId=${smartthingsAppId}&secret=${smartthingsAppSecret}`);
            let status = JSON.parse(res.data);
            if (status.status === 'OK') {
                res = await sendToBackend('/ui/settings', 'POST', copyConfig);
                status = JSON.parse(res.data);
                if (status.status === 'OK') {
                    const event = {changed: false};
                    if (keycloakJson) {
                        res = await sendToBackend('/ui/settings/saveKeycloak', 'POST', {keycloakJson});
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
                    this.setState({error: status.message});
                }
            } else {
                this.setState({error: status.message});
            }
        } finally {
            this.setState({loading: false});
        }
    }

    getColumns() {
        return [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: text => <a>{getLabels()[text] || text}</a>,
            },
            {
                title: 'Value',
                dataIndex: 'value',
                key: 'value',
                render: (text, data) => {
                    const value = this.state[data.name];
                    if (data.name === 'macAddress') {
                        return <MaskedInput mask="##:##:##:##:##:##" name={getLabels()['macAddress'] || text}
                                            value={value} placeholder="xx:xx:xx:xx:xx:xx" onChange={
                            (newValue) => {
                                if (newValue.target.value && !newValue.target.value.includes('_')) {
                                    const newState = {changed: true};
                                    newState.macAddress = newValue.target.value;
                                    this.setState(newState)
                                }
                            }
                        }/>;
                    }
                    if (data.name === 'keycloakJson') {
                        return <TextArea
                            onChange={
                                (newValue) => {
                                    if (newValue.target.value) {
                                        const newState = {changed: true};
                                        newState.keycloakJson = newValue.target.value;
                                        this.setState(newState)
                                    }
                                }
                            }
                            placeholder="Keycloak Json"
                            autoSize={{minRows: 3, maxRows: 5}}
                        />;
                    }
                    if (data.name === 'shard') {
                        return value;
                    } else {
                        return <Paragraph editable={{
                            onChange: (newValue) => {
                                if (newValue) {
                                    const newState = {changed: true};
                                    newState[data.name] = newValue;
                                    this.setState(newState)
                                }
                            }
                        }}>{value}</Paragraph>
                    }
                }
            }
        ];
    }

    async componentDidMount() {
        await this.reload();
    }


    render() {
        const {settings, changed, loading, error} = this.state;
        if (settings.status === 'OK') {
            const data = [
                {
                    name: 'macAddress',
                    value: settings.data.macAddress
                },
                {
                    name: 'shard',
                    value: settings.data.smartthings.shard
                },
                {
                    name: 'smartthingsAppId',
                    value: settings.data.smartthings.appId
                },
                {
                    name: 'smartthingsAppSecret',
                    value: settings.data.smartthings.appSecret
                },
                {
                    name: 'keycloakJson',
                    value: ''
                },
            ]
            return <div>
                {error ? <Alert
                    message={error}
                    showIcon
                    type="error"
                    closable
                /> : null}
                <Table columns={this.getColumns()} dataSource={data}/>
                <Button type="primary" loading={loading} block disabled={!changed} onClick={() => {
                    this.onSaveClick()
                }}>
                    {getLabels()['save'] || 'Save'}
                </Button>
            </div>
        }
        return null

    }
}
