namespace backend.Utils
{
    public static class ValidationRules
    {
        public const string EmailPattern = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";
        public const string PasswordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S{8,64}$";
    }
}
