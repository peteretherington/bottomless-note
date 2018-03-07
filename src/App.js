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
      notes: []
    }
    this.showSidebar = this.showSidebar.bind(this);
    this.addNote = this.addNote.bind(this);
    // this.removeNote = this.removeNote.bind(this);
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();
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
  }

  showSidebar(e) {
    e.preventDefault();

    this.sidebar.classList.toggle('show');
  }

  addNote(e) {
    e.preventDefault();

    const dbRef = firebase.database().ref();
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
    const dbRef = firebase.database().ref(noteID);
    dbRef.remove();
  }

  render() {
    return (
      <main>
        <header className="container">
          <h1>Bottomless Note</h1>
          <nav>
            <a href="" onClick={this.showSidebar}>Add Note</a>
          </nav>
        </header>
        <section className="notes container">
          {this.state.notes.map((note, i) => {
            return(
              <NoteCard note={note} key={i} removeNote={this.removeNote} />
            )
          })}
        </section>
        <aside className="sidebar" ref={ref => this.sidebar = ref}>
          <form className="container">
            <h3>Add New Note</h3>
            <div className="close-btn" onClick={this.showSidebar}>
              <i className="fa fa-times"></i>
            </div>
            <label htmlFor="note-title">Title:</label>
            <input type="text" name="note-title" ref={ref => this.noteTitle = ref} />
            <label htmlFor="note-text">Text:</label>
            <textarea name="note-text" ref={ref => this.noteText = ref} />
            <input type="submit" value="Add New Note" onClick={this.addNote} />
          </form>
        </aside>
      </main>
    );
  }
}

export default App;
