import React from 'react';
import LayoutContent from '@components/layouts/layout-content';
import HeaderContainer from '@containers/header-container';
import LayoutPage from '@components/layouts/layout-page';

function NotFound(props) {
  return (
    <LayoutPage header={<HeaderContainer />}>
      <LayoutContent>
        <h1>About</h1>
        <p>React Skeleton</p>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(NotFound);
