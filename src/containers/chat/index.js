import React, { useCallback, useEffect } from 'react';
import useSelectorMap from '@utils/hooks/use-selector-map';
import { Form, Input, Button, Comment, List } from 'antd';
import moment from 'moment';
import conference from '@store/conference/actions';

import './style.less';

function Chat() {
  const [form] = Form.useForm();
  const select = useSelectorMap(state => ({
    messages: state.conference.messages,
    connected: state.conference.connected,
  }));

  const callbacks = {
    sendMessage: useCallback(async message => {
      await conference.sendDataToAll(message);
    }, []),
  };

  useEffect(() => {
    const root = document.getElementById('message_list');
    const list = root.getElementsByClassName('ant-list-items')[0];
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [select.messages.length]);

  const onFinish = values => {
    callbacks.sendMessage(values.message);
    form.resetFields();
  };

  const onFinishFailed = errorInfo => {
    console.error('Failed:', errorInfo);
  };

  return (
    <div>
      <List
        id="message_list"
        className="message-list"
        header={`${select.messages.length} messages`}
        itemLayout="horizontal"
        dataSource={select.messages}
        renderItem={item => (
          <li>
            <Comment
              author={item.peer.nickname}
              content={<p>{item.data}</p>}
              datetime={moment(item.createDate).format('DD MMM HH:mm')}
            />
          </li>
        )}
      />

      <Form
        name="basic"
        layout="inline"
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="message"
          rules={[
            {
              required: true,
              message: 'Please input your message!',
            },
          ]}
        >
          <Input placeholder="Chat message..." style={{ width: 350 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default React.memo(Chat);
