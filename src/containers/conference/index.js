import React, { useCallback } from 'react';
import useSelectorMap from '@utils/hooks/use-selector-map';
import { Form, Input, Button, Checkbox } from 'antd';
import modal from '@store/modal/actions';

const layout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 34,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

function Conference() {
  const select = useSelectorMap(state => ({
    peers: state.conference.peers,
    messages: state.conference.messages,
    connected: state.conference.connected,
    wait: state.conference.wait,
    errors: state.conference.errors,
  }));

  const callbacks = {
    showInfo: useCallback(async () => {
      const result = await modal.open('info', {
        overflowTransparent: false,
        overflowClose: true,
      });
    }, []),
  };

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      layout="inline"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="message"
        rules={[
          {
            required: false,
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
  );
}

export default React.memo(Conference);
