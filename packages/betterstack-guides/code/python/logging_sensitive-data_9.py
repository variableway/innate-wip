# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: python
# Normalized: python
# Block index: 9

class MaskFilter(logging.Filter):
    def __init__(self, keys_to_mask):
        super().__init__()
        self.keys_to_mask = keys_to_mask

    def filter(self, record):
        if hasattr(record, "msg"):
            try:
                log_data = record.msg
                for key in self.keys_to_mask:
                    if key in log_data:
                        log_data[key] = mask_value(log_data[key])
                record.msg = log_data
            except json.JSONDecodeError:
                pass
        return True


def mask_value(value):
    return re.sub(r"^([^@]+)", "******", str(value))