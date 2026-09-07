namespace backend.Utils
{
    public static class ValidationRules
    {
        public const string EmailPattern = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";
        public const string PasswordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S{8,64}$";

        public const int AvatarMaxBytes = 2 * 1024 * 1024;
        public static readonly HashSet<string> AllowedAvatarTypes =
        [
            "image/png",
            "image/jpeg",
            "image/webp",
            "image/gif"
        ];
    }
}
