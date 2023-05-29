using System.Net;
using API.ViewModels;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate next;
        private readonly IWebHostEnvironment environment;
        private readonly ILogger<ExceptionMiddleware> logger;

        public ExceptionMiddleware(RequestDelegate next, IWebHostEnvironment environment, ILogger<ExceptionMiddleware> logger)
        {
            this.next = next;
            this.environment = environment;
            this.logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception e)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var message = environment.IsDevelopment() ? e.Message : "Internal error";
                var stackTrace = e?.StackTrace ?? string.Empty;

                logger.LogError(e, "Process failed with {stackTrace}", stackTrace);

                var error = new ErrorViewModel
                {
                    StatusCode = context.Response.StatusCode.ToString(),
                    Message = message,
                };

                context.Response.ContentType = "application/json";

                await context.Response.WriteAsync(error.ToString());
            }
        }
    }
}
