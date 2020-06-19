import React, { useCallback } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
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
    peers: state.conference.peers,
    peerId: state.conference.peerId,
    nickname: state.conference.nickname,
    connected: state.conference.connected,
    wait: state.conference.wait,
    errors: state.conference.errors,
  }));

  const callbacks = {
    connect: useCallback(async ({ nickname, peerId }) => {
      await conference.connect({ nickname, peerId });
    }, []),
  };

  const onFinish = values => {
    callbacks.connect(values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  console.log('select', select);

  return (
    <Form {...layout} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
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

      <Form.Item {...tailLayout}>
        <Button
          type="primary"
          htmlType="submit"
          loading={select.wait}
          disabled={select.wait || select.connected}
        >
          {select.connected ? 'Connected' : 'Connect'}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default React.memo(PeerJsConnect);
