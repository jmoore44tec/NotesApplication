document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const saveButton = document.querySelector('#btnSave');
    const deleteButton = document.querySelector('#btnDelete');
    const titleInput = document.querySelector('#title');
    const descriptionInput = document.querySelector('#description');
    const notesContainer = document.querySelector('#notesContainer');

    let currentNoteId = null; // Track which note is being edited

    // ========== HELPER FUNCTIONS ========== //
    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // ========== CRUD OPERATIONS ========== //
    function saveNote(title, description) {
        const body = {
            title: title,
            description: description,  
            isVisible: true,
            ColorHex: "#FFFFFF"
        };

        const method = currentNoteId ? 'PUT' : 'POST';
        const url = currentNoteId 
            ? `https://localhost:7259/api/notes/${currentNoteId}`
            : 'https://localhost:7259/api/notes';

        fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to save');
            return response.json();
        })
        .then(() => {
            showNotification(`Note ${currentNoteId ? 'updated' : 'saved'} successfully!`);
            getAllNotes();
            clearForm();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification(`Failed to ${currentNoteId ? 'update' : 'save'} note.`, false);
        });
    }

    // Delete a note
    function deleteNote(id) {
        fetch(`https://localhost:7259/api/notes/${id}`, {
            method: 'DELETE',
            headers: {
                "content-type": "application/json"
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete');
            showNotification('Note deleted successfully!');
            getAllNotes();
            clearForm();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to delete note.', false);
        });
    }

    // Fetch all notes
    function getAllNotes() {
        fetch('https://localhost:7259/api/notes')
        .then(data => data.json())
        .then(response => displayNotes(response))
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to load notes.', false);
        });
    }

    // Fetch a single note by ID
    function getNoteById(id) {
        fetch(`https://localhost:7259/api/notes/${id}`)
        .then(data => data.json())
        .then(response => displayNoteInForm(response))
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to load note.', false);
        });
    }

    // ========== UI UPDATES ========== //
    function displayNoteInForm(note) {
        currentNoteId = note.id; // Set the current note ID
        titleInput.value = note.title;
        descriptionInput.value = note.description;
        deleteButton.classList.remove('hidden');
        deleteButton.setAttribute('data-id', note.id);
    }

    function displayNotes(notes) {
        let allNotes = '';
        notes.forEach(note => {
            const noteElement = `       
                <div class="note" data-id="${note.id}">
                    <h3>${note.title}</h3>
                    <p>${note.description}</p>
                </div>`;
            allNotes += noteElement;
        });
        notesContainer.innerHTML = allNotes;

        document.querySelectorAll('.note').forEach(note => {
            note.addEventListener('click', function() {
                populateForm(note.dataset.id);
            });
        });
    }

    // ========== FORM HELPERS ========== //
    function clearForm() {
        currentNoteId = null;
        titleInput.value = '';
        descriptionInput.value = '';
        deleteButton.classList.add('hidden');
    }

    function populateForm(id) {
        getNoteById(id);
    }

    // ========== EVENT LISTENERS ========== //
    saveButton.addEventListener('click', function() {
        if (!titleInput.value.trim()) {
            showNotification('Please enter a title!', false);
            return;
        }
        saveNote(titleInput.value, descriptionInput.value);
    });

    deleteButton.addEventListener('click', function() {
        const id = deleteButton.dataset.id;
        if (!id) {
            showNotification('No note selected!', false);
            return;
        }
        if (confirm('Are you sure you want to delete this note?')) {
            deleteNote(id);
        }
    });

    // ========== INITIAL LOAD ========== //
    getAllNotes();
});