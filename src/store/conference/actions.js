import store from '@store';
import peerJs from '@utils/peer-js';

export const types = {
  SET: Symbol('SET'),
};

export const initState = {
  peers: [], // [{id: 'qq5z3h7k6l111000', nickname: 'Peter', conn: {...} || null, call: {...} || null}]
  messages: [], // [{peer: {id, nickname}, data: '...'}]
  peerId: null,
  nickname: '',
  connected: false,
  wait: false,
  errors: null,
};

const actions = {
  connect: async ({ nickname, peerId = null, peerIds = [] }) => {
    store.dispatch({ type: types.SET, payload: { wait: true, errors: null } });
    try {
      const peers = peerIds.map(peerId => ({
        id: peerId,
        nickname: 'Unknown',
        conn: null,
        call: null,
      }));
      peerJs.connect(peerId || null, peerId => {
        store.dispatch({
          type: types.SET,
          payload: { wait: false, connected: true, peerId, nickname, peers },
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
        peerJs.dataConnect(peer.id, conference.nickname);
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
      const nickname = conn.metadata ? conn.metadata.nickname : 'Unknown';
      peers = [...conference.peers, { id: conn.peer, nickname, conn }];
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
        peer: { id: peer.id, nickname: peer.nickname },
        data,
      },
    ];
    store.dispatch({ type: types.SET, payload: { messages } });
  },

  sendDataToAll: async data => {
    try {
      const { conference } = store.getState();
      const peer = { id: conference.peerId, nickname: conference.nickname };
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
        peerJs.mediaCall(peer.id, conference.nickname);
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
      const nickname = call.metadata ? call.metadata.nickname : 'Unknown';
      peers = [...state.peers, { id: call.peer, nickname, call }];
    }
    store.dispatch({ type: types.SET, payload: { peers } });
  },
};

export default actions;