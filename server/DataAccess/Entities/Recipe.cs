using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Entities
{
    public class Recipe : BaseEntity
    {
        public Guid UserId { get; set; }
        public string? RecipeId { get; set; }
        public string? RecipeTitle { get; set; }
        public string? RecipeURL { get; set; }
        public AppUser? User { get; set; }
    }
}
