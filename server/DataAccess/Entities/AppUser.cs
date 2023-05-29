using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Entities
{
    [Index(nameof(Email), IsUnique = true)]
    public class AppUser : BaseEntity
    {
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [EmailAddress]
        [MaxLength(50)]
        [Unicode(false)]
        public string Email { get; set; } = string.Empty;
        public Guid AppIdentityUserId { get; set; }
        public AppIdentityUser? AppIdentityUser { get; set; }
        public Settings? Settings { get; set; }
        public ICollection<Product> ProductAvailables { get; set; } = new List<Product>();
        public ICollection<Recipe> SavedRecipes { get; set; } = new List<Recipe>();
    }
}
