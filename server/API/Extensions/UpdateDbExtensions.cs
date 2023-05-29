using DataAccess.EF;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class UpdateDbExtensions
    {
        public static IApplicationBuilder UseUpdateDb(this IApplicationBuilder app, bool isDrop = false)
        {
            AppDbContext context = app.ApplicationServices.CreateScope()
                .ServiceProvider.GetRequiredService<AppDbContext>();

            if (context.Database.GetPendingMigrations().Any())
            {
                if (isDrop)
                {
                    context.Database.EnsureDeleted();
                }

                context.Database.Migrate();
            }

            return app;
        }
    }
}
