using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilterAttributes
{
    public class ValidateYearAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            const string param = "year";

            int currYear = context.ActionArguments.GetValue<int>(param);
            if (currYear != default)
            {
                int minYear = DateOnly.MinValue.Year;
                int maxYear = DateOnly.MaxValue.Year;

                if (currYear < minYear || currYear > maxYear)
                    context.Result = new BadRequestObjectResult(
                         $"The {param} parameter must be in the range from {minYear} to {maxYear}.");
                else if (currYear > DateTime.UtcNow.Year)
                    context.Result = new BadRequestObjectResult(
                         $"The {param} parameter cannot represent a year in the future (in UTC).");
            }

            base.OnActionExecuting(context);
        }
    }
}
