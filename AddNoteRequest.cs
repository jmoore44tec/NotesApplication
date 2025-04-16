namespace NotesApp.API.Models.DataTransferObjects
{
    public class AddNoteRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ColorHex { get; set; }
    }
}
