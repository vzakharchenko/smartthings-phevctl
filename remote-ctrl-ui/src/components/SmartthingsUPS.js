import * as React from 'react';
import { Table } from 'antd';
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
      INA219: null,
      ups_sh: null,
    };

    async componentDidMount() {
      await this.reload();
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
                  this.state.installation
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

    currentHost() {
      return `${window.location.protocol}//${window.location.hostname}:${this.state.settings.data.portSMS}`;
    }

    async reload() {
      this.setState({
        loadingPage: true,
      });
      let settings = null;
      let installation = null;
      let INA219 = null;
      let upsSH = null;
      try {
        const { data } = await fetchBackend('/ui/settings');
        settings = JSON.parse(data);
        const respInst = await fetchBackend('/ups/installation.script');
        installation = respInst.data;
        const respINA219 = await fetchBackend('/ups/INA219.py');
        INA219 = respINA219.data;
        const upsSHResp = await fetchBackend('/ups/ups.sh');
        upsSH = upsSHResp.data;
      } finally {
        this.setState({
          // eslint-disable-next-line react/no-unused-state
          settings,
          installation,
          INA219,
          ups_sh: upsSH,
          loadingPage: false,
        });
      }
    }

    render() {
      const {
        loadingPage,
      } = this.state;

      const data = [
      ];
      if (!loadingPage) {
        data.push({
          name: 'installation',
          value: 'installation',
        });
        data.push({
          name: 'INA219',
          value: 'INA219',
        });
        data.push({
          name: 'ups_sh',
          value: 'ups_sh',
        });
      }

      return loadingPage ? <spin /> : (
        <div>
          <Table pagination={false} columns={this.getColumns()} dataSource={data} />
        </div>
      );
    }
}
