import * as React from 'react';
import {
  Button, Select, Table,
} from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { v4 as uuidv4 } from 'uuid';
import { getLabels } from '../utils/Localization';
import { sendToBackend } from '../utils/restCalls';
import { CONTENTS } from './Constants';

export class SmartthingsAddDevice extends React.Component {
    state = {
      loading: false,
      canSave: false,
      deviceLabel: '',
      actionId: '',
      modelYear: 'any',
    };

    async onSaveClick() {
      const {
        deviceLabel,
        actionId,
        modelYear,
      } = this.state;
      this.setState({ loading: true });
      try {
        const id = uuidv4();
        await sendToBackend('/ui/settings/addDevice', 'POST', {
          id, deviceLabel, actionId, modelYear,
        });
        await this.props.reload(CONTENTS.SmartthingsViewDevice, id);
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
            if (data.name === 'actionId') {
              return (
                <Select
                  style={{ width: 600 }}
                  onChange={(event) => {
                    this.onActionChange(event);
                  }}
                >
                  <Select.Option value="doors">{getLabels().doors}</Select.Option>
                  <Select.Option value="hvac">{getLabels().hvac}</Select.Option>
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
                  <Select.Option value="evseSlow">{getLabels().evseSlow}</Select.Option>
                  <Select.Option value="evseFastCharge">{getLabels().evseFastCharge}</Select.Option>
                  <Select.Option value="evseDisableCharge">{getLabels().evseDisableCharge}</Select.Option>
                  <Select.Option value="reboot">{getLabels().reboot}</Select.Option>
                  <Select.Option value="halt">{getLabels().halt}</Select.Option>
                  <Select.Option value="upgrade">{getLabels().upgrade}</Select.Option>
                  <Select.Option value="shutdown2H">{getLabels().shutdown2H}</Select.Option>
                  <Select.Option value="shutdown5H">{getLabels().shutdown5H}</Select.Option>
                  <Select.Option value="shutdown1D">{getLabels().shutdown1D}</Select.Option>
                  <Select.Option value="shutdown2D">{getLabels().shutdown2D}</Select.Option>
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

    render() {
      const {
        loading,
        canSave,
        actionId,
        deviceLabel,
        modelYear,
      } = this.state;

      const data = [
        {
          name: 'deviceLabel',
          value: deviceLabel,
        },
        {
          name: 'actionId',
          value: actionId,
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

      return (
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
        </div>
      );
    }
}
