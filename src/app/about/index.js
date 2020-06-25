import React from 'react';
import { Layout } from 'antd';
import Header from '@containers/header-container';
import Content from '@components/layouts/layout-content';
import Footer from '@components/layouts/layout-footer';

function About() {
  return (
    <Layout className="layout">
      <Header />
      <Content>
        <h1>ABOUT</h1>
        <p>PeerJS example application with React & Redux.</p>
        <p>
          PeerJS wraps the browser's WebRTC implementation to provide a complete, configurable, and
          easy-to-use peer-to-peer connection API. Equipped with nothing but an ID, a peer can
          create a P2P data or media stream connection to a remote peer.
        </p>
      </Content>
      <Footer />
    </Layout>
  );
}

export default React.memo(About);
