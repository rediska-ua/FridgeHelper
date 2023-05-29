using API.ViewModels.Base;
using System.ComponentModel.DataAnnotations;

namespace API.ViewModels
{
    public class RecipeViewModel : BaseUserOrientedViewModel
    {
        public Guid Id { get; set; }
        public string? RecipeId { get; set; }
        public string? RecipeTitle { get; set; }
        public string? RecipeUrl { get; set; }
    }
}
