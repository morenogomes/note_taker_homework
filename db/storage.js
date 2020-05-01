const uuidv4 = require('uuid/v4');
const fs = require("fs");
const util = require("util");


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Storage {
    readFile() {
        return readFileAsync("db/db.json", "utf8");
    }
    writeFile(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note));
    }
    getNotes() {
        return this.readFile().then(notes => {
            let parsedNotes;
            //if notes or note is not an array or can't be turned to one send back an empty array
            try {
                parseNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parseNotes = [];
            } return parsedNotes;
        });
    }
    addNotes(note) {
        const {
            title, text
        } = note;
        if (!title || !text) {
            throw new Error("Add title and text!");
        }
        /// make a variable that is called a new note or for a new note conatin title the text and the id generated by uuid
        const newNote = { title, text, id: uuidv4() };
        return this.getNotes()
        .then(notes => [...notes, newNote])
        .then(updatedNotes => this.writeFile(updatedNotes))
        .then(() => newNote);
    }
    removeNote(id) {
        return this.getNotes()
        .then(notes => notes.filter(note => note.id !== id))
        .then(filterNotes => this.writeFile(filterNotes));
    }
}
//const storage = new store;

module.exports = new Storage;
