namespace API.ViewModels.Auth
{
    public class SignupResponseViewModel
    {
        public bool Success { get; set; }
        public List<string>? Errors { get; set; }
    }
}
