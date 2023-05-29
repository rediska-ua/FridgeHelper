using DataAccess.EF;
using DataAccess.Entities;
using DataAccess.Repositories.Interfaces;

namespace DataAccess.Repositories.Realizations
{
    public class UserSettingsRepository : BaseRepository<Settings>, ISettingsRepository
    {
        public UserSettingsRepository(AppDbContext context) : base(context)
        {
        }
    }
}
