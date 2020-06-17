import React, { useCallback } from 'react';
import useSelectorMap from '@utils/hooks/use-selector-map';
import { Form, Input, Button, Checkbox } from 'antd';
import modal from '@store/modal/actions';

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
    items: state.articles.items,
    wait: state.articles.wait,
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
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
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
        <Input />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Connect
        </Button>
      </Form.Item>
    </Form>
  );
}

export default React.memo(PeerJsConnect);
