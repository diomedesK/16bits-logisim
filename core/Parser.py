#pyright: reportGeneralTypeIssues=false

import sys, numpy
from core.Codes import Codes
from core.Status import Status

class ParseResult:
    def __init__(self, status: int, response: str):
        self.status = status
        self.response = response

def binToHex(stringBinary):
    hexCode = (numpy.base_repr( int(stringBinary, 2), base=16))
    # print(stringBinary)
    return (hexCode)

def parseRegister(ARG1, ARG2):
    REGS = {"R0":00, "R1":1, "R2":2, "R3":3}

    if str(ARG1) in REGS and str(ARG2) in REGS:
        pass
    else:
        sys.stderr.write("Error: registers must range from R0 to R3\n")
        sys.exit()
    
    s = f'{REGS.get(ARG1):02b}' + f'{REGS.get(ARG2):02b}'

    return s

class Parser:
    COMMANDS = {
        "ADD":"MAT", "SUB":"MAT", "MUL":"MAT", "DIV":"MAT", "STPU":"MAT", "STPD":"MAT", "NOT":"MAT", 
        "COPY":"MAT",
        "CONST": "CONST",

        "ADDRESS":"ADDRESS",

        "JGT":"JUMP", "JLT":"JUMP", "JNQ":"JUMP", "JEQ":"JUMP",

        "LOAD":"MEM",
        "SAVE":"MEM",

        "PAINT":"SCREEN", "ERASE":"SCREEN", "START":"SCREEN",

        "BUFF":"BUFF",

        "HALT":"HALT",

        "SOUND":"SOUND",

        "PASS":"PASS"
        }

    def MAT(self, COM, ARG1, ARG2, DEST):
        STANDARD_CODE = "0100"
        
        CODES = {
            #2 ARGUMENTOS
            "ADD": "1000", 
            "SUB":"1001", 
            "MUL":"1010", 
            "DIV":"1011",

            #1 ARGUMENTO
            "STPU":"0101", 
            "STPD":"0110", 
            "NOT":"0111", 
            "COPY":"1111"
        }

        if ARG2:
            s = (STANDARD_CODE + CODES.get(str(COM)) + parseRegister(ARG1, ARG2) + parseRegister("R0", DEST))
        else:
            s = (STANDARD_CODE + CODES.get(str(COM)) + parseRegister("R0", ARG1) + parseRegister("R0", DEST))
            
        return binToHex(s)


    def ADDRESS(self, AddressX16):
        STANDARD_CODE = "11"
        AddressX10 = int(AddressX16, 16)
        s = STANDARD_CODE + numpy.binary_repr(AddressX10, 14)

        return binToHex(s)

    def JUMP(self, COM, ARG1, ARG2):
        STANDARD_CODE = "1010"
        CODES = {
            "JGT":"0000",
            "JLT":"0001",
            "JNQ":"0010",
            "JEQ":"0011"
        }

        s = STANDARD_CODE + CODES.get(COM) + parseRegister(ARG1, ARG2) + "0000"

        return binToHex(s)


    def MEM(self, COM, ARG1):
        STANDARD_CODE = "1000"
        CODES = {
            "SAVE": "1000",
            "LOAD": "0000"
        }

        s = STANDARD_CODE + CODES.get(COM) + "0000" + parseRegister("R0", ARG1)

        return binToHex(s)


    def SCREEN(self, COM, X, Y):
        #X e Y ambos max == 31 (<32)
        #O input será em decimal mesmo
        
        STANDARD_CODE = "1011"
        CODES = {
            "PAINT": "1100",
            "ERASE": "0000",
        }

        #manual foda-se
        s = STANDARD_CODE + CODES.get(COM) + parseRegister(X, Y) + "0000"

        return binToHex(s)

    def BUFF(self, DEST):
        s = "011100000000" + parseRegister("R0", DEST)
        return binToHex(s)

    def SOUND(self, FREQ):
        if(int(FREQ, 16) > 4095):
            sys.stdout.write(f'\nALERT: Frequency {FREQ} surpasses the maximum range of 4095 (0xFFF). Behaviour may not be as expected.\n\n')
        
        s = "1001" + numpy.binary_repr(int(FREQ, 16), 12)[0:12]
        return binToHex(s)


    def parse(self, line) -> ParseResult:
        line = line.strip()
        line =  "".join(line.split(","))
        line = [element for element in line.split(" ") if element != ""]

        COM = line[0]

        response = Codes.PASS
        
        if (COM == "CONST"):
            #CONSTS são um caso à parte porque não interagem diretamente com os comandos da CPU
            if len(line) == 3:
                constValue = line[1]
                constAddress = line[2]

                return ParseResult( Status.CONSTANT, constAddress + " " + constValue )
            
            else:
                return ParseResult( Status.ERROR, f'2 arguments needed but {len(line) - 1} found')
            

        if not COM in self.COMMANDS:
            return ParseResult( Status.ERROR, f'{COM} is not an argument.')  

        else:
            if self.COMMANDS.get(COM) == "MAT":
                if len(line) == 3:
                    ARG1 = line[1]
                    DEST = line[2]
                    ARG2 = None
                elif len(line) == 4:
                    ARG1 = line[1]
                    ARG2 = line[2]
                    DEST = line[3]    
                else:
                    return ParseResult( Status.ERROR, "Number of arguments is invalid")
                
                response = self.MAT(COM, ARG1, DEST=DEST, ARG2=ARG2)
                
            elif self.COMMANDS.get(COM) == "ADDRESS":
                AddressX16 = line[1]
        
                if int(AddressX16, 16) <= 16383:
                    response = self.ADDRESS(AddressX16)
                else:
                    return ParseResult( Status.ERROR, f'Address {AddressX16} is out of range. Max is 0x3FFF')

            elif self.COMMANDS.get(COM) == "JUMP":
                if len(line) == 3:
                    ARG1= line[1]
                    ARG2 = line[2]
                    response = self.JUMP(COM, ARG1, ARG2)
                
                else:
                    return ParseResult( Status.ERROR, f'2 arguments needed but {len(line) - 1} found')

            elif self.COMMANDS.get(COM) == "MEM":
                if(len(line) == 2):
                    ARG1= line[1]
                    response = self.MEM(COM, ARG1)
                else:
                    return ParseResult( Status.ERROR, f'1 argument needed but {len(line) - 1} found')
            
            elif self.COMMANDS.get(COM) == "SCREEN":
                if (COM != "START"):
                    if len(line) == 3:
                        ARG1= line[1]
                        ARG2 = line[2]

                        response = self.SCREEN(COM, ARG1, ARG2)
                    else:
                        return ParseResult( Status.ERROR, f'2 arguments needed but {len(line) - 1} found\n')
                    
                else:
                    if len(line) > 1:
                        return ParseResult( Status.ERROR, "START takes no arguments")
                    else:
                        response = Codes.START

            elif self.COMMANDS.get(COM) == "BUFF":
                if len(line) != 2:
                    return ParseResult( Status.ERROR, "BUFF takes exactly one argument")
                else:
                    response = self.BUFF(line[1])

            elif self.COMMANDS.get(COM) == "HALT":
                if len(line) > 1:
                    return ParseResult( Status.ERROR, "HALT takes no arguments")
                else:
                    return ParseResult( Status.HALT, Codes.HALT)

            elif self.COMMANDS.get(COM) == "SOUND":
                if len(line) > 2:
                    return ParseResult( Status.ERROR, "SOUND takes exactly one argument (FREQUENCY)")  
                else:
                    response = self.SOUND(line[1])

            elif self.COMMANDS.get(COM) == "PASS":
                if len(line) > 1:
                    return ParseResult( Status.ERROR, "PASS takes no arguments")  
                else:
                    return ParseResult( Status.PASS, Codes.PASS)

            return ParseResult( Status.SUCCESS, response)
