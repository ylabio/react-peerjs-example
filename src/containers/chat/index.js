import React, { useCallback } from 'react';
import useSelectorMap from '@utils/hooks/use-selector-map';
import { Form, Input, Button, Comment, List } from 'antd';
import moment from 'moment';
import conference from '@store/conference/actions';

import './style.less';

function Chat() {
  const select = useSelectorMap(state => ({
    peers: state.conference.peers,
    messages: state.conference.messages,
    connected: state.conference.connected,
  }));

  const callbacks = {
    sendMessage: useCallback(async message => {
      await conference.sendDataToAll(message);
    }, []),
  };

  const onFinish = values => {
    callbacks.sendMessage(values.message);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div>
      <Form name="basic" layout="inline" onFinish={onFinish} onFinishFailed={onFinishFailed}>
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

      <List
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
    </div>
  );
}

export default React.memo(Chat);
