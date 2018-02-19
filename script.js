const { connect, Provider } = ReactRedux;
const { createStore } = Redux;
const { Component } = React;

const initialState = {
  current: 'SIGN_IN',
  name: 'Guest',
  room: 'Default',
  message: '',
  chatMessages: []
}

function reducer (state = initialState, action) {
    switch (action.type) {
    case 'NAME_CHANGE':
      return { ...state, name: action.name }
    case 'ROOM_CHANGE':
      return { ...state, room: action.room }
    case 'MESSAGE_CHANGE':
      return { ...state, message: action.message }
    case 'WINDOW_CHANGE':
      return { ...state, current: action.current }
  }
  return state;
}

const _SignInForm = (({ current }) => (
  <div className={ current === 'SIGN_IN' ? 'signin-forum' : 'hide' }>
      <form>
          <div className="input-wr">
              <label>Name:</label>
              <input value="" placeholder="Geust" />
          </div>
          <div className="input-wr">
              <label>Room:</label>
              <input value="" placeholder="Default" />
          </div>
          <div className="input-wr">
              <button>Join</button>
          </div>
      </form>
  </div>
))

const ChatMessage = (() => (
  <div className="chat-msg"><span className="msg-name">Name</span><span className="msg-text">Here is a test message for styling.</span></div>
))

const ChatForm = (() => (
  <div className="input-wr full-width">
      <input value="" placeholder="Message" />
      <button>Chat</button>
  </div>
))

const _ChatWindow = (({ current }) => (
  <div className={ current === 'CHAT' ? 'chat-form' : 'hide' }>
      <div className="chat-log">
          <ChatMessage />
      </div>
      <ChatForm />
  </div>
))

const SignInForm = connect(state => ({ current: state.current }))(_SignInForm);
const ChatWindow = connect(state => ({ current: state.current }))(_ChatWindow);
const store = createStore(reducer)
// store.subscribe(() => console.log(store.getState()))

ReactDOM.render(
    <Provider store={store}>
      <div>
        <SignInForm />
        <ChatWindow />
      </div>
    </Provider>,
    document.getElementById('app')
)

/*
const sock = new WebSocket("ws://127.0.0.1:1234")

sock.onopen = function() {
    console.log("connected")
}

sock.onclose = function(e) {
    console.log("connection closed (" + e.code + ")")
}

sock.onmessage = function(e) {
    console.log("message received: " + e.data)
}

function send() {
    var msg = document.getElementById('message').value
    sock.send(msg)
}
*/
