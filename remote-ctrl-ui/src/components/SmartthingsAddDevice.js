import * as React from "react";
import {Button, Select, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {getLabels} from "../utils/Localization";
import {Option} from "antd/es/mentions";
import {sendToBackend} from "../utils/restCalls";
import {CONTENTS} from "./RemoteCtrlContentHandler";
import {v4 as uuidv4} from 'uuid';

export class SmartthingsAddDevice extends React.Component {

    state = {
        loading: false,
        canSave: false,
        deviceLabel: '',
        actionId: '',
    };

    async onSaveClick() {
        const {
            deviceLabel,
            actionId,
        } = this.state;
        this.setState({loading: true});
        try {
            const id = uuidv4();
            await sendToBackend('/ui/settings/addDevice', 'POST',  {id: id, deviceLabel, actionId});
            await this.props.reload(CONTENTS.SmartthingsViewDevice, id);
        } finally {
            this.setState({loading: false});
        }
    }

    validation(deviceLabel, actionId) {
        return (deviceLabel || this.state.deviceLabel && actionId || this.state.actionId);
    }

    onActionChange(actionId) {
        this.setState({actionId, canSave: this.validation(null, actionId)});
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
                    if (data.name === 'actionId') {
                        return <Select style={{width: 200}} onChange={(event) => {
                            this.onActionChange(event)
                        }}>
                            <Select.Option value="airconOn">{getLabels().airconOn}</Select.Option>
                            <Select.Option value="airconOff">{getLabels().airconOff}</Select.Option>
                            <Select.Option value="headlightsOn">{getLabels().headlightsOn}</Select.Option>
                            <Select.Option value="headlightsOff">{getLabels().headlightsOff}</Select.Option>
                            <Select.Option value="parkinglightsOn">{getLabels().parkinglightsOn}</Select.Option>
                            <Select.Option value="parkinglightsOff">{getLabels().parkinglightsOff}</Select.Option>
                        </Select>
                    } else {
                        return <Paragraph editable={{
                            onChange: (newValue) => {
                                if (newValue) {
                                    const newState = {canSave: this.validation(newValue)};
                                    newState[data.name] = newValue;
                                    this.setState(newState);
                                }
                            }
                        }}>{value}</Paragraph>
                    }
                }
            }
        ];
    }


    render() {
        const {
            loading,
            canSave,
            actionId,
            deviceLabel,
        } = this.state;

        const data = [
            {
                name: 'deviceLabel',
                value: deviceLabel
            },
            {
                name: 'actionId',
                value: actionId
            },
        ]

        return <div>
            <Table columns={this.getColumns()} dataSource={data}/>
            <Button type="primary" loading={loading} block disabled={!canSave} onClick={async () => {
                await this.onSaveClick()
            }}>
                {getLabels()['save'] || 'Save'}
            </Button>
        </div>

    }
}
