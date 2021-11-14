import * as React from 'react';
import { Card, Table } from 'antd';
import moment from 'moment';
import Paragraph from 'antd/es/typography/Paragraph';
import TextArea from 'antd/es/input/TextArea';
import { getLabels } from '../utils/Localization';
import { fetchBackend } from '../utils/restCalls';

export class SmartthingsUPS extends React.Component {
    state = {
      loadingPage: true,
      // eslint-disable-next-line react/no-unused-state
      settings: null,
      installation: null,
      installation2: null,
      INA219: null,
      ups_sh: null,
      upsInfo: {
        loadVoltage: undefined,
        current: undefined,
        power: undefined,
        percent: undefined,
        timeToShutDown: undefined,
      },
    };

    async componentDidMount() {
      await this.reload();
      const comp = this;
      setInterval(() => { comp.loadData(comp); }, 10000);
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
            if (data.name === 'installation') {
              return (
                <TextArea
                  autoSize={{ minRows: 5, maxRows: 100 }}
                  value={
                    this.state.settings.data.ups === 'ups1'
                      ? this.state.installation
                      : this.state.installation2
                }
                />
              );
            }
            if (data.name === 'INA219') {
              return (
                <TextArea
                  autoSize={{ minRows: 10, maxRows: 20 }}
                  value={
                  this.state.INA219
                }
                />
              );
            }
            if (data.name === 'ups_sh') {
              return (
                <TextArea
                  autoSize={{ minRows: 4, maxRows: 5 }}
                  value={
                  this.state.ups_sh
                }
                />
              );
            }
            if (data.name === 'upsInfo') {
              return (
                <div>
                  <Card title="Battery Info" style={{ width: 300 }}>
                    { this.state.settings.data.ups === 'ups1'
                      ? (
                        <div>
                          <p>{`Load Voltage: ${this.state.upsInfo.loadVoltage}`}</p>
                          <p>{`Current: ${this.state.upsInfo.current}`}</p>
                          <p>{`Percent: ${this.state.upsInfo.percent}`}</p>
                          <p>{`Power: ${this.state.upsInfo.power}`}</p>
                        </div>
                      )
                      : ''}
                    <p>{`Time to Shutdown: ${this.msToTime(this.state.upsInfo.timeToShutDown)}`}</p>
                  </Card>
                </div>
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

    // eslint-disable-next-line class-methods-use-this
    msToTime(duration) {
      const tempTime = moment.duration(duration);
      return `${tempTime.months() > 0 ? `${tempTime.months()} months:` : ''}${tempTime.days() > 0 ? `${tempTime.days()} days:` : ''}${tempTime.hours() > 0 ? `${tempTime.hours() % 24} hours:` : ''}${tempTime.minutes() > 0 ? `${tempTime.minutes()} mins:` : ''}${tempTime.seconds() > 0 ? `${tempTime.seconds()} secs` : ''}`;
    }

    // eslint-disable-next-line class-methods-use-this
    async loadData(comp) {
      try {
        const upsInfoResp = await fetchBackend('/ui/ups/info');
        comp.setState({
          upsInfo: JSON.parse(upsInfoResp.data),
        });
      } catch (e) {
      // eslint-disable-next-line no-console
        console.log(e);
      }
    }

    currentHost() {
      return `${window.location.protocol}//${window.location.hostname}:${this.state.settings.data.portSMS}`;
    }

    async reload() {
      this.setState({
        loadingPage: true,
      });
      let settings = null;
      let installation = null;
      let installation2 = null;
      let INA219 = null;
      let upsSH = null;
      try {
        const { data } = await fetchBackend('/ui/settings');
        settings = JSON.parse(data);
        const respInst = await fetchBackend('/ups/installation.script');
        installation = respInst.data;
        const respInst2 = await fetchBackend('/ups/installation2.script');
        installation2 = respInst2.data;
        const respINA219 = await fetchBackend('/ups/INA219.py');
        INA219 = respINA219.data;
        const upsSHResp = await fetchBackend('/ups/ups.sh');
        upsSH = upsSHResp.data;
        await this.loadData(this);
      } finally {
        this.setState({
          // eslint-disable-next-line react/no-unused-state
          settings,
          installation,
          installation2,
          INA219,
          ups_sh: upsSH,
          loadingPage: false,
        });
      }
    }

    render() {
      const {
        loadingPage, upsInfo, settings,
      } = this.state;

      const data = [
      ];
      if (!loadingPage) {
        data.push({
          name: 'upsInfo',
          value: upsInfo,
        });

        if (settings.data.ups === 'ups2') {
          data.push({
            name: 'installation',
            value: 'installation2',
          });
        }
        if (settings.data.ups === 'ups1') {
          data.push({
            name: 'INA219',
            value: 'INA219',
          });
          data.push({
            name: 'ups_sh',
            value: 'ups_sh',
          });
          data.push({
            name: 'installation',
            value: 'installation',
          });
        }
      }

      return loadingPage ? <spin /> : (
        <div>
          <Table pagination={false} columns={this.getColumns()} dataSource={data} />
        </div>
      );
    }
}
