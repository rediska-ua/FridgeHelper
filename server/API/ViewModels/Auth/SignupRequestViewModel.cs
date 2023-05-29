using System.ComponentModel.DataAnnotations;

namespace API.ViewModels.Auth
{
    public class SignupRequestViewModel
    {
        [Required(ErrorMessage = "Name is requireed.")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(8, ErrorMessage = "Password length less than 8 symbols")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirmed password is required.")]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = "Confirmation must match password.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
