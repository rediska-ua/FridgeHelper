using Core.Enums;
using Core.Models.Base;

namespace Core.Models
{
    public class IngredientModel : BaseModel
    {
        public string? Value { get; set; }
        public Guid CategoryId { get; set; }
    }
}
