using Core.Models.Base;

namespace Core.Models
{
    public class ProductModel : BaseUserOrientedModel
    {
        public Guid Id { get; set; }
        public Guid IngredientId { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime CreationDate { get; set; }
        public double Price { get; set; }
        public bool IsAvailable { get; set; }

    }
}
