using DataAccess.Entities.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace DataAccess.Entities
{
    public class AppIdentityUser : IdentityUser<Guid>, IBaseEntity
    {
        public AppUser? AppUser { get; set; }
    }
}
