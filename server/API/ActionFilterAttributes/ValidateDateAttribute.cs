using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;

namespace API.ActionFilterAttributes
{
    public class ValidateDateAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            const string param = "day";

            var currDay = context.ActionArguments.GetValue<DateTime>(param);
            if (currDay != default && currDay > DateTime.UtcNow.AddHours(3))
                context.Result = new BadRequestObjectResult(
                    $"The {param} parameter cannot represent a date in the future (in UTC).");

            base.OnActionExecuting(context);
        }
    }
}
