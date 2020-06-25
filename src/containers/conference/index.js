import React from 'react';
import Chat from '../chat';

import './style.less';

function Conference() {
  return (
    <div className="conference">
      <div id="peers_video" className="conference__peers-video"></div>
      <Chat />
    </div>
  );
}

export default React.memo(Conference);
