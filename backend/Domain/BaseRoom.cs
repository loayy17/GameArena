using backend.Enums;

namespace backend.Domain
{
    public abstract class BaseGameRoom(GamesKind _gameType)
    {
        // data vars
        public string RoomId { get; set; } = Guid.NewGuid().ToString();
        public GamesKind GameType { get; } = _gameType;
        public string? Player1Id { get; set; }
        public string? Player2Id { get; set; }
        public string? Player1Username { get; set; }
        public string? Player2Username { get; set; }
        public bool IsFull { get; set; } = false;
        public bool IsFinished { get; set; } = false;

        // methods
        public abstract void UpdatePhysics(float deltaTime); // for ping pong & snake 
        public abstract object GetStatePayload(); // for sending to clients
        public abstract void ProcessInput(string playerId, string inputType, object payload); // for processing input from clients
    }

}
