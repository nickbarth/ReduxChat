const { connect, Provider } = ReactRedux;
const { createStore } = Redux;
const { Component } = React;

const initialState = {
  current: 'SIGN_IN',
  name: 'Guest',
  room: 'Default',
  chatMessages: [{ name: 'Nick', text: 'Hello World.'}]
}

function reducer (state = initialState, action) {
    switch (action.type) {
    case 'NAME_CHANGE':
      return { ...state, name: action.name }
    case 'ROOM_CHANGE':
      return { ...state, room: action.room }
    case 'ADD_MESSAGE':
      return { ...state, chatMessages: action.messages }
    case 'WINDOW_CHANGE':
      return { ...state, current: action.current }
  }
  return state
}

class _SignInForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: (props.name === 'Guest') ? '' : props.name,
      room: (props.room === 'Default') ? '' : props.room
    }

    this.nameDidChange = this.nameDidChange.bind(this)
    this.roomDidChange = this.roomDidChange.bind(this)
    this.formDidSubmit = this.formDidSubmit.bind(this)
  }

  nameDidChange(event) {
    this.setState({ name: event.target.value })
  }

  roomDidChange(event) {
    this.setState({ room: event.target.value })
  }

  formDidSubmit(event) {
    event.preventDefault()
    const { name, room } = this.state

    if (name !== "")
      store.dispatch({ type: 'NAME_CHANGE', name })

    if (room !== "")
      store.dispatch({ type: 'ROOM_CHANGE', room })

    store.dispatch({ type: 'WINDOW_CHANGE', current: 'CHAT' })
  }

  render() {
    const { current } = this.props
    const { name, room } = this.state

    return (
      <div className={ current === 'SIGN_IN' ? 'signin-forum' : 'hide' }>
          <form>
              <div className="input-wr">
                  <label>Name:</label>
                  <input value={ name } onChange={ this.nameDidChange } placeholder="Guest" />
              </div>
              <div className="input-wr">
                  <label>Room:</label>
                  <input value={ room } onChange={ this.roomDidChange } placeholder="Default" />
              </div>
              <div className="input-wr">
                  <button onClick={ this.formDidSubmit }>Join</button>
              </div>
          </form>
      </div>
    )
  }
}

const ChatMessage = (({ name, message }) => (
  <div className="chat-msg"><span className="msg-name">{ name }</span><span className="msg-text">{ message }</span></div>
))

const _ChatMessages = ({messages}) => (
  <div className="chat-log">
      { messages.map((message, index) => <ChatMessage key={index} name={message.name} message={message.text} />) }
  </div>
)

class _ChatForm extends Component {
  constructor(props) {
    super(props)

    this.state = { message: '' }
    this.messageDidChange = this.messageDidChange.bind(this)
    this.formDidSubmit = this.formDidSubmit.bind(this)
  }

  messageDidChange(event) {
    this.setState({ message: event.target.value })
  }

  formDidSubmit(event) {
    event.preventDefault()
    const { name, messages } = this.props
    const { message } = this.state

    if (message !== "") {
      store.dispatch({ type: 'ADD_MESSAGE', messages: [
        ...messages, { name, text: message }
      ]})

      this.setState({ message: '' })
    }
  }

  render() {
    const { message } = this.state

    return (
      <div className="input-wr full-width">
          <input value={ message } onChange={ this.messageDidChange } placeholder="Message" />
          <button onClick={ this.formDidSubmit }>Chat</button>
      </div>
    )
  }
}

const _ChatWindow = (({ current }) => (
  <div className={ current === 'CHAT' ? 'chat-form' : 'hide' }>
      <ChatMessages />
      <ChatForm />
  </div>
))

const SignInForm = connect(state => ({ current: state.current, name: state.name, room: state.room  }))(_SignInForm);
const ChatMessages = connect(state => ({ messages: state.chatMessages }))(_ChatMessages);
const ChatForm = connect(state => ({ name: state.name, messages: state.chatMessages }))(_ChatForm);
const ChatWindow = connect(state => ({ current: state.current }))(_ChatWindow);
const store = createStore(reducer)

store.subscribe(() => console.log(store.getState()))

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
