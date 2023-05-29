using API.ViewModels.Base;
using Core.Models;
using System.ComponentModel.DataAnnotations;

namespace API.ViewModels
{
    public class ProductViewModel : BaseUserOrientedViewModel
    {
        public Guid Id { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime CreationDate { get; set; }
        public double Price { get; set; }
        public Guid IngredientId { get; set; }
        public bool IsAvailable { get; set; }
    }
}
