import React from 'react';
import './App.css';
import NoteCard from './notesCard';

const config = {
  apiKey: "AIzaSyBnIdUniqvfJm37tHz-jMGQUNa5smTOhm4",
  authDomain: "notepad-56db9.firebaseapp.com",
  databaseURL: "https://notepad-56db9.firebaseio.com",
  projectId: "notepad-56db9",
  storageBucket: "notepad-56db9.appspot.com",
  messagingSenderId: "1037101180196"
}; /* global firebase */
firebase.initializeApp(config);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      loggedin: false
    }
    this.showSidebar = this.showSidebar.bind(this);
    this.addNote = this.addNote.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.loginAccount = this.loginAccount.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        const dbRef = firebase.database().ref(`users/${user.uid}/notes`);
        dbRef.on('value', (res) => {
          const userData = res.val();
          const dataArray = [];
          for(let key in res.val()){
            userData[key].key = key;
            dataArray.push(userData[key]);
          }
          this.setState({
            notes: dataArray
          })
        })
      }else{
        this.setState({
          notes: [],
          loggedin: false
        })
      }
    })
  }

  showSidebar(e) {
    e.preventDefault();
    this.sidebar.classList.toggle('show');
  }

  addNote(e) {
    e.preventDefault();
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref(`users/${uid}/notes`);
    const note = {
      title: this.noteTitle.value,
      text: this.noteText.value
    }
    dbRef.push(note);

    this.noteTitle.value = "";
    this.noteText.value = "";
    this.showSidebar(e);
  }

  removeNote(noteID) {
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase.database().ref(`users/${uid}/notes/${noteID}`);
    dbRef.remove();
  }

  showSignUp(e) {
    e.preventDefault();
    // this.overlay.classList.toggle('show');
    this.signUp.classList.toggle('show');
  }

  showLogin(e) {
    e.preventDefault();
    // this.overlay.classList.toggle('show');
    this.login.classList.toggle('show');
  }

  createAccount(e) {
    e.preventDefault();
    //Check the passwords match
    const email = this.createEmail.value;
    const password = this.createPassword.value;
    const confirm = this.confirmPassword.value;
    if( password === confirm ){
      //If true, create account
      firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res)=>{
          this.showSignUp(e);
        })
        .catch((err)=>{
          alert(err.message);
        })
    }else{
      alert("Invalid: Passwords must match");
    }
  }

  loginAccount(e) {
    e.preventDefault();
    const email = this.userEmail.value;
    const password = this.userPassword.value;
    firebase.auth()
      .signInWithEmailAndPassword(email,password)
      .then((res)=>{
        this.showLogin(e);
        this.setState({
          loggedin: true
        })
      })
      .catch((err)=>{
        alert('Invalid: Incorrect credentials');
      })
  }

  logoutAccount(e) {
    e.preventDefault();
    firebase.auth().signOut();
  }

  renderCards() {
    if( this.state.loggedin ){
      return this.state.notes.map((note, i) => {
        return(
          <NoteCard note={note} key={i} removeNote={this.removeNote} />
        )
      }).reverse()
    }else{
      return <h2>* Login to add notes *</h2>
    }
  }

  render() {
    return (
      <main>
        <header className="container">
          <h1>Bottomless Note</h1>
          <nav>
            {
              (()=>{
                if( this.state.loggedin ){
                  return(
                    <div>
                      <a href="" onClick={this.showSidebar}>Add Note</a>
                      <a href="" onClick={this.logoutAccount}>Logout</a>
                    </div>
                  )
                }else{
                  return(
                    <div>
                      <a href="" onClick={this.showLogin}>Login</a>
                      <a href="" onClick={this.showSignUp}>Create Account</a>
                    </div>
                  )
                }
              })()
            }

          </nav>
        </header>
        
        {/* <div className="overlay" ref={ref => this.overlay = ref}></div> */}
        
        <div className="login modal" ref={ref => this.login = ref}>
            <div className="close" onClick={this.showLogin}>
                <i className="fa fa-times"></i>
            </div>
            <form action="" onSubmit={this.loginAccount}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" ref={ref => this.userEmail = ref}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" ref={ref => this.userPassword = ref}/>
                </div>
                <div>
                    <input type="submit" value="Login"/>
                </div>
            </form>
        </div>

        <div className="signUp modal" ref={ref => this.signUp = ref}>
            <div className="close" onClick={this.showSignUp}>
                <i className="fa fa-times"></i>
            </div>
            <form action="" onSubmit={this.createAccount}>
                <div>
                    <label htmlFor="createEmail">Email</label>
                    <input type="email" name="createEmail" ref={ref => this.createEmail = ref}/>
                </div>
                <div>
                    <label htmlFor="createPassword">Password</label>
                    <input type="password" name="createPassword" ref={ref => this.createPassword = ref}/>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref}/>
                </div>
                <div>
                    <input type="submit" value="Create Account"/>
                </div>
            </form>
        </div>

        <section className="notes container">
          {this.renderCards()}
        </section>

        <aside className="sidebar" ref={ref => this.sidebar = ref}>
          <form className="container" onSubmit={this.addNote} >
            <h3>Add New Note</h3>
            <div className="close-btn" onClick={this.showSidebar}>
              <i className="fa fa-times"></i>
            </div>
            <label htmlFor="note-title">Title:</label>
            <input type="text" name="note-title" ref={ref => this.noteTitle = ref} />
            <label htmlFor="note-text">Text:</label>
            <textarea name="note-text" ref={ref => this.noteText = ref} />
            <input type="submit" value="Add New Note"/>
          </form>
        </aside>
      </main>
    );
  }
}

export default App;
