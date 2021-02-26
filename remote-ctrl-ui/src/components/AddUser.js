import * as React from 'react';
import { Button, Table } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { v4 as uuidv4 } from 'uuid';
import { getLabels } from '../utils/Localization';
import { sendToBackend } from '../utils/restCalls';

export class AddUser extends React.Component {
    state = {
      loading: false,
      canSave: false,
      username: '',
      password: '',
    };

    async onSaveClick() {
      const {
        username,
        password,
      } = this.state;
      this.setState({ loading: true });
      try {
        const newConfigurations = {
          users: [],
        };
        const id = uuidv4();
        newConfigurations.users.push(
          { id, username, password },
        );
        await sendToBackend('/ui/settings', 'POST', newConfigurations);
        await this.props.reload(CONTENTS.ViewUser, id);
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
            return (
              <Paragraph editable={{
                onChange: (newValue) => {
                  if (newValue) {
                    const d = {};
                    d[data.name] = newValue;
                    const newState = { canSave: this.validation(d) };
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

    validation(data) {
      return (data.username || this.state.username) && (data.password || this.state.password);
    }

    render() {
      const {
        loading,
        canSave,
        username,
        password,
      } = this.state;

      const data = [
        {
          name: 'username',
          value: username,
        },
        {
          name: 'password',
          value: password,
        },
      ];

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
