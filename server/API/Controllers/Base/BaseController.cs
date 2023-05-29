using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Base
{
    public class BaseController : ControllerBase
    {
        protected Guid UserId
        {
            get
            {
                var id = User.FindFirst("userId");
                if (id is null)
                {
                    return Guid.Empty;
                }

                return new Guid(id.Value);
            }
        }
        protected string UserName
        {
            get => User.FindFirst(ClaimTypes.Name)?.Value
                ?? "User Unknown";
        }
    }
}
