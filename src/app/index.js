import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Modals from '@app/modals';

import Main from '@app/main';
import About from '@app/about';
import NotFound from '@app/not-found';

import 'antd/dist/antd.css';
import '@theme/style.less';

function App() {
  return (
    <Fragment>
      <Helmet>
        <title>PeerJS & React & Redux</title>
      </Helmet>
      <Switch>
        <Route path="/" exact={true} component={Main} />
        <Route path="/about" exact={true} component={About} />
        <Route component={NotFound} />
      </Switch>
      <Modals />
    </Fragment>
  );
}

export default React.memo(App);
