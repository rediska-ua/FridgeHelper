using API.Services;
using API.ViewModels.Auth;
using Azure;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private const string ReturnUrlQueryParam = "returnUrl";
        private const string ExternalLoginResponseKey = "ExternalLoginResponse";
        private const string JwtSettingsAudienceKey = "JwtSettings:Audience";

        private readonly AuthService authService;
        private readonly IConfiguration configuration;

        public AccountController(AuthService authService, IConfiguration configuration)
        {
            this.authService = authService;
            this.configuration = configuration;
        }

        [HttpPost("registration")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Registration was succesfull")]
        [SwaggerResponse(400, "Invalid data")]
        [SwaggerResponse(500, "Something went wrong")]
        public async Task<ActionResult<SignupResponseViewModel>> RegisterUser(
            [FromBody] SignupRequestViewModel newUser)
        {
            if (newUser == null || !ModelState.IsValid) return BadRequest(ModelState);

            var response = await authService.RegistrationAsync(newUser);
            if (response.Success) return Ok(response);

            return BadRequest(response);
        }

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Registration was succesfull")]
        [SwaggerResponse(400, "Invalid data")]
        [SwaggerResponse(401, "Invalid credentials")]
        [SwaggerResponse(500, "Something went wrong")]
        public async Task<ActionResult<LoginResponseViewModel>> Login(
            [FromBody] LoginRequestViewModel loginRequest)
        {
            if (loginRequest is null || !ModelState.IsValid) return BadRequest(ModelState);

            var response = await authService.LoginAsync(loginRequest);

            if (response.Success)   return Ok(response);

            return Unauthorized(response);
        }


        [HttpGet("external-login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "External login service was successfully called.")]
        [SwaggerResponse(400, "Invalid data")]
        [SwaggerResponse(500, "Something went wrong")]
        public IActionResult ExternalLogin(string provider, string returnUrl)
        {
            var actionUrl = Url.Action(nameof(this.ExternalLoginCallback));
            var queryString = ExternalLoginQueryString(returnUrl);

            var props = this.authService.GetExternalAuthProperties(provider, actionUrl!, queryString);

            return Challenge(props, provider);
        }

        [HttpGet("external-login-callback")]
        [ProducesResponseType(StatusCodes.Status302Found)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(302, "Authentication was successful.")]
        [SwaggerResponse(400, "Invalid data")]
        [SwaggerResponse(500, "Something went wrong")]
        public async Task<IActionResult> ExternalLoginCallback(string returnUrl)
        {
            var result = await this.authService.LoginViaExternalService();
            var cookieOptions = new CookieOptions()
            {
                Expires = DateTime.UtcNow.AddMinutes(5),
            };

            Response.Cookies.Append(ExternalLoginResponseKey,
                JsonConvert.SerializeObject(result, new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new CamelCaseNamingStrategy(),
                    },
                    Formatting = Formatting.Indented,
                }), cookieOptions);

            return Redirect($"{configuration[JwtSettingsAudienceKey]}?" + ExternalLoginQueryString(returnUrl));
        }

        private static string ExternalLoginQueryString(string returnUrl)
         => $"{ReturnUrlQueryParam}={returnUrl}";
    }
}