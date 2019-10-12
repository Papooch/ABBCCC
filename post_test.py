#!C:\Users\ondra\AppData\Local\Programs\Python\Python37\python.exe

print("Content-Type: text/html\n")
print('ready to print:')

import cgi

arguments = cgi.FieldStorage()
for i in arguments.keys():
    print(arguments[i].value)