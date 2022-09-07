using System.ComponentModel.DataAnnotations;

namespace CTFServer.Models.Data;

/// <summary>
/// 用于存放配置项
/// </summary>
public sealed record Config
{
    public Config() { }
    public Config(string key, string value)
    {
        ConfigKey = key;
        Value = value;
    }

    public bool Equals(Config? other)
        => ConfigKey == other?.ConfigKey;

    public override int GetHashCode()
        => unchecked(ConfigKey.GetHashCode() + Value.GetHashCode());

    [Key]
    public string ConfigKey { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}