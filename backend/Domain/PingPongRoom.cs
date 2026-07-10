using backend.Enums;
using backend.Utils;
using System.Reflection.Metadata;
using System.Text.Json;

namespace backend.Domain
{
    public class PingPongRoom : BaseGameRoom
    {
        public PingPongRoom() : base(GamesKind.PingPong) { }
        // ball 
        public float BallPX { get; set; } = 0.5f; 
        public float BallPY { get; set; } = 0.5f;
        public float BallVX { get; set; } = 0.01f;
        public float BallVY { get; set; } = 0.01f;
        // paddles
        public float PadYP1 { get; set; } = 0.5f;
        public float PadHP1 { get; set; } = 0.2f;
        public float PadVP1 { get; set; } = 0.02f;
        public float PadYP2 { get; set; } = 0.5f;
        public float PadHP2 { get; set; } = 0.2f;
        public float PadVP2 { get; set; } = 0.02f;
        // score
        public int ScoreP1 { get; set; } = 0;
        public int ScoreP2 { get; set; } = 0;

        public override object GetStatePayload() => new 
        {
            BallPX ,
            BallPY,
            BallVX,
            BallVY,
            PadYP1,
            PadHP1,
            PadVP1,
            PadYP2,
            PadHP2,
            PadVP2,
            ScoreP1,
            ScoreP2
        };

        public override void ProcessInput(string playerId, object action)
        {
            if(Player1Id != playerId || playerId != Player2Id) return;

            if (action is not JsonElement json
                || json.ValueKind != JsonValueKind.Object
                || !json.TryGetProperty("type", out var typeProp)
                || typeProp.GetString() != "MOVE_PADDLE"
                || !json.TryGetProperty("direction", out var directionProp))
                return;

            var direction = directionProp.GetString();
            if (playerId == Player1Id)
            {
                if (direction == "UP")
                    PadYP1 = Math.Max(0, PadYP1 - PadVP1);
                else if (direction == "DOWN")
                    PadYP1 = Math.Min(1 - PadHP1, PadYP1 + PadVP1);
            }
            else
            {
                if (direction == "UP")
                    PadYP2 = Math.Max(0, PadYP2 - PadVP2);
                else if (direction == "DOWN")
                    PadYP2 = Math.Min(1 - PadHP2, PadYP2 + PadVP2);
            }

        }

    }
}
