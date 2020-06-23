import React, { useCallback } from 'react';
import useSelectorMap from '@utils/hooks/use-selector-map';
import { Form, Input, Button, Checkbox } from 'antd';
import Chat from '../chat';

function Conference() {
  const select = useSelectorMap(state => ({
    peers: state.conference.peers,
    messages: state.conference.messages,
    connected: state.conference.connected,
    wait: state.conference.wait,
    errors: state.conference.errors,
  }));

  const callbacks = {};

  return (
    <div>
      <div id="peers_video"></div>
      <Chat />
    </div>
  );
}

export default React.memo(Conference);
