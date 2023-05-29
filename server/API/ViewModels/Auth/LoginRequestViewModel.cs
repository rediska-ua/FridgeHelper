using System.ComponentModel.DataAnnotations;

namespace API.ViewModels.Auth
{
    public class LoginRequestViewModel
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(8, ErrorMessage = "Password length is less than 8 symbols")]
        public string? Password { get; set; }
    }
}
