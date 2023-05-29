using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities
{
    public class Product : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid IngredientId { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime CreationDate { get; set; }
        public double Price { get; set; }
        public bool IsAvailable { get; set; }
        public AppUser User { get; set; } = null!;
    }
}
