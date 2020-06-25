import React, { useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
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

function PeersConnect() {
  const select = useSelectorMap(state => ({
    connected: state.conference.connected,
  }));

  const callbacks = {
    connectWithAll: useCallback(async ({ peerIds }) => {
      await conference.setPeers(peerIds);
      await conference.connectDataWithAll();
      await conference.connectMediaWithAll();
    }, []),
  };

  const onFinish = values => {
    callbacks.connectWithAll(values);
  };

  const onFinishFailed = errorInfo => {
    console.error('Failed:', errorInfo);
  };

  return (
    <Form {...layout} name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.List name="peerIds">
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? layout : tailLayout)}
                  label={index === 0 ? 'Peers' : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: 'Please input peer ID or delete this field.',
                      },
                    ]}
                    noStyle
                  >
                    <Input placeholder="peer_id" style={{ width: '85%' }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      style={{ margin: '0 8px' }}
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item {...tailLayout}>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: '85%' }}
                >
                  <PlusOutlined /> Add peer
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" disabled={!select.connected}>
          Connect Peers
        </Button>
      </Form.Item>
    </Form>
  );
}

export default React.memo(PeersConnect);
