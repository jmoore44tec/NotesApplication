namespace NotesApp.API.Models.DataTransferObjects
{
    public class Notes
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ColorHex { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
