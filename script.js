const { connect, Provider } = ReactRedux;
const { createStore } = Redux;
const { Component } = React;

const initialState = {
  current: 'SIGN_IN',
  name: 'Guest',
  room: 'Default',
  message: '',
  chatMessages: [{ name: 'Nick', text: 'Hello World.'}]
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

const _SignInForm = (({ current, name, room }) => (
  <div className={ current === 'SIGN_IN' ? 'signin-forum' : 'hide' }>
      <form>
          <div className="input-wr">
              <label>Name:</label>
              <input value={ name } onClick={(event) => event.target.value=""} onChange={(event) => store.dispatch({ type: 'NAME_CHANGE', text: event.target.value })} placeholder="Geust" />
          </div>
          <div className="input-wr">
              <label>Room:</label>
              <input value={ room } onClick={(event) => event.target.value=""} onChange={(event) => store.dispatch({ type: 'ROOM_CHANGE', text: event.target.value })} placeholder="Default" />
          </div>
          <div className="input-wr">
              <button onClick={(event) => { event.preventDefault(); store.dispatch({ type: 'WINDOW_CHANGE', current: 'CHAT' })}}>Join</button>
          </div>
      </form>
  </div>
))

const ChatMessage = (({ name, message }) => (
  <div className="chat-msg"><span className="msg-name">{ name }</span><span className="msg-text">{ message }</span></div>
))

const _ChatMessages = ({messages}) => (
  <div className="chat-log">
      { messages.map((message, index) => <ChatMessage key={index} name={message.name} message={message.text} />) }
  </div>
)

const ChatForm = (() => (
  <div className="input-wr full-width">
      <input value="" placeholder="Message" />
      <button>Chat</button>
  </div>
))

const _ChatWindow = (({ current }) => (
  <div className={ current === 'CHAT' ? 'chat-form' : 'hide' }>
      <ChatMessages />
      <ChatForm />
  </div>
))

const SignInForm = connect(state => ({ current: state.current, name: state.name, room: state.room  }))(_SignInForm);
const ChatMessages = connect(state => ({ messages: state.chatMessages }))(_ChatMessages);
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
