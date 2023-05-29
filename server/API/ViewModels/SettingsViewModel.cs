using System.ComponentModel.DataAnnotations;
using API.ViewModels.Base;
using DataAccess.Entities;

namespace API.ViewModels
{
    public class SettingsViewModel : BaseViewModel
    {
        public Guid UserId { get; set; }
        public string? AllergyType { get; set; }
        public string? DishType { get; set; }
        public string? MealType { get; set; }
        public string? CuisineType { get; set; }
        public string? DietType { get; set; }
        public bool UseDefault { get; set; }
    }
}
