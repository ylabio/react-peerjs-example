import React from 'react';
import { Layout } from 'antd';
import Header from '@containers/header-container';
import Content from '@components/layouts/layout-content';
import Footer from '@components/layouts/layout-footer';
import Conference from '@containers/conference';

function Main() {
  return (
    <Layout className="layout">
      <Header />
      <Content>
        <Conference />
      </Content>
      <Footer />
    </Layout>
  );
}

export default React.memo(Main);
