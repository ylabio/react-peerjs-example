import React, { useCallback } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import useSelectorMap from '@utils/hooks/use-selector-map';
import conference from '@store/conference/actions';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 18,
  },
};

function PeerJsConnect() {
  const select = useSelectorMap(state => ({
    connected: state.conference.connected,
    wait: state.conference.wait,
    errors: state.conference.errors,
  }));

  const callbacks = {
    connect: useCallback(async ({ nickname, peerId }) => {
      await conference.connect({ nickname, peerId });
    }, []),
    disconnect: useCallback(async () => {
      await conference.disconnect();
    }, []),
  };

  const onFinish = values => {
    if (select.connected) {
      callbacks.disconnect();
      return;
    }
    callbacks.connect(values);
  };

  const onFinishFailed = errorInfo => {
    console.error('Failed:', errorInfo);
  };

  console.log('select', select);

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ nickname: 'Peter', peerId: 'peter_falk' }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Nickname"
        name="nickname"
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
          },
        ]}
      >
        <Input placeholder="Peter" disabled={select.connected} />
      </Form.Item>

      <Form.Item
        label="Peer ID"
        name="peerId"
        rules={[
          {
            required: true,
            message: 'Please invent and input your ID!',
          },
        ]}
      >
        <Input placeholder="peter_falk" disabled={select.connected} />
      </Form.Item>

      {!!select.errors && (
        <Alert message={select.errors.toString()} type="error" style={{ margin: '10px 0px' }} />
      )}

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={select.wait} disabled={select.wait}>
          {select.connected ? 'Disconnect' : 'Connect'}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default React.memo(PeerJsConnect);
