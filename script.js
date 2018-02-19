const { connect, Provider } = ReactRedux;
const { createStore } = Redux;
const { Component } = React;

const initialState = { }

function reducer (state = initialState, action) {
  return state;
}

const SignInForm = (() => (
  <div className="signin-forum">
      <form>
          <div className="input-wr">
              <label>Name:</label>
              <input value="" placeholder="Name" />
          </div>
          <div className="input-wr">
              <label>Room:</label>
              <input value="" placeholder="Room" />
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

const ChatWindow = (() => (
  <div className="chat-form">
      <div className="chat-log">
          <ChatMessage />
      </div>
      <ChatForm />
  </div>
))

const store = createStore(reducer)
// store.subscribe(() => console.log(store.getState()))

ReactDOM.render(
    <Provider store={store}>
      <div>
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
