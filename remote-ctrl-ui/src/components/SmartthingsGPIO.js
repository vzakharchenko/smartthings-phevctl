import * as React from 'react';
import {
  Alert, Button, Select, Table,
} from 'antd';
import moment from 'moment';
import Paragraph from 'antd/es/typography/Paragraph';
import { getLabels } from '../utils/Localization';
import { fetchBackend, sendToBackend } from '../utils/restCalls';

export class SmartthingsGPIO extends React.Component {
    state = {
      loadingPage: true,
      // eslint-disable-next-line react/no-unused-state
      settings: null,
      changed: false,
      gpioShutdown: 26,
      pullUpDownShutdown: 0,
      edgeShutdown: 2,
      error: '',
      levelShutdown: 1,
    };

    async componentDidMount() {
      await this.reload();
    }

    async onSaveClick() {
      const {
        settings,
        gpioShutdown,
        pullUpDownShutdown,
        edgeShutdown,
        levelShutdown,
      } = this.state;
      this.setState({ loadingPage: true });
      const copyConfig = JSON.parse(JSON.stringify(settings.data));
      copyConfig.gpio.shutdown = {
        gpio: gpioShutdown,
        pullUpDown: pullUpDownShutdown,
        edge: edgeShutdown,
        level: levelShutdown,
      };
      try {
        const res = await sendToBackend('/ui/settings', 'POST', copyConfig);
        const status = JSON.parse(res.data);
        if (status.status === 'OK') {
          const event = { changed: false };
          await this.props.reload();
          await this.reload();
          this.setState(event);
        } else {
          this.setState({ error: `Error: ${status.message}` });
        }
      } catch (e) {
        this.setState({ error: `Error: ${e.message}` });
      } finally {
        this.setState({ loadingPage: false });
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
            if (data.name === 'pullUpDownShutdown') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.setState({
                      pullUpDownShutdown: event,
                      changed: true,
                    });
                  }}
                  defaultValue={this.state.pullUpDownShutdown || '0'}
                >
                  <Select.Option value="0">{getLabels().pullOFF}</Select.Option>
                  <Select.Option value="1">{getLabels().pullDown}</Select.Option>
                  <Select.Option value="2">{getLabels().pullUp}</Select.Option>
                </Select>
              );
            }
            if (data.name === 'levelShutdown') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.setState({
                      levelShutdown: event,
                      changed: true,
                    });
                  }}
                  defaultValue={this.state.levelShutdown || '1'}
                >
                  <Select.Option value="0">0</Select.Option>
                  <Select.Option value="1">1</Select.Option>
                </Select>
              );
            }
            if (data.name === 'edgeShutdown') {
              return (
                <Select
                  style={{ width: 200 }}
                  onChange={(event) => {
                    this.setState({
                      edgeShutdown: event,
                      changed: true,
                    });
                  }}
                  defaultValue={this.state.edgeShutdown || '0'}
                >
                  <Select.Option value="0">{getLabels().risingEdge}</Select.Option>
                  <Select.Option value="1">{getLabels().fallingEdge}</Select.Option>
                  <Select.Option value="2">{getLabels().eitherEdge}</Select.Option>
                </Select>
              );
            }
            return (
              <Paragraph editable={{
                onChange: (newValue) => {
                  if (newValue) {
                    const newState = {};
                    newState[data.name] = newValue;
                    newState.changed = true;
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

    // eslint-disable-next-line class-methods-use-this
    msToTime(duration) {
      const tempTime = moment.duration(duration);
      return `${tempTime.months() > 0 ? `${tempTime.months()} months:` : ''}${tempTime.days() > 0 ? `${tempTime.days()} days:` : ''}${tempTime.hours() > 0 ? `${tempTime.hours() % 24} hours:` : ''}${tempTime.minutes() > 0 ? `${tempTime.minutes()} mins:` : ''}${tempTime.seconds() > 0 ? `${tempTime.seconds()} secs` : ''}`;
    }

    currentHost() {
      return `${window.location.protocol}//${window.location.hostname}:${this.state.settings.data.portSMS}`;
    }

    async reload() {
      this.setState({
        loadingPage: true,
      });
      let settings = null;
      try {
        const { data } = await fetchBackend('/ui/settings');
        settings = JSON.parse(data);
      } finally {
        this.setState({
          // eslint-disable-next-line react/no-unused-state
          settings,
          gpioShutdown: settings.data.gpio.shutdown.gpio,
          pullUpDownShutdown: settings.data.gpio.shutdown.pullUpDown,
          edgeShutdown: settings.data.gpio.shutdown.edge,
          levelShutdown: settings.data.gpio.shutdown.level,
          loadingPage: false,
        });
      }
    }

    render() {
      const {
        loadingPage, gpioShutdown, pullUpDownShutdown, edgeShutdown, levelShutdown, changed, error,
      } = this.state;

      const data = [
      ];
      if (!loadingPage) {
        data.push({
          name: 'gpioShutdown',
          value: gpioShutdown,
        });
        data.push({
          name: 'pullUpDownShutdown',
          value: pullUpDownShutdown,
        });
        data.push({
          name: 'edgeShutdown',
          value: edgeShutdown,
        });
        data.push({
          name: 'levelShutdown',
          value: levelShutdown,
        });
      }

      return loadingPage ? <spin /> : (
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
}
