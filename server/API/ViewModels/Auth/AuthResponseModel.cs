namespace API.ViewModels.Auth
{
    public class AuthResponseModel
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool InvalidRequest { get; set; }
    }
}
