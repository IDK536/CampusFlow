namespace CampusFlow.Api.Models;

public sealed class Room
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Building { get; set; }
    public int Floor { get; set; }
    public int Capacity { get; set; }
    public string[] Equipment { get; set; } = [];
}
