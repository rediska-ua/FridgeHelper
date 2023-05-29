namespace API.Extensions
{
    public static class DictionaryExtensions
    {
        public static T GetValue<T>(
            this IDictionary<string, object?> dictionary,
            string key)
            where T : struct
        {

            T value = default;
            if (dictionary.TryGetValue(key, out var obj))
            {
                if (obj != null)
                {
                    value = (T)obj;
                }
            }

            return value;
        }
    }
}
