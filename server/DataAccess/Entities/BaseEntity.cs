using DataAccess.Entities.Interfaces;

namespace DataAccess.Entities
{
    public class BaseEntity : IBaseEntity
    {
        public Guid Id { get; set; }
    }
}
