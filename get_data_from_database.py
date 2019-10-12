#!C:\Users\ondra\AppData\Local\Programs\Python\Python37\python.exe
print("Content-Type: text/html\n")
import cgi
from datetime import datetime as dt
from to_database_and_beyond import *
from base_functions import *
import random
import jsons

arguments = cgi.FieldStorage()
for i in arguments.keys():
    arguments[i].value

try:
    what_to_send = arguments["type"].value
except:
    what_to_send = "robots"
try:
    robot_name = arguments["robot"].value
except:
    robot_name = ""
try:
    event_id = arguments["event"].value
except:
    event_id = ""
try:
    start_time = arguments["start"].value
except:
    start_time = dt.strftime(dt.fromtimestamp(0), '%Y-%m-%d %H:%M:%S')
    # print(start_time)
try:
    end_time = arguments["end"].value
    # print(end_time)
except:
    end_time = dt.strftime(dt.now(), '%Y-%m-%d %H:%M:%S')

con = connect_to_database()


# # debug
# what_to_send = "robots"
# robot_name = "120_100962"
# event_id = 40000
# start_time = "2019-10-08  10:16:11"
# end_time = dt.strftime(dt.now(), '%Y-%m-%d %H:%M:%S')

def compute_times(events):
    if len(events) <= 0:
        return [0, [[0, 0]], [0, 0]]

    stop_state = -1
    stop_time = 0
    prev_stop_event = events[-1]
    stop_start_time = []
    stop_start_id = []
    for i in range(len(events)-1, -1, -1):
        if stop_state == -1:
            if events[i][2] in stop_events:
                prev_stop_event = events[i]
                stop_state = 1
            elif events[i][2] in start_events: 
                stop_time += events[i][1].timestamp() - prev_stop_event[1].timestamp()
                stop_start_time.append([dt.strftime(prev_stop_event[1], '%Y-%m-%d %H:%M:%S'), dt.strftime(events[i][1], '%Y-%m-%d %H:%M:%S')])
                stop_start_id.append([prev_stop_event[0], events[i][0]])
                stop_state = 0
        elif stop_state == 1:
            if events[i][2] in start_events: 
                stop_time += events[i][1].timestamp() - prev_stop_event[1].timestamp()
                stop_start_time.append([dt.strftime(prev_stop_event[1], '%Y-%m-%d %H:%M:%S'), dt.strftime(events[i][1], '%Y-%m-%d %H:%M:%S')])
                stop_start_id.append([prev_stop_event[0], events[i][0]])
                stop_state = 0
        elif stop_state == 0:
            if events[i][2] in stop_events:   
                prev_stop_event = events[i]
                stop_state = 1

    up_time = (events[0][1].timestamp() - events[-1][1].timestamp()) - stop_time

    return [stop_time, up_time, stop_start_time, stop_start_id]

def analyze_event(event, events):
    occurences = 0
    lastO = [] 
    nextO = []
    before = True
    next_found = False
    for i in range(len(events)-1, -1, -1):
        if event[2] == events[i][2]:
            occurences += 1
            if event[0] == events[i][0]:
                before = False 
            elif before:
                lastO = [events[i][0], dt.strftime(events[i][1], '%Y-%m-%d %H:%M:%S')]
            elif not next_found:
                nextO = [events[i][0], dt.strftime(events[i][1], '%Y-%m-%d %H:%M:%S')]
                next_found = True

    return [occurences, lastO, nextO]

elements = []

if what_to_send == "robots":
    robots = get_table_data(con, "robots")    
    [stop_events, start_events] = get_start_stop_events(con)                

    for robot in robots:
        events = get_clamped_table_data(con, robot[1], start_time, end_time)
        if len(events) == 0:
            continue
        [stop_time, up_time, stop_start_time, stop_start_id] = compute_times(events)
        temp = Stripped_Robot()
        temp.robot_id = robot[0]
        temp.name = robot[1]
        temp.uptime = up_time
        temp.downtime = stop_time
        elements.append(temp)

if what_to_send == "events":
    events = get_clamped_table_data(con, robot_name, start_time, end_time, join = 1)  
    robotData = get_robot_data(con, robot_name) 
    [stop_events, start_events] = get_start_stop_events(con)

    [stop_time, up_time, stop_start_time, stop_start_id] = compute_times(events)

    robot = Robot()

    for event in events:
        temp = Stripped_Event()
        temp.event_id = event[0]
        temp.number = event[2]
        temp.reason = event[3]
        temp.domain = event[5]
        temp.header = event[7]
        temp.severity = event[6]
        if temp.severity == "Warning":
            temp.user_severity = 3
        elif temp.severity == "Error":
            temp.user_severity = 5
        else:
            temp.user_severity = 1

        temp.time = dt.strftime(event[1], '%Y-%m-%d %H:%M:%S')
        robot.events.append(temp)
    
    robot.name = robot_name
    robot.robot_id = robotData[0][0]
    robot.stop_start_time = stop_start_time
    robot.stop_start_id = stop_start_id
    robot.downtime = stop_time
    robot.uptime = up_time

    elements.append(robot)

if what_to_send == "event_details":

    events = get_clamped_table_data(con, robot_name, start_time, end_time, join = 1)
    
    details = get_event_data(con, robot_name, event_id)
    detail = details[0]
    [occurences, last_occurence, next_occurance] = analyze_event(detail, events)

    temp = Event()
    temp.event_id = detail[0]
    temp.number = detail[2]
    temp.reason = detail[3]
    temp.domain = detail[5]
    temp.header = detail[7]
    temp.severity = detail[6]
    temp.last_occurence = last_occurence
    temp.next_occurance = next_occurance
    temp.occurences = occurences
    temp.cause = detail[8]
    temp.action = detail[9]
    if temp.severity == "Warning":
        temp.user_severity = 3
    elif temp.severity == "Error":
        temp.user_severity = 5
    else:
        temp.user_severity = 1
    temp.time = dt.strftime(detail[1], '%Y-%m-%d %H:%M:%S')
    elements.append(temp)

if len(elements) > 0:
    data = Data(elements)
    data_out = jsons.dumps(data)
    print(data_out)
else:
    print(jsons.dumps("No data available."))

pass

