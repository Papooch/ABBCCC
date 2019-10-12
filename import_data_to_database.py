#!C:\Users\ondra\AppData\Local\Programs\Python\Python37\python.exe
print("Content-Type: text/html\n")

from to_database_and_beyond import *
import cgi
from base_functions import *
import os, os.path
import re

try:
    arguments = cgi.FieldStorage()
    fullpath = arguments["path"].value
    if os.path.splitext(fullpath)[1] == '.csv':
                filepaths.append(fullpath)
                temp = os.path.basename(fullpath)
                temp = temp.replace("EventLog", "")
                temp = temp.replace(".csv", "")
                temp = temp.strip()
                temp = temp.replace("-", "_")
                temp = temp.replace(" ", "_")
                temp = temp.replace(".", "_")
                robot_names.append(temp)

except:
    filepaths = []
    robot_names = []
    for root, dirs, files in os.walk("C:\\xampp\\htdocs\\abbccc\\Starterpack\\EventLog 10.10\\"):
        for f in files:
            fullpath = os.path.join(root, f)
            if os.path.splitext(fullpath)[1] == '.csv':
                filepaths.append(fullpath)
                temp = os.path.basename(fullpath)
                temp = temp.replace("EventLog", "")
                temp = temp.replace(".csv", "")
                temp = temp.strip()
                temp = temp.replace("-", "_")
                temp = temp.replace(" ", "_")
                temp = temp.replace(".", "_")
                robot_names.append(temp)

    # filepath = "C:\\xampp\\htdocs\\abbccc\\Starterpack\\EventLog 7.10\\EventLog   140-104432.csv"
    # robot_name = "140-104432"

# print(filepath)
for i in range(len(filepaths)):
    filepath = filepaths[i]
    robot_name = robot_names[i]
    if len(robot_name) == 0:
        break
    print(robot_name)

    # Process file
    with open(filepath, "r") as file:
        lines = [line.rstrip('\n') for line in file]

    # Extract header  
    separator = ';'
    lines.pop(0)
    header = lines[0].split(separator)
    lines.pop(0)

    important = ["TimeStamp", "Number", "Reason"]

    
    connection = connect_to_database()

    # Extract data
    events = []
    for line in lines:
        temp_row = line.split(separator)
        try:
            temp = Database_event()
            temp.time_stamp = correct_time(temp_row[header.index("TimeStamp")].replace('"', ''))
            temp.number = temp_row[header.index("Number")].replace('"', '')
            temp.reason = temp_row[header.index("Reason")].replace('"', '')
            if not event_exist(connection, temp.number):
                temp.domain = temp_row[header.index("Domain")].replace('"', '').replace("'", " ")
                temp.header = temp_row[header.index("Header")].replace('"', '').replace("'", " ")
                temp.cause = temp_row[header.index("Cause")].replace('"', '').replace("'", " ")
                temp.action = temp_row[header.index("Action")].replace('"', '').replace("'", " ")
                temp.severity = temp_row[header.index("Severity")].replace('"', '').replace("'", " ")

                update_event_list_table(connection, temp)

            events.append(temp)  
        except:
            pass
            

    if not table_exist(connection, robot_name):
        create_table(connection, robot_name)

    update_robots_table(connection, robot_name)
    update_event_table(connection, robot_name, events)
    



