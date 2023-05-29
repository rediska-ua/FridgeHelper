using System.Text;
using DataAccess.EF;
using DataAccess.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class AuthSetupExtensions
    {
        public static IServiceCollection AddIdentityEF(this IServiceCollection services)
        {
            services.AddIdentity<AppIdentityUser, IdentityRole<Guid>>(options =>
            {
                options.SignIn.RequireConfirmedPhoneNumber = false;
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;
            }).AddEntityFrameworkStores<AppDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders();

            return services;
        }


        public static AuthenticationBuilder AddJwtAuthentication(this IServiceCollection services, ConfigurationManager config)
        {
            return services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = config["JwtSettings:Issuer"],
                    ValidAudience = config["JwtSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                        config["JwtSettings:SecurityKey"])),
                };
            });
        }

        public static AuthenticationBuilder AddGoogleAuthentication(
            this AuthenticationBuilder authenticationBuilder, ConfigurationManager config)
        {
            return authenticationBuilder.AddGoogle(options =>
            {
                options.ClientId = config["GoogleSecrets:ClientId"];
                options.ClientSecret = config["GoogleSecrets:ClientSecret"];
                options.SignInScheme = IdentityConstants.ExternalScheme;

                //options.Scope.Add("email");
            });
        }

        public static IServiceCollection AddCookiesForExternalAuth(this IServiceCollection services)
        {
            return services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.Unspecified;
            });
        }
    }
}
