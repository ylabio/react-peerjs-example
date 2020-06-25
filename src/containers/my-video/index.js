import React from 'react';

import './style.less';

function MyVideo() {
  return (
    <div className="my-video" id="my_video">
      <div className="my-video__settings"></div>
    </div>
  );
}

export default React.memo(MyVideo);
