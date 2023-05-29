using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.ViewModels.Auth;
using Core.Exceptions;
using Core.Interfaces.IServices;
using Core.Models;
using DataAccess.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;
using Services.Realizations;

namespace API.Services
{

    public class AuthService
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<AuthService> logger;
        private readonly UserManager<AppIdentityUser> userManager;
        private readonly SignInManager<AppIdentityUser> signInManager;
        private readonly IUserSettingsService settingsService;

        public AuthService(
            IConfiguration configuration,
            ILogger<AuthService> logger,
            UserManager<AppIdentityUser> userManager,
            SignInManager<AppIdentityUser> signInManager,
            IUserSettingsService settingsService)
        {
            this.configuration = configuration;
            this.logger = logger;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.settingsService = settingsService;
        }

        public async Task<SignupResponseViewModel> RegistrationAsync(SignupRequestViewModel signupRequest)
        {
            if (signupRequest is null)
            {
                logger.LogCritical("Model has not passed a validation");
                throw new ArgumentNullException($"{nameof(signupRequest)}", " argument is null");
            }

            var appIdentityUser = new AppIdentityUser()
            {
                Email = signupRequest.Email,
                UserName = signupRequest.Email,
                AppUser = new AppUser()
                {
                    Name = signupRequest.UserName,
                    Email = signupRequest.Email,
                },
            };

            var identityResult = await userManager.CreateAsync(appIdentityUser, signupRequest.Password);

            if (!identityResult.Succeeded)
            {
                var errors = identityResult.Errors.Select(e => e.Description).ToList();
                logger.LogWarning("Failed registration attempt.", errors);
                return new SignupResponseViewModel
                {
                    Errors = errors,
                };
            }

            var settings = await settingsService.CreateSettingsAsync(new UserSettingsModel
            {
                UserId = appIdentityUser.AppUser.Id,
                AllergyType = "",
                DishType = "",
                MealType = "",
                CuisineType = "",
                DietType = "",
                UseDefault = false
            }) ; 

            return new SignupResponseViewModel { Success = true };
        }

        public async Task<LoginResponseViewModel> LoginAsync(LoginRequestViewModel loginRequest)
        {
            if (loginRequest is null)
            {
                logger.LogCritical("Model has not passed a validation");
                throw new ArgumentNullException($"{nameof(loginRequest)}", " argument is null");
            }

            var user = await userManager.FindByEmailAsync(loginRequest.Email);
            if (user is null)
            {
                logger.LogWarning("Authorization attempt with invalid name.");
                return new LoginResponseViewModel
                {
                    Message = "Invalid Email.",
                };
            }


            if (!await userManager.CheckPasswordAsync(user, loginRequest.Password))
            {
                logger.LogWarning("Authorization attempt with invalid password.");
                return new LoginResponseViewModel
                {
                    Message = "Invalid Password.",
                };
            }

            if (user.AppUser is null)
            {
                logger.LogCritical("Identity user doesn't contain AppUser property");
                throw new BrokenModelDataException("Identity user doesn't contain AppUser property");
            }

            var token = GetToken(user);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return new LoginResponseViewModel
            {
                Success = true,
                Token = jwt,
            };
        }

        public AuthenticationProperties GetExternalAuthProperties(
            string provider, string actionUrl, string queryString)
        {
            if (provider is null)
            {
                logger.LogCritical("Model has not passed a validation");
                throw new ArgumentNullException(nameof(provider));
            }

            if (actionUrl is null)
            {
                logger.LogWarning($"{nameof(actionUrl)} argument is null.");
                throw new ArgumentNullException(nameof(actionUrl));
            }

            if (queryString is null)
            {
                logger.LogWarning($"{nameof(queryString)} argument is null.");
                throw new ArgumentNullException(nameof(queryString));
            }

            var properties = signInManager
                .ConfigureExternalAuthenticationProperties(
                    provider, $"{actionUrl}?{queryString}");

            properties.AllowRefresh = true;
            return properties;
        }

        public async Task<LoginResponseViewModel> LoginViaExternalService()
        {
            var info = await signInManager.GetExternalLoginInfoAsync();
            if (info is null)
            {
                logger.LogWarning("External login information is null.");
                return FailedLoginResponse("External login information is null.");
            }

            var signinResult = await signInManager.ExternalLoginSignInAsync(
                info.LoginProvider, info.ProviderKey, false);

            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var user = await userManager.FindByEmailAsync(email);

            if (signinResult.Succeeded)
            {
                if (user.AppUser is null)
                {
                    logger.LogCritical("Identity user doesn't contain AppUser property.");
                    throw new BrokenModelDataException("Identity user doesn't contain AppUser property.");
                }

                return SuccessfulLoginResponse(user);
            }

            if (email is null)
            {
                logger.LogWarning("Email retrieved by external login service is null.");
                return FailedLoginResponse("Email retrieved by external login service is null.");
            }

            if (user is null)
            {
                var name = info.Principal.FindFirstValue(ClaimTypes.Name);
                user = await CreateUser(email, name);

                await settingsService.CreateSettingsAsync(new UserSettingsModel
                {
                    UserId = user.AppUser.Id,
                    AllergyType = "",
                    DishType = "",
                    MealType = "",
                    CuisineType = "",
                    DietType = "",
                    UseDefault = false
                });
            }

            await userManager.AddLoginAsync(user, info);
            await signInManager.SignInAsync(user, false);

            return SuccessfulLoginResponse(user);
        }


        private static List<Claim> GetClaims(AppIdentityUser user)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.AppUser!.Name),
                new Claim("userId", user.AppUser!.Id.ToString()),
            };
            return claims;
        }
        private static LoginResponseViewModel FailedLoginResponse(string message)
        {
            return new LoginResponseViewModel
            {
                Message = message,
            };
        }

        private JwtSecurityToken GetToken(AppIdentityUser user)
        {
            JwtSecurityToken token = new (
                issuer: configuration["JwtSettings:Issuer"],
                audience: configuration["JwtSettings:Audience"],
                claims: GetClaims(user),
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(
                    configuration["JwtSettings:ExpirationTimeMinutes"])),
                signingCredentials: GetSigningCredentials());

            logger.LogInformation("Generate token for user {userEmail}", user.Email);

            return token;
        }

        private SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.UTF8.GetBytes(this.configuration["JwtSettings:SecurityKey"]);
            var secret = new SymmetricSecurityKey(key);
            return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
        }

        private LoginResponseViewModel SuccessfulLoginResponse(AppIdentityUser user)
        {
            var token = GetToken(user);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return new LoginResponseViewModel
            {
                Success = true,
                Token = jwt,
            };
        }

        private async Task<AppIdentityUser> CreateUser(string email, string name)
        {
            var user = new AppIdentityUser()
            {
                UserName = email,
                Email = email,
                AppUser = new AppUser()
                {
                    Name = name,
                    Email = email,
                },
            };

            await userManager.CreateAsync(user);
            return user;
        }


        private static string EncodeToken(string token) => 
            WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        private static string DecodeToken(string token) =>
            Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));

    }
}
