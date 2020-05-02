// const uuidv4 = require('uuid/v4'); 
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const util = require("util");


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// class Storage {
//     readFile() {
//         return readFileAsync("db/db.json", "utf8");
//     }
//     writeFile(note) {
//         return writeFileAsync("db/db.json", JSON.stringify(note));
//     }
//     getNotes() {
//         return this.readFile().then(notes => {
//             let parsedNotes;
//             //if notes or note is not an array or can't be turned to one send back an empty array
//             try {
//                 parseNotes = [].concat(JSON.parse(notes));
//             } catch (err) {
//                 parseNotes = [];
//             } return parsedNotes;
//         });
//     }
//     addNotes(note) {
//         const {
//             title, text
//         } = note;
//         if (!title || !text) {
//             throw new Error("Add title and text!");
//         }
//         /// make a variable that is called a new note or for a new note conatin title the text and the id generated by uuid
//         const newNote = { title, text, id: uuidv4() };
//         return this.getNotes()
//         .then(notes => [...notes, newNote])
//         .then(updatedNotes => this.writeFile(updatedNotes))
//         .then(() => newNote);
//     }
//     removeNote(id) {
//         return this.getNotes()
//         .then(notes => notes.filter(note => note.id !== id))
//         .then(filterNotes => this.writeFile(filterNotes));
//     }
// }

// module.exports = new Storage;

class Storage {
    constructor() {
      this.lastId = 0;
    }
  
    read() {
      return readFileAsync("db/db.json", "utf8");
    }
  
    write(note) {
      return writeFileAsync("db/db.json", JSON.stringify(note));
    }
  
    getNotes() {
      return this.read().then(notes => {
        let parsedNotes;
  
        // If notes isn't an array or can't be turned into one, send back a new empty array
        try {
          parsedNotes = [].concat(JSON.parse(notes));
        } catch (err) {
          parsedNotes = [];
        }
  
        return parsedNotes;
      });
    }
  
    addNotes(note) {
      const { title, text } = note;
  
      if (!title || !text) {
        throw new Error("Note 'title' and 'text' cannot be blank");
      }
  
      // Increment `this.lastId` and assign it to `newNote.id`
      const newNote = { title, text, id: ++this.lastId };
  
      // Get all notes, add the new note, write all the updated notes, return the newNote
      return this.getNotes()
        .then(notes => [...notes, newNote])
        .then(updatedNotes => this.write(updatedNotes))
        .then(() => newNote);
    }
  
    removeNote(id) {
      // Get all notes, remove the note with the given id, write the filtered notes
      return this.getNotes()
        .then(notes => notes.filter(note => note.id !== parseInt(id)))
        .then(filteredNotes => this.write(filteredNotes));

        
    }
  }


module.exports = new Storage();
