import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import Header from '@containers/header-container';
import Content from '@components/layouts/layout-content';
import Footer from '@components/layouts/layout-footer';

function NotFound() {
  return (
    <Fragment>
      <Helmet>
        <title>404</title>
        <meta name="status" content="404" />
      </Helmet>
      <Layout className="layout">
        <Header />
        <Content>
          <h1>404</h1>
          <p>Page not found</p>
          <Link to="/">Home</Link>
        </Content>
        <Footer />
      </Layout>
    </Fragment>
  );
}

export default React.memo(NotFound);
