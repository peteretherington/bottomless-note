import React from 'react';
/* global firebase */

export default class NoteCard extends React.Component {
    constructor(){
        super();
        this.state = {
            editing: false,
            note: {}
        }
        this.save = this.save.bind(this);
    }

    save(e) {
        e.preventDefault();

        const dbRef = firebase.database().ref(this.props.note.key);
        dbRef.update({
            title: this.noteTitle.value,
            text: this.noteText.value
        })

        this.setState({editing: false});
    }

    render(){
        let editingTemp = (
            <div>
                <h3>{this.props.note.title}</h3>
                <p>{this.props.note.text}</p>
            </div>
        )

        if(this.state.editing){
            editingTemp = (
                <form onSubmit={this.save}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input defaultValue={this.props.note.title} type="text" name="title" ref={ref => this.noteTitle = ref}/>
                    </div>
                    <div>
                        <label htmlFor="Note">Note</label>
                        <input defaultValue={this.props.note.text} type="text" name="note" ref={ref => this.noteText = ref}/>
                    </div>
                    <input type="submit" value="Save"/>
                </form>
            )
        }

        return(
            <article>
                <div className="controls">
                    <div onClick={() => this.setState({editing: true})}><i className="fa fa-edit"></i></div>
                    <div onClick={() => this.props.removeNote(this.props.note.key)}><i className="fa fa-times"></i></div>
                </div>
                {editingTemp}
            </article>
        )
    }
}