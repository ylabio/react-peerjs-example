import store from '@store';
import peerJs from '@utils/peer-js';

export const types = {
  SET: Symbol('SET'),
};

export const initState = {
  peers: [], // [{id: 'qq5z3h7k6l111000', name: 'Peter', conn: {...} || null, call: {...} || null}]
  messages: [], // [{peer: {id, name}, data: '...'}]
  peerId: null,
  name: '',
  connected: false,
  wait: false,
  errors: null,
};

const actions = {
  connect: async (name, peers) => {
    store.dispatch({ type: types.SET, payload: { wait: true, errors: null } });
    try {
      const peers = peers.map(peerId => ({ id: peerId, name: '', conn: null, call: null }));
      peerJs.connect(null, peerId => {
        store.dispatch({
          type: types.SET,
          payload: { wait: false, connected: true, peerId, name, peers },
        });
        actions.connectDataWithAll();
        actions.connectMediaWithAll();
      });
    } catch (e) {
      store.dispatch({
        type: types.SET,
        payload: { wait: false, errors: e.message },
      });
      throw e;
    }
  },

  disconnect: async () => {
    store.dispatch({ type: types.SET, payload: { wait: true, errors: null } });
    try {
      const { conference } = store.getState();
      for (let i = 0; i < conference.peers.length; i++) {
        const peer = conference.peers[i];
        if (peer.conn) {
          peer.conn.removeAllListeners();
          peer.conn.close();
        }
        if (peer.call) {
          peer.call.removeAllListeners();
          peer.call.close();
        }
      }
      peerJs.disconnect();
    } catch (e) {
      store.dispatch({
        type: types.SET,
        payload: { wait: false, errors: e.message },
      });
      throw e;
    }
  },

  disconnected: async (err = null) => {
    store.dispatch({
      type: types.SET,
      payload: { connected: false, wait: !!err, errors: err },
    });
  },

  dataDisconnected: async peerId => {
    const { conference } = store.getState();
    const peer = conference.peers.find(item => item.id === peerId);
    if (!peer || !peer.conn) {
      return;
    }

    peer.conn.removeAllListeners();
    const peers = conference.peers.map(item => {
      if (item.id === peerId) {
        item.conn = null;
      }
      return item;
    });
    store.dispatch({ type: types.SET, payload: { peers } });
  },

  mediaDisconnected: async peerId => {
    const { conference } = store.getState();
    const peer = conference.peers.find(item => item.id === peerId);
    if (!peer || !peer.call) {
      return;
    }

    peer.call.removeAllListeners();
    const peers = conference.peers.map(item => {
      if (item.id === peerId) {
        item.call = null;
      }
      return item;
    });
    store.dispatch({ type: types.SET, payload: { peers } });
  },

  connectDataWithAll: async () => {
    const { conference } = store.getState();
    for (let i = 0; i < conference.peers.length; i++) {
      const peer = conference.peers[i];
      if (!peer.conn || !peer.conn.open) {
        peerJs.dataConnect(peer.id, conference.name);
      }
    }
  },

  dataConnected: async conn => {
    const { conference } = store.getState();
    let peers;
    let peer = conference.peers.find(item => item.id === conn.peer);
    if (peer) {
      peers = conference.peers.map(item => {
        if (item.id === conn.peer) {
          return { ...item, conn };
        }
        return item;
      });
    } else {
      const name = conn.metadata ? conn.metadata.name : 'Unknown';
      peers = [...conference.peers, { id: conn.peer, name, conn }];
    }
    store.dispatch({ type: types.SET, payload: { peers } });
  },

  dataRecv: async (peerId, data) => {
    const { conference } = store.getState();
    const peer = conference.peers.find(item => item.id === peerId);
    if (!peer) {
      return;
    }
    const messages = [
      ...conference.messages,
      {
        peer: { id: peer.id, name: peer.name },
        data,
      },
    ];
    store.dispatch({ type: types.SET, payload: { messages } });
  },

  sendDataToAll: async data => {
    try {
      const { conference } = store.getState();
      const peer = { id: conference.peerId, name: conference.name };
      const messages = [...conference.messages, { peer, data }];
      store.dispatch({ type: types.SET, payload: { messages } });

      for (let i = 0; i < conference.peers.length; i++) {
        const peer = conference.peers[i];
        peer.conn && peerJs.sendData(peer.conn, data);
      }
    } catch (e) {
      store.dispatch({
        type: types.SET,
        payload: { wait: false, errors: e.message },
      });
      throw e;
    }
  },

  connectMediaWithAll: async () => {
    const { conference } = store.getState();
    for (let i = 0; i < conference.peers.length; i++) {
      const peer = conference.peers[i];
      if (!peer.call || !peer.call.open) {
        peerJs.mediaCall(peer.id, conference.name);
      }
    }
  },

  mediaConnected: async call => {
    const { conference } = store.getState();
    let peers;
    let peer = conference.peers.find(item => item.id === call.peer);
    if (peer) {
      peers = conference.peers.map(item => {
        if (item.id === call.peer) {
          return { ...item, call: call };
        }
        return item;
      });
    } else {
      const name = call.metadata ? call.metadata.name : 'Unknown';
      peers = [...state.peers, { id: call.peer, name, call }];
    }
    store.dispatch({ type: types.SET, payload: { peers } });
  },
};

export default actions;
