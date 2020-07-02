import React, { useCallback } from 'react';
import { Button } from 'antd';
import useSelectorMap from '@utils/hooks/use-selector-map';
import conference from '@store/conference/actions';
import Chat from '../chat';

import './style.less';

function Conference() {
  const select = useSelectorMap(state => ({
    peers: state.conference.peers,
    connected: state.conference.connected,
  }));

  const callbacks = {
    shareScreenToAll: useCallback(async () => {
      await conference.shareScreenToAll();
    }, []),
  };

  return (
    <div className="conference">
      <div id="peers_video" className="conference__peers-video"></div>
      <Button
        type="primary"
        disabled={!select.connected && select.peers.length === 0}
        onClick={callbacks.shareScreenToAll}
      >
        Share screen
      </Button>
      <Chat />
    </div>
  );
}

export default React.memo(Conference);
