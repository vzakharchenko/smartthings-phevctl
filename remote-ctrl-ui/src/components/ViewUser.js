import * as React from 'react';
import { Button, Table } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { getLabels } from '../utils/Localization';
import { fetchBackend, sendToBackend } from '../utils/restCalls';
import { CONTENTS } from './Constants';

export class ViewUser extends React.Component {
    state = {
      loadingPage: false,
      loading: false,
      canSave: false,
      username: '',
      password: '',
      userId: '',
    };

    async componentDidMount() {
      await this.reload();
    }

    async componentDidUpdate(prevProps) {
      if (this.props.userId !== prevProps.userId) {
        await this.reload();
      }
    }

    async onSaveClick() {
      const {
        username,
        password,
        userId,
      } = this.state;
      this.setState({ loading: true });
      try {
        const newConfigurations = {
          users: [],
        };
        const id = userId;
        newConfigurations.users.push(
          { id, username, password },
        );
        await sendToBackend('/ui/settings', 'POST', newConfigurations);
        await this.props.reload(CONTENTS.ViewUser, id);
      } finally {
        this.setState({ loading: false });
      }
    }

    async onDeleteClick() {
      const {
        userId,
      } = this.state;
      this.setState({ loading: true });
      try {
        await sendToBackend('/ui/settings/deleteUser', 'POST', { userId });
        await this.props.reload(CONTENTS.SmartthingsSettings);
      } finally {
        this.setState({ loading: false });
      }
    }

    onActionChange(actionId) {
      this.setState({ actionId, canSave: this.validation(null, actionId) });
    }

    getColumns() {
      return [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{getLabels()[text] || text}</a>,
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          render: (text, data) => {
            const value = this.state[data.name];
            return data.name === 'userId' ? value : (
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
                {data.name === 'password' && value ? '*******' : value}
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
      const user = settings.data.users.find((u) => u.id === this.props.userId);
      this.setState({
        username: user.username,
        password: user.password,
        userId: user.id,
        loadingPage: false,
      });
    }

    render() {
      const {
        loadingPage,
        loading,
        canSave,
        username,
        userId,
        password,
      } = this.state;

      const data = [
        {
          name: 'userId',
          value: userId,
        },
        {
          name: 'username',
          value: username,
        },
        {
          name: 'password',
          value: password,
        },
      ];

      return loadingPage ? <spin /> : (
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
