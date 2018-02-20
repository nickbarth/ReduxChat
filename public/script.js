const socket = io()

const { connect, Provider } = ReactRedux
const { createStore } = Redux
const { Component } = React

const initialState = {
  current: 'SIGN_IN',
  name: 'Guest',
  room: 'Default',
  chatMessages: [{ name: 'Nick', text: 'Hello World.' }]
}

function reducer (state = initialState, action) {
    switch (action.type) {
    case 'NAME_CHANGE':
      socket.emit('NAME_CHANGE', action.name)
      return { ...state, name: action.name }
    case 'ROOM_CHANGE':
      socket.emit('ROOM_CHANGE', action.room)
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

    if (name !== "") store.dispatch({ type: 'NAME_CHANGE', name })
    else store.dispatch({ type: 'NAME_CHANGE', name: 'Guest' })

    if (room !== "") store.dispatch({ type: 'ROOM_CHANGE', room })
    else store.dispatch({ type: 'ROOM_CHANGE', room: 'Default' })

    store.dispatch({ type: 'WINDOW_CHANGE', current: 'CHAT' })
  }

  render() {
    const { current } = this.props
    const { name, room } = this.state

    return (
      <form onSubmit={ this.formDidSubmit } className={ current === 'SIGN_IN' ? 'signin-forum' : 'hide' }>
          <div className="input-wr">
              <label>Name:</label>
              <input value={ name } onChange={ this.nameDidChange } placeholder="Guest" />
          </div>
          <div className="input-wr">
              <label>Room:</label>
              <input value={ room } onChange={ this.roomDidChange } placeholder="Default" />
          </div>
          <div className="input-wr">
              <button>Join</button>
          </div>
      </form>
    )
  }
}

const ChatMessage = (({ name, message }) => (
  <div className="chat-msg"><span className="msg-name">{ name }</span><span className="msg-text">{ message }</span></div>
))

class _ChatMessages extends Component {
  constructor(props) {
    super(props)
    this.didReceiveMessage.bind(this)()
  }

  didReceiveMessage() {
    const { dispatch } = this.props

    socket.on('ADD_MESSAGE', function (message) {
      console.log('== got message ==')
      console.log(message)
      console.log('== got message ==')
      return dispatch({ type: 'ADD_MESSAGE', message })
    })
  }

  render() {
    const { messages } = this.props

    return (
      <div className="chat-log">
          { messages.map((message, index) => <ChatMessage key={index} name={message.name} message={message.text} />) }
      </div>
    )
  }
}

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

      socket.emit('ADD_MESSAGE', message)
      this.setState({ message: '' })
    }

    this.textInput.focus()
  }

  render() {
    const { message } = this.state

    return (
      <form onSubmit={ this.formDidSubmit }>
          <div className="input-wr full-width">
              <input ref={(input) => { this.textInput = input }} value={ message } onChange={ this.messageDidChange } placeholder="Message" />
              <button>Chat</button>
          </div>
      </form>
    )
  }
}

const _ChatWindow = (({ current }) => (
  <div className={ current === 'CHAT' ? 'chat-form' : 'hide' }>
      <ChatMessages />
      <ChatForm />
  </div>
))

const SignInForm = connect(state => ({ current: state.current, name: state.name, room: state.room  }))(_SignInForm)
const ChatMessages = connect(state => ({ messages: state.chatMessages }))(_ChatMessages)
const ChatForm = connect(state => ({ name: state.name, messages: state.chatMessages }))(_ChatForm)
const ChatWindow = connect(state => ({ current: state.current }))(_ChatWindow)
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
