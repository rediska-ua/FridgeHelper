using Core.Models.Base;

namespace Core.Models
{
    public class RecipeModel : BaseUserOrientedModel
    {
        public Guid Id { get; set; }
        public string? RecipeId { get; set; }
        public string? RecipeTitle { get; set; }
        public string? RecipeURL { get; set; }
    }
}
