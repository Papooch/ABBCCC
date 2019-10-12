import jsons
import random
from datetime import datetime as dt

class Data:
    def __init__(self, elements):
        self.elements = elements

class Stripped_Robot:
    def __init__(self, robot_id = 0, uptime = 0, downtime = 0, name = ""):
        self.robot_id = robot_id
        self.uptime = uptime
        self.downtime = downtime
        self.name = name

class Robot:
    def __init__(self, robot_id = 0, uptime = 0, downtime = 0, name = ""):
        self.robot_id = robot_id
        self.uptime = uptime
        self.downtime = downtime
        self.name = name
        self.events = []        
        self.stop_start_time = []
        self.stop_start_id = []
class Event:
      def __init__(self, event_id = 0, time = 0, number = 0, reason = "Mama mele maso", domain = "domain info", header = "Nejakej header", cause = "Protoze jo", action = "sprav to", severity = "info", user_severity = 1, last_occurence = 0, occurences = random.randint(1, 10000)):
        self.event_id = event_id
        self.time = time
        self.number = number
        self.reason = reason
        self.domain = domain
        self.header = header
        self.cause = cause
        self.action = action
        self.severity = severity
        self.user_severity = user_severity
        self.last_occurence = last_occurence
        self.occurences = occurences

class Stripped_Event:
      def __init__(self, event_id = 0, time = 0, number = 0, reason = "Mama mele maso", domain = "domain info", header = "Nejakej header", cause = "Protoze jo", action = "sprav to", severity = "info", user_severity = 1, last_occurence = 0, occurences = random.randint(1, 10000)):
        self.event_id = event_id
        self.time = time
        self.number = number
        self.reason = reason
        self.domain = domain
        self.header = header
        self.errors = 0
        self.warnings = 0
        self.infos = 0
        self.severity = severity
        self.user_severity = user_severity
        

class Database_event:
    def __init__(self, time_stamp = 0, number = 0, reason = ""):

        self.time_stamp = time_stamp
        self.number = number 
        self.reason = reason 
        self.domain = ""
        self.header = ""
        self.cause = ""
        self.action = ""
        self.severity = ""


def correct_time(time_stamp):
        date_obj = dt.strptime(time_stamp, '%m/%d/%Y %I:%M:%S %p')
        correct_time = dt.strftime(date_obj, '%Y-%m-%d %H:%M:%S')
        return correct_time

def test_json():
    robots = []
    for i in range(7):
        temp_robot = Robot(robot_id = i + 1, name = "Robot" + str(i), downtime = random.randint(550, 1000000), uptime = random.randint(550, 10000000))
        for j in range(12):
            timestamp = 1545730073 + 10000*i + 1000*j
            date_obj = dt.fromtimestamp(timestamp)
            correct_time = dt.strftime(date_obj, '%Y-%m-%d %H:%M:%S')

            _severity = "Info"
            _user_severity = random.randint(0, 3)
            rand = random.randint(1, 100)
            if rand > 60:
                _severity = "Warning"
                _user_severity = random.randint(2,5)
            if rand > 90:
                _severity = "Error"
                _user_severity = random.randint(4,20)

            temp_robot.events.append(Event(event_id=j, time = correct_time, number = random.randint(1, 1000), user_severity = _user_severity, severity=_severity))
                        
        robots.append(temp_robot)
    data = Data(robots)
    x = jsons.dumps(data)
    print(x)
