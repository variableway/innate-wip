# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: python
# Normalized: python
# Block index: 6

class RedactFilter(logging.Filter):
    def __init__(self, keys_to_redact):
        super().__init__()
        self.keys_to_redact = keys_to_redact

    def filter(self, record):
        if hasattr(record, "msg"):
            try:
                log_data = record.msg
                for key in self.keys_to_redact:
                    if key in log_data:
                        log_data[key] = "REDACTED"
                record.msg = log_data
            except json.JSONDecodeError:
                pass
        return True