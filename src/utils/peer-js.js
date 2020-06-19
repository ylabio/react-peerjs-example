import * as actions from '@store/actions';
import CONFIG from '../config';

class PeerJs {
  configure(store) {
    this.store = store;
    this.peer = null;
    this.peerId = null;
    this.userMedia = null;
    this.elements = []; // [{peerId, elm}]
    this.error = null;
    this.mediaConfig = {
      audio: true,
      video: true,
    };
  }

  // Соединение с PeerJs сервером и подписываение на события
  connect(peerId = null, callback) {
    // If connected then do nothing
    if (this.isConnected()) {
      callback && callback(this.peerId);
      return;
    }

    if (!this.userMedia) {
      // Запрашиваем доступ к микрофону и видео камере
      this.userMedia =
        navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    }

    if (!this.isDestroyed()) {
      // Reconnect
      // console.log('reConnecting...');
      this.reconnect();
      return;
    }

    // New connect
    // console.log('connecting...');
    this.peer = new Peer(peerId, CONFIG.peerJsServer);

    // Событие при установке соединения с сервером PeerJs
    this.peer.on('open', id => {
      // console.log('peer opened:', id);
      this.peerId = id;
      this.error = null;
      callback && callback(this.peerId);
    });

    // На данное событие не реагируем. Достаточно события disconnected.
    // this.peer.on('close', () => {
    //   console.log('peer closed');
    //   this.error === null && this._onDisconnected();
    // });

    // Событие будет вызвано, как при ручном дисконнекте, так и при error
    this.peer.on('disconnected', () => {
      // console.log('peer disconnected');
      // Если было событие error, то повторно _onDisconnected не вызываем
      this.error === null && this._onDisconnected();
    });

    // После события error будет вызвано событие disconnected и потом close
    this.peer.on('error', err => {
      // console.log('peer error:', err);
      this.error = err;
      this._onDisconnected(true, err);
      // reconnect infinitely every 1 sec.
      setTimeout(() => {
        // реконнектим со старым peerId
        this.connect(this.peerId, callback);
      }, 1000);
    });

    // Событие при входящем соединении типа data
    this.peer.on('connection', conn => this._onDataConnected(conn));

    // Событие при входящем соединении типа media
    this.peer.on('call', call => {
      this.userMedia(
        this.mediaConfig,
        stream => {
          call.answer(stream);
          this._onMediaConnected(call);
        },
        err => {
          console.error('Failed to get local stream', err);
        },
      );
    });
  }

  // Повторное соединение с PeerJs со старым peerId
  reconnect() {
    !this.isDestroyed() && this.peer.reconnect();
  }

  // Отсоединение от PeerJs сервера
  disconnect() {
    if (!this.peer) {
      return;
    }

    this.peer.disconnect();
    this.elements.forEach(item => item.elm.remove());
    this.elements = [];
  }

  // Соединение с участником по типу data
  dataConnect(peerId, name) {
    if (!this.isConnected()) {
      return;
    }

    const conn = this.peer.connect(peerId, { metadata: { id: peerId, name } });
    conn.on('open', () => this._onDataConnected(conn));
  }

  // Соединение с участником по типу media
  mediaCall(peerId, name) {
    if (!this.isConnected()) {
      return;
    }

    this.userMedia(
      this.mediaConfig,
      stream => {
        const call = this.peer.call(peerId, stream, { metadata: { id: peerId, name } });
        this._onMediaConnected(call);
      },
      err => {
        console.error('Failed to get local stream', err);
      },
    );
  }

  // Отправка сообщения другому участнику
  sendData(conn, data) {
    if (!conn || !conn.open || !data) {
      return;
    }
    conn.send(data);
  }

  // Есть ли соединение с сервером
  isConnected() {
    return this.peer && !this.peer.disconnected && !this.peer.destroyed;
  }

  // Уничтожено ли соединение (реконнект в таком случае невозможен)
  isDestroyed() {
    return !this.peer || this.peer.destroyed;
  }

  removeElementBy(peerId) {
    const index = this.elements.findIndex(item => item.peerId === peerId);
    if (index !== -1) {
      this.elements[index].elm.remove();
      this.elements.splice(index, 1);
    }
  }

  // Вызов экшена при дисконнекте
  _onDisconnected(clearPeer = false, err) {
    if (clearPeer) {
      this.peer = null;
    }
    this.store.dispatch(actions.conference.disconnected(err));
  }

  // Вызов экшена и подписка на события data соединении
  _onDataConnected(conn) {
    // console.log('data conn opened:', conn);
    this.store.dispatch(actions.conference.dataConnected(conn));
    conn.on('data', data => this._onDataRecv(conn.peer, data));
    conn.on('close', () => this._onDataDisconnected(conn));
    conn.on('error', err => this._onDataDisconnected(conn, err));
  }

  // Вызов экшена при получении data сообщения
  _onDataRecv(peerId, data) {
    // console.log('recv data:', peerId, data);
    this.store.dispatch(actions.conference.dataRecv(peerId, data));
  }

  // Когда участник отсоединяется от data соединения
  // err === null - подразумевается, что участник отсоединился намеренно
  // err !== null - пытаемся сделать реконнект с участником, если инциатор - мы
  _onDataDisconnected(conn, err = null) {
    // console.log('data disconnected', conn.peer, conn.metadata, err);
    this.store.dispatch(actions.conference.dataDisconnected(conn.peer, err));
  }

  // Вызов экшена и подписка на события media соединении
  _onMediaConnected(call) {
    // console.log('media conn opened:', call);
    this.store.dispatch(actions.conference.mediaConnected(call));
    call.on('stream', remoteStream => this._onStreamEvent(call.peer, remoteStream));
    call.on('close', () => this._onMediaDisconnected(call));
    call.on('error', err => this._onMediaDisconnected(call, err));
  }

  // Когда участник отсоединяется от media соединения
  // err === null - подразумевается, что участник отсоединился намеренно
  // err !== null - пытаемся сделать реконнект с участником, если инциатор - мы
  _onMediaDisconnected(call, err = null) {
    // console.log('media disconnected', call.peer, call.metadata, err);
    this.store.dispatch(actions.conference.mediaDisconnected(call.peer, err));
    this.removeElementBy(call.peer);
  }

  // Создание аудио/видео элемента на странице и привязка к нему stream с участником
  // Все элементы мы помещаем в this.elements, чтобы при дисконнекте их уничтожить
  _onStreamEvent(peerId, remoteStream) {
    const tag = !this.mediaConfig.video ? 'audio' : 'video';
    const elm = document.createElement(tag);
    this.elements.push({ peerId, elm });
    elm.srcObject = remoteStream;
    elm.play();
  }
}

const peerJs = new PeerJs();

export default peerJs;
