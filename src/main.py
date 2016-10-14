from sites import *
import threading
import time
from packetAnalyzer import *
from packetAnalyzerFiltered import *
import multiprocessing


def main():  
<<<<<<< HEAD
    global trigger
    #p = multiprocessing.Process(target=startCapture, name="startCapture")
    p = multiprocessing.Process(target=startCapture, name="startCapture") 
    p.start()
    time.sleep(1200)   #Time to run capture
=======
    #global trigger
    p = multiprocessing.Process(target=startCapture, name="startCapture")
    p2 = multiprocessing.Process(target=startCapture2, name="startCapture") 
    p.start()
    p2.start()
    time.sleep(350)   #Time to run capture
>>>>>>> bb71a2585c1512d4242d2efaf2847b02745e8708

    #time.sleep(2)

    p.terminate()
    p.join()
    p2.terminate()
    p2.join()
    print "Packet pacture terminated"

main()