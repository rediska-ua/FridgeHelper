namespace Core.Interfaces.IServices
{
    public interface ISecurityContextService
    {
        Guid GetCurrentUserId();
    }
}
