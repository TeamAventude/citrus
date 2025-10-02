using Session001.DTOs;

namespace Session001.Services.Interfaces
{
    public interface IToolService
    {
        Task<ToolHistoryResponseDto> GetToolHistoryAsync(int toolId, ToolHistoryFilterDto? filter = null);
        Task<byte[]> ExportToolHistoryAsPdfAsync(int toolId);
        Task UpdateToolStatusAsync(int toolId);
    }
}