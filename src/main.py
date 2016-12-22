# import threading
import time
from packetAnalyzer import *
import multiprocessing


def main():  
    global trigger
    p = multiprocessing.Process(target=startCapture, name="startCapture") 
    p.start()
    # #time.sleep(1500)   #Time to run capture
    

    # #p.terminate()
    # #p.join()
    # #print "Packet pacture terminated"

    # p.terminate()
    # p.join()

    # p2 = multiprocessing.Process(target=startWritting, name="startWritting") 
    # p2.start()


    # p2.terminate()
    # p2.join()

main()