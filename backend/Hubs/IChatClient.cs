namespace backend.Hubs
{
    public interface IChatClient
    {
        string type { get; set; }
        string userId { get; set; }
        string userName { get; set; }
        string message { get; set; }
        DateTime sentAt { get; set; }
    }
}