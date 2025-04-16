using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NotesApp.API.Data;
using NotesApp.API.Models.DataTransferObjects;
using NotesApp.API.Models.DomainModels;
using System.Reflection;

namespace NotesApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly NotesDbContext dbContext;
        public NotesController(NotesDbContext dbContext)
        {
            this.dbContext = dbContext;
        }


        [HttpPost]
        public IActionResult AddNote(AddNoteRequest addNoteRequest)
        {
            // Convert the DTO to Domain Model
            var note = new Models.DomainModels.Note
            {
                Title = addNoteRequest.Title,
                Description = addNoteRequest.Description,
                ColorHex = addNoteRequest.ColorHex,
                DateCreated = DateTime.Now
            };

            dbContext.Notes.Add(note);
            dbContext.SaveChanges();

            return Ok(note);
        }

        [HttpGet]
        public IActionResult GetAllNotes()
        {
           var notes = dbContext.Notes.ToList();

            var notesDataTransferObjects = new List<Models.DataTransferObjects.Notes>();
            foreach (var note in notes)
            {
                notesDataTransferObjects.Add(new Models.DataTransferObjects.Notes
                {
                    Id = note.Id,
                    Title = note.Title,
                    Description = note.Description,
                    ColorHex = note.ColorHex,
                    DateCreated = note.DateCreated
                });
            }

            return Ok(notesDataTransferObjects);

            
        }
        [HttpGet]
        [Route("{id:Guid}")]
        public IActionResult GetNoteById(Guid id)
        {
            var noteDomainObject = dbContext.Notes.Find(id);

            if (noteDomainObject != null)
            {
                var noteDataTransferObjects = new Models.DataTransferObjects.Notes
                {
                    Id = noteDomainObject.Id,
                    Title = noteDomainObject.Title,
                    Description = noteDomainObject.Description,
                    ColorHex = noteDomainObject.ColorHex,
                    DateCreated = noteDomainObject.DateCreated
                };
                return Ok(noteDataTransferObjects);
            } else
            {
                return BadRequest();    
            }

        }

        [HttpPut]
        [Route("{id:Guid}")]
        public IActionResult UpdateNote(Guid id, UpdateNoteRequest updateNoteRequest )
        {
            var existingNote = dbContext.Notes.Find(id);

            if (existingNote != null)
            {
                existingNote.Title = updateNoteRequest.Title;   
                existingNote.Description = updateNoteRequest.Description;
                existingNote.ColorHex = updateNoteRequest.ColorHex;

                dbContext.SaveChanges();

                return Ok(existingNote);
            } else
            {
                return BadRequest();
            }
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public IActionResult DeleteNote(Guid id)
        {
            var existingNote = dbContext.Notes.Find(id);

            if (existingNote != null)
            {
                dbContext.Notes.Remove(existingNote);
                dbContext.SaveChanges();

                return Ok();
            } else
            {
                return BadRequest();
            }
        }

    }
}
