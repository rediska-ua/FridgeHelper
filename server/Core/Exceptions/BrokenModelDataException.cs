﻿namespace Core.Exceptions
{

    [Serializable]
    public class BrokenModelDataException : AppException
    {
        public BrokenModelDataException() { }
        public BrokenModelDataException(string message) : base(message) { }
        public BrokenModelDataException(string message, Exception inner) : base(message, inner) { }
        protected BrokenModelDataException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }
    }
}
