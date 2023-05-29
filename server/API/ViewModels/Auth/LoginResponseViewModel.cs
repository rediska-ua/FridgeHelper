namespace API.ViewModels.Auth
{
    public class LoginResponseViewModel
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? Token { get; set; }
    }
}
