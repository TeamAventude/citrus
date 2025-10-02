using System.Collections.Generic;
using Session001.DTOs;

namespace Session001.Services.Interfaces
{
    public interface IToolService
    {
        Task<IReadOnlyList<ToolDto>> GetToolsAsync(string? searchTerm = null);
        Task<ToolHistoryResponseDto> GetToolHistoryAsync(int toolId, ToolHistoryFilterDto? filter = null);
        Task<byte[]> ExportToolHistoryAsPdfAsync(int toolId);
        Task UpdateToolStatusAsync(int toolId);
    }
}
