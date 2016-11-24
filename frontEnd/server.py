import select
import socket
import time

def write(data):
    f = open('data.json', 'w')
    f.write(data)
    f.close()
    print "wrote data"


def startReceiving():
    host =''
    port = 12345

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((host,port))
    s.setblocking(0)
    s.listen(1)
    
    while True:
        ready = select.select([s], [], [], 10)
        if ready[0]:
            conn, addr = s.accept()
            data =""
            part = None
            while part!="":
                try:
                    part = conn.recv(4096)
                except socket.error:
                    print "error with socket"
                    break
                data += part
                print "Receiving..."
            write(data)
        else:
            print "no connections...", str(int(time.time()))

def main():
    while True:
        if(int(time.time()) % 10 == 0):
            startReceiving()

main()