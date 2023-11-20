class Status:
    SUCCESS = 1
    ERROR = 0
    CONSTANT = 11
    HALT = 20
    PASS = 99

    _status_names = {
        1: "SUCCESS",
        0: "ERROR",
        11: "CONSTANT",
        20: "HALT",
        99: "PASS"
    }

    @staticmethod
    def name(status_code):
        return Status._status_names.get(status_code, "Unknown")
