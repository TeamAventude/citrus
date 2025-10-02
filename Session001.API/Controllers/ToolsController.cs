using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Session001.DTOs;
using Session001.Services.Interfaces;

namespace Session001.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ToolsController : ControllerBase
    {
        private readonly IToolService _toolService;
        private readonly ILogger<ToolsController> _logger;

        public ToolsController(IToolService toolService, ILogger<ToolsController> logger)
        {
            _toolService = toolService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToolDto>>> GetTools([FromQuery] string? search = null)
        {
            try
            {
                var tools = await _toolService.GetToolsAsync(search);
                return Ok(tools);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tools list with search term {Search}", search);
                return StatusCode(500, "An error occurred while retrieving the tools.");
            }
        }

        [HttpGet("{id}/history")]
        public async Task<ActionResult<ToolHistoryResponseDto>> GetToolHistory(
            int id,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] string? eventType)
        {
            try
            {
                var filter = new ToolHistoryFilterDto
                {
                    StartDate = startDate,
                    EndDate = endDate,
                    EventType = eventType
                };

                var result = await _toolService.GetToolHistoryAsync(id, filter);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tool history for tool {ToolId}", id);
                return StatusCode(500, "An error occurred while retrieving the tool history.");
            }
        }

        [HttpGet("{id}/export-pdf")]
        public async Task<IActionResult> ExportToolHistoryAsPdf(int id)
        {
            try
            {
                var pdfBytes = await _toolService.ExportToolHistoryAsPdfAsync(id);
                return File(pdfBytes, "application/pdf", $"tool-history-{id}.pdf");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting tool history as PDF for tool {ToolId}", id);
                return StatusCode(500, "An error occurred while generating the PDF.");
            }
        }

        [HttpPost("{id}/update-status")]
        public async Task<IActionResult> UpdateToolStatus(int id)
        {
            try
            {
                await _toolService.UpdateToolStatusAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating tool status for tool {ToolId}", id);
                return StatusCode(500, "An error occurred while updating the tool status.");
            }
        }
    }
}
