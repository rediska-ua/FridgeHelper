using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.Configs
{
    internal class UserConfig : IEntityTypeConfiguration<AppUser>
    {
        public void Configure(EntityTypeBuilder<AppUser> builder)
        {
            builder.HasIndex(e => e.AppIdentityUserId, "IX_Users_AspNetUserId")
                .IsUnique();

            builder.HasOne(d => d.AppIdentityUser)
                .WithOne(p => p.AppUser)
                .HasForeignKey<AppUser>(e => e.AppIdentityUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
