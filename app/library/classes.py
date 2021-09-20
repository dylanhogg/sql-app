from dataclasses import dataclass


@dataclass
class ApiResult:
    response_body: str = ""
    query: str = ""
    ip_address: str = ""
    user_agent: str = ""
    handler_time: str = ""
    runtime_time: str = ""


class SafeDict(dict):
    def __missing__(self, key):
        value = self[key] = type(self)()
        return value
