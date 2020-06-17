import React from 'react';
import { Layout, Menu } from 'antd';
import Header from '@containers/header-container';
import Content from '@components/layouts/layout-content';
import Footer from '@components/layouts/layout-footer';
import Conference from '@containers/conference';
import PeerJsConnect from '@containers/peerjs-connect';

const { Sider } = Layout;

function Main() {
  return (
    <Layout className="layout">
      <Header />
      <Layout>
        <Sider
          width={350}
          style={{ background: '#ffffff', borderRight: '1px solid #eee', padding: '30px 15px' }}
        >
          <PeerJsConnect />
        </Sider>
        <Layout>
          <Content>
            <Conference />
          </Content>
        </Layout>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default React.memo(Main);
