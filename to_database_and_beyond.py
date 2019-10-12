import mysql.connector
from mysql.connector import Error
from datetime import datetime as dt

def connect_to_database():
    connection = mysql.connector.connect(host='localhost',
                                            database='abbccc',
                                            user='root',
                                            password='')

    if connection.is_connected():
        db_Info = connection.get_server_info()
        cursor = connection.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
    else:
        pass
        # print("Database not connected.")

    return connection
    
def get_table_data(connection, table_name):
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM abbccc.' + table_name)

    rows = []
    for row in cursor:
        rows.append(row)

    return rows

def get_clamped_table_data(connection, table_name, start, end, join = False):
    cursor = connection.cursor()
    if not join:
        cursor.execute("SELECT * FROM abbccc." + table_name + " WHERE time >= '" + start + "' AND time <= '" + end + "' ORDER BY time desc" )
    else:
        cursor.execute("SELECT * FROM (SELECT * FROM abbccc." + table_name + " WHERE time >= '" + start + "' AND time <= '" + end + "' ORDER BY time desc) as a join events b on a.number = b.number")

    rows = []
    for row in cursor:
        rows.append(row)

    return rows

def get_event_data(connection, table_name, event_id):
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM (SELECT * FROM abbccc." + table_name + " WHERE event_id = "+ str(event_id)+") as a join events b on a.number = b.number")

    rows = []
    for row in cursor:
        rows.append(row)

    return rows

def get_robot_data(connection, robot_name):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM robots WHERE name = '" + robot_name + "'")

    rows = []
    for row in cursor:
        rows.append(row)

    return rows

def get_start_stop_events(connection):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM stop_events")

    stops = []
    for row in cursor:
        stops.append(row[1])


    cursor.execute("SELECT * FROM start_events")

    starts = []
    for row in cursor:
        starts.append(row[1])

    return [stops, starts]

def table_exist(connection, table_name):
    cursor = connection.cursor()
    table_name = table_name.replace("-", "_")
    table_name = table_name.replace(" ", "_")
    cursor.execute('SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N\'' + table_name +'\'')
    rows = []
    for row in cursor:
        rows.append(row)

    return not (len(rows) == 0)

def create_table(connection, table_name):
    cursor = connection.cursor()
    table_name = table_name.replace("-", "_")
    table_name = table_name.replace(" ", "_")
    cursor.execute('CREATE TABLE abbccc.' + table_name + ' ( event_id INT NOT NULL AUTO_INCREMENT , time DATETIME NOT NULL , number INT NOT NULL , reason VARCHAR(1000) NOT NULL , PRIMARY KEY (event_id)) ENGINE = InnoDB')

def robot_exist(connection, robot_name):
    cursor = connection.cursor()
    cursor.execute('SELECT 1 FROM robots WHERE name = \'' + robot_name +'\'')
    rows = []
    for row in cursor:
        rows.append(row)

    return not (len(rows) == 0)


def update_robots_table(connection, robot_name):    
    if not robot_exist(connection, robot_name):
        cursor = connection.cursor()
        cursor.execute("INSERT INTO robots (robot_id, name) VALUES (NULL, '" + robot_name + "');")
        connection.commit()

def event_exist(connection, event_number):
    cursor = connection.cursor()
    cursor.execute('SELECT 1 FROM events WHERE number = \'' + event_number +'\'')
    rows = []
    for row in cursor:
        rows.append(row)

    return not (len(rows) == 0)

def update_event_list_table(connection, event):
    if not event_exist(connection, event.number):
        cursor = connection.cursor()
        cursor.execute("INSERT INTO events (number, domain, severity, header, cause, action) VALUES ('" + event.number + "', '" + event.domain + "', '" + event.severity + "', '" + event.header + "', '" + event.cause + "', '" + event.action + "');")
        connection.commit()

def update_event_table(connection, table_name, data):
    cursor = connection.cursor()
    table_name = table_name.replace("-", "_")
    table_name = table_name.replace(" ", "_")

    cursor.execute('SELECT * FROM ' + table_name +' ORDER BY time DESC LIMIT 1')

    rows = []
    for row in cursor:
        rows.append(row)
    
    if len(rows) == 0:
        timestamp =  0
    else:
        timestamp = rows[0][1].timestamp()

    insert_strings = []
    for i in range(len(data)):
        if i%1000 == 0:
            insert_strings.append("")
        date_obj = dt.strptime(data[i].time_stamp, '%Y-%m-%d %H:%M:%S')
        if date_obj.timestamp() > timestamp:
            if len(data[i].reason) > 1000:
                data[i].reason = data[i].reason[:998]
            data[i].reason = data[i].reason.replace("'", "\\'")
            insert_strings[-1] = insert_strings[-1] + "(NULL, '" + data[i].time_stamp + "', '" + data[i].number + "', '" + data[i].reason + "'),"
        else:
            break

    for insert_string in insert_strings:
        insert_string = insert_string[:-1]
        if len(insert_string) > 0:
            cursor.execute("INSERT INTO " + table_name + " (event_id, time, number, reason) VALUES " + insert_string + ";")
            connection.commit()
        # cursor.execute("INSERT INTO " + table_name + " (event_id, time, number, reason) VALUES (NULL, '2019-10-11 05:00:14', '345', 'omg'),(NULL, '2019-10-11 05:00:14', '345', 'omg');")
# 

            # "INSERT INTO " + table_name + " (event_id, time, number, reason) VALUES (NULL, '" + data[i].time_stamp + "', '" + data[i].number + "', '" + data[i].reason + "');"
    # SELECT * FROM Table ORDER BY ID DESC LIMIT 1
    # CREATE TABLE `abbccc`. ( `event_id` INT NOT NULL AUTO_INCREMENT , `time` DATETIME NOT NULL , `number` INT NOT NULL , `reason` VARCHAR(500) NOT NULL , PRIMARY KEY (`event_id`)) ENGINE = InnoDB;


# cursor.execute('''
#                 INSERT INTO abbccc.log_karel (time, number, reason)
#                 VALUES
#                 ('2019-10-17 11:11:11','12345', 'cos to Honzo, cos to sněd?')
#                 ''')
# connection.commit()

# cursor.execute('SELECT * FROM abbccc.log_karel')

# for row in cursor:
#     print(row)
