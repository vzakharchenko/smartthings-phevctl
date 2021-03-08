import * as React from 'react';
import {
  Button, Select, Spin, Table,
} from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { PoweroffOutlined } from '@ant-design/icons';
import { getLabels } from '../utils/Localization';
import { fetchBackend, sendToBackend } from '../utils/restCalls';
import { CONTENTS } from './Constants';

export class SmartthingsViewDevice extends React.Component {
    state = {
      loadingPage: false,
      loading: false,
      canSave: false,
      deviceLabel: '',
      actionId: '',
      deviceId: '',
      updatable: false,
      modelYear: '',
    };

    async componentDidMount() {
      await this.reload();
    }

    async componentDidUpdate(prevProps) {
      if (this.props.deviceId !== prevProps.deviceId) {
        await this.reload();
      }
    }

    async onDeleteClick() {
      const {
        deviceId,
      } = this.state;
      this.setState({ loading: true });
      try {
        await sendToBackend('/ui/settings/deleteDevice', 'POST', { deviceId });
        await this.props.reload(CONTENTS.SmartthingsSettings);
      } finally {
        this.setState({ loading: false });
      }
    }

    async onSaveClick() {
      const {
        deviceLabel,
        actionId,
        deviceId,
        modelYear,
      } = this.state;
      this.setState({ loading: true });
      try {
        await sendToBackend('/ui/settings/addDevice', 'POST', {
          id: deviceId, deviceLabel, actionId, modelYear,
        });
        await this.props.reload(CONTENTS.SmartthingsViewDevice, deviceId);
      } finally {
        this.setState({ loading: false });
      }
    }

    async onTestClick() {
      const {
        deviceId,
      } = this.state;
      this.setState({ loading: true });
      try {
        await sendToBackend('/ui/settings/testDevice', 'POST', { id: deviceId });
      } finally {
        this.setState({ loading: false });
      }
    }

    onActionChange(actionId) {
      this.setState({ actionId, canSave: this.validation(null, actionId) });
    }

    onActionYearSelectChange(modelYear) {
      const { actionId } = this.state;
      this.setState({
        modelYear,
        canSave: this.validation(null, actionId),
      });
    }

    getColumns() {
      return [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => (
            <a>
              {
            (text === 'testDevice' && this.state.updatable) ? getLabels().updateValue : getLabels()[text] || text
              }
            </a>
          ),
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          render: (text, data) => {
            const value = this.state[data.name];
            if (data.name === 'actionId') {
              return (
                <Select
                  defaultValue={this.state.actionId}
                  style={{ width: 200 }}
                  disabled={this.state.updatable}
                  onChange={(event) => {
                    this.onActionChange(event);
                  }}
                >
                  <Select.Option value="doors">{getLabels().doors}</Select.Option>
                  <Select.Option value="battery">{getLabels().battery}</Select.Option>
                  <Select.Option value="airconOn">{getLabels().airconOn}</Select.Option>
                  <Select.Option value="airconOff">{getLabels().airconOff}</Select.Option>
                  <Select.Option value="headlightsOn">{getLabels().headlightsOn}</Select.Option>
                  <Select.Option value="headlightsOff">{getLabels().headlightsOff}</Select.Option>
                  <Select.Option value="parkinglightsOn">{getLabels().parkinglightsOn}</Select.Option>
                  <Select.Option value="parkinglightsOff">{getLabels().parkinglightsOff}</Select.Option>
                  <Select.Option value="cooling10Mins">{getLabels().cooling10Mins}</Select.Option>
                  <Select.Option value="cooling20Mins">{getLabels().cooling20Mins}</Select.Option>
                  <Select.Option value="cooling30Mins">{getLabels().cooling30Mins}</Select.Option>
                  <Select.Option value="windscreen10Mins">{getLabels().windscreen10Mins}</Select.Option>
                  <Select.Option value="windscreen20Mins">{getLabels().windscreen20Mins}</Select.Option>
                  <Select.Option value="windscreen30Mins">{getLabels().windscreen30Mins}</Select.Option>
                  <Select.Option value="heating10Mins">{getLabels().heating10Mins}</Select.Option>
                  <Select.Option value="heating20Mins">{getLabels().heating20Mins}</Select.Option>
                  <Select.Option value="heating30Mins">{getLabels().heating30Mins}</Select.Option>
                  <Select.Option value="forceUpdate">{getLabels().forceUpdate}</Select.Option>
                </Select>
              );
            }
            if (data.name === 'modelYear') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.onActionYearSelectChange(event);
                  }}
                  defaultValue={this.state.modelYear || 'any'}
                >
                  <Select.Option value="any">{getLabels().any}</Select.Option>
                  <Select.Option value="2019">{getLabels().phev2019}</Select.Option>
                </Select>
              );
            }
            if (data.name === 'deviceId' || data.name === 'deviceLabel') {
              return value;
            }
            if (data.name === 'testDevice') {
              return (
                <Button
                  type="primary"
                  icon={<PoweroffOutlined />}
                  loading={this.state.loading}
                  onClick={() => this.onTestClick()}
                />
              );
            }
            return (
              <Paragraph editable={{
                onChange: (newValue) => {
                  if (newValue) {
                    const newState = { canSave: this.validation(newValue) };
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

    validation(deviceLabel, actionId) {
      return (deviceLabel || (this.state.deviceLabel && actionId) || this.state.actionId);
    }

    async reload() {
      this.setState({
        loadingPage: true,
      });
      const { data } = await fetchBackend('/ui/settings');
      const settings = JSON.parse(data);
      const device = settings.data.smartthings.devices.find((d) => d.id === this.props.deviceId);
      this.setState({
        actionId: device.actionId,
        deviceLabel: device.deviceLabel,
        deviceId: device.id,
        modelYear: device.modelYear,
        updatable: device.updatable,
        loadingPage: false,
      });
    }

    render() {
      const {
        loading,
        loadingPage,
        canSave,
        actionId,
        deviceId,
        deviceLabel,
        modelYear,
      } = this.state;

      const data = [
        {
          name: 'deviceId',
          value: deviceId,
        },
        {
          name: 'deviceLabel',
          value: deviceLabel,
        },
        {
          name: 'actionId',
          value: actionId,
        },
        {
          name: 'testDevice',
          value: '',
        },
      ];

      if ([
        'cooling10Mins',
        'cooling20Mins',
        'cooling30Mins',
        'windscreen10Mins',
        'windscreen20Mins',
        'windscreen30Mins',
        'heating10Mins',
        'heating20Mins',
        'heating30Mins',
      ].includes(actionId)) {
        data.push({
          name: 'modelYear',
          value: modelYear,
        });
      }

      return loadingPage ? <Spin /> : (
        <div>
          <Table columns={this.getColumns()} dataSource={data} />
          <Button
            type="primary"
            loading={loading}
            block
            disabled={!canSave}
            onClick={async () => {
              await this.onSaveClick();
            }}
          >
            {getLabels().save || 'Save'}
          </Button>
          <Button
            type="primary"
            loading={loading}
            block
            danger
            onClick={async () => {
              await this.onDeleteClick();
            }}
          >
            {getLabels().delete || 'Delete'}
          </Button>
        </div>
      );
    }
}
