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
    this.showModal = this.showModal.bind(this);
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
          const userData = res.val(); // Store the note data
          const dataArray = [];
          for(let key in res.val()){
            userData[key].key = key; // Store the object ID inside of itself
            dataArray.push(userData[key]); // Push the object into an array
          }
          this.setState({
            notes: dataArray,
            loggedin: true,
          })
        })
      }else{
        this.setState({
          notes: [],
          loggedin: false,
        })
      }
    })
  }

  createAccount(e) {
    e.preventDefault();
    //Check the passwords match
    const email = this.createEmail.value;
    const username = this.createUsername.value;
    const password = this.createPassword.value;
    const confirm = this.confirmPassword.value;
    if( password === confirm ){
      //If true, create account
      firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res)=>{
          const user = firebase.auth().currentUser;
          user.updateProfile({displayName: username});
          this.showSignUp(e);
          this.setState({loggedin: true});
        })
        .catch((err)=>{
          alert(err.message);
        })
    }else{
      alert("The second password does NOT match the first.");
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
        alert("Those credentials do NOT match any of our accounts.");
      })
  }

  logoutAccount(e) {
    e.preventDefault();
    if( window.confirm("Confirm logout") ){
      firebase.auth().signOut();
    }
  }

  showModal(e) {
    e.preventDefault();
    this.modal.classList.toggle('show');
  }

  showSignUp(e) {
    e.preventDefault();
    this.signUp.classList.toggle('show');
  }

  showLogin(e) {
    e.preventDefault();
    this.login.classList.toggle('show');
  }

  addNote(e) {
    e.preventDefault();
    const user = firebase.auth().currentUser;
    const dbRef = firebase.database().ref(`users/${user.uid}/notes`);
      // Create and format current date
      let date = null;
      const fullDate = '' + new Date();
      const splitDate = fullDate.split(' ', 5);
      let shortDate = '';
      for (let i = 0; i < splitDate.length; i++) {
        shortDate += splitDate[i] + ' ';
      }
      date = shortDate.slice(4, -10);
    const note = {
      date: date,
      title: this.noteTitle.value,
      text: this.noteText.value
    }
    dbRef.push(note);
    this.noteTitle.value = "";
    this.noteText.value = "";
    this.showModal(e);
  }

  removeNote(noteID) {
    if(window.confirm('Are you sure you want to DELETE this note? This action CANNOT be reversed.')){
      const user = firebase.auth().currentUser;
      const dbRef = firebase.database().ref(`users/${user.uid}/notes/${noteID}`);
      dbRef.remove();
    }
  }

  renderCards() {
    if( this.state.loggedin ){
      return this.state.notes.map( (note, i)=>{
        return(
          <NoteCard note={note} key={i} removeNote={this.removeNote} />
        )
      }).reverse()
    }else{
      return (
        <div className="ctaLogin">
          <h2><span>Weclome to Bottomless Note!</span><span>This site is free to use.</span><span>Log in to begin adding notes.</span></h2>
        </div>
      )
    }
  }

  render() {
    return (
      <main>
        <header>
          <div className="container">
            <h1>Bottomless Note</h1>
            <nav>
              {
                (()=>{
                  if( this.state.loggedin ){
                    return(
                      <div>
                        <p>Welcome, <span>{firebase.auth().currentUser.displayName || firebase.auth().currentUser.email}</span></p>
                        <a className="btn-yellow" href="" onClick={this.showModal}>Add Note</a>
                        <a className="btn-red" href="" onClick={this.logoutAccount}>Logout</a>
                      </div>
                    )
                  }else{
                    return(
                      <div>
                        <a className="btn-yellow" href="" onClick={this.showLogin}>Login</a>
                        <a className="btn-green" href="" onClick={this.showSignUp}>Create Account</a>
                      </div>
                    )
                  }
                })()
              }
            </nav>
          </div>
        </header>
        
        <div className="login modal" ref={ref => this.login = ref}>
            <div className="close" onClick={this.showLogin}>
                <i className="fa fa-times"></i>
            </div>
            <form action="" onSubmit={this.loginAccount}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input required type="email" name="email" ref={ref => this.userEmail = ref}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input required type="password" name="password" ref={ref => this.userPassword = ref}/>
                </div>
                <div>
                    <input className="btn-yellow" type="submit" value="Login"/>
                </div>
            </form>
        </div>

        <div className="signUp modal" ref={ref => this.signUp = ref}>
            <div className="close" onClick={this.showSignUp}>
                <i className="fa fa-times"></i>
            </div>
            <form action="" onSubmit={this.createAccount}>
                <div>
                    <label htmlFor="createEmail">Email *</label>
                    <input required type="email" name="createEmail" ref={ref => this.createEmail = ref}/>
                </div>
                <div>
                    <label htmlFor="createUsername">Username (optional)</label>
                    <input type="text" name="createUsername" ref={ref => this.createUsername = ref}/>
                </div>
                <div>
                    <label htmlFor="createPassword">Password *</label>
                    <input required type="password" name="createPassword" ref={ref => this.createPassword = ref}/>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <input required type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref}/>
                </div>
                <div>
                    <input className="btn-green" type="submit" value="Create Account"/>
                </div>
            </form>
        </div>

        <section className="notes container">
          {this.renderCards()}
        </section>

        <aside className="addNote modal" ref={ref => this.modal = ref}>
          <form onSubmit={this.addNote} >
            <h3>Add New Note</h3>
            <div className="close" onClick={this.showModal}>
              <i className="fa fa-times"></i>
            </div>
            <div>
            <label htmlFor="note-title">Title:</label>
            <input type="text" name="note-title" ref={ref => this.noteTitle = ref} />
            </div>
            <div>
            <label htmlFor="note-text">Text:</label>
            <textarea name="note-text" ref={ref => this.noteText = ref} />
            </div>
            <div>
            <input className="btn-yellow" type="submit" value="Add New Note"/>
            </div>
          </form>
        </aside>
      </main>
    );
  }
}

export default App;
