using API.Controllers.Base;
using API.ViewModels;
using AutoMapper;
using Core.Interfaces.IServices;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserSettingsController : BaseController
    {
        private readonly IMapper mapper;
        private readonly IUserSettingsService settingsService;

        public UserSettingsController(IMapper mapper, IUserSettingsService settingsService)
        {
            this.mapper = mapper;
            this.settingsService = settingsService;
        }


        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(200, "Returns an object containing user settings.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(404, "No settings found for the current user.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<SettingsViewModel>> GetUserSettings()
        {
            var settingsModel = await settingsService
                .GetUserSettingsAsync(UserId);

            if (settingsModel is null)
            {
                return NotFound("No settings found for the current user.");
            }

            var settingsViewModel = mapper.Map<SettingsViewModel>(settingsModel);
            return Ok(settingsViewModel);
        }


        /*[HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(201, "Returns created object containing user settings.")]
        [SwaggerResponse(400, "The model state is invalid.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(403, "User cannot create settings for another person.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<SettingsViewModel>> CreateSettings([FromBody] SettingsViewModel settingsViewModel)
        {
            if (UserId != settingsViewModel.UserId)
            {
                return Forbid();
            }

            var settingsModel = mapper.Map<UserSettingsModel>(settingsViewModel);
            settingsModel = await settingsService.CreateSettingsAsync(settingsModel);

            var createdViewModel = mapper.Map<SettingsViewModel>(settingsModel);
            return CreatedAtAction(nameof(this.GetUserSettings), createdViewModel);
        }*/


        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status202Accepted)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [SwaggerResponse(202, "Returns updated object containing user settings.")]
        [SwaggerResponse(400, "The model state is invalid or there is a mismatch.")]
        [SwaggerResponse(401, "An unauthorized request cannot be processed.")]
        [SwaggerResponse(403, "User cannot update settings of another person.")]
        [SwaggerResponse(404, "No settings found by the provided id.")]
        [SwaggerResponse(500, "An unhandled exception occurred on the server while executing the request.")]
        public async Task<ActionResult<SettingsViewModel>> UpdateSettings(
            Guid id,
            [FromBody] SettingsViewModel settingsViewModel)
        {
            if (UserId != settingsViewModel.UserId)
            {
                return Forbid();
            }

            if (id != settingsViewModel.Id)
            {
                return BadRequest("SettingsId mismatch.");
            }

            var settingsModel = mapper.Map<UserSettingsModel>(settingsViewModel);
            settingsModel = await settingsService.UpdateSettingsAsync(settingsModel);
            if (settingsModel is null)
            {
                return NotFound("No settings found by the provided id.");
            }

            var updatedViewModel = mapper.Map<SettingsViewModel>(settingsModel);
            return AcceptedAtAction(nameof(this.GetUserSettings), updatedViewModel);
        }
    }
}
