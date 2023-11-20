import fileinput as fi
import sys, os, re, argparse
from core.Status import Status
from core.Parser import Parser

HEADER = "v3.0 hex words plain\n"

class ParseError(Exception):
    def __init__(self, message, lineNumber, line):
        self.message = message
        self.lineNumber = lineNumber
        self.line = line
        super().__init__(f'Error in line {lineNumber}: "{line}"\n{message}')

def main(fileIn):
    parser = Parser()

    lineCounter = 0
    str_buffer = ["0000"] * 16384  # Gera o arquivo base

    for line in fileIn:
        lineNumber = fileIn.filelineno()

        line = line.strip()

        if line == "\n" or line == "" or bool(re.search("^//", line)):
            lineCounter = lineCounter - 1
            continue

        elif re.search(";", line):
            line = line.split(";")[0]
        else:
            raise ParseError("No semicolon ';'", lineNumber, line)
        
        parseResult = parser.parse(line)
        print('''Line: "{}"
Status: "{}"
Result: "{}"
              '''.format(line, Status.name(parseResult.status), parseResult.response))

        status = parseResult.status
        response = parseResult.response

        if status == Status.ERROR: #error
            raise ParseError(response, lineNumber, line.strip())

        elif status == Status.SUCCESS: #success
            str_buffer[lineCounter] = response
        elif status == Status.CONSTANT:
            addr, val = response.split(" ")
            decimalAddress = int(addr, 16)

            if(decimalAddress > 16383):
                raise ParseError(f'Address {addr} is out of range. Max is 0x3FFF', lineNumber, line.strip())
            else:
                str_buffer[decimalAddress - 1] = val.zfill(4)

            if int(val, 16) > 65536:
                print(f'ALERT: The value {val} at line {lineNumber} will cause overflow\n')

            lineCounter = lineCounter - 1

        elif status == Status.HALT: #halt
            str_buffer[lineCounter + 1] = response.zfill(4)
            lineCounter = lineCounter + 1

        elif status == Status.PASS:  #pass
            str_buffer[lineCounter] = response.zfill(4)

        lineCounter = lineCounter + 1

    #Formatação para o arquivo de saída

    S = []
    C = []
    str_buffer.insert(0, "0000")
    for i in range(len(str_buffer)):
        I = i + 1

        C.append(str_buffer[i])

        if(I%16 == 0):
            S.append(" ".join(C))
            C = []


    outputp = sys.argv[1].split(".bones")[0]+".sesh"
    with open(outputp, "w") as of:
        of.write(HEADER + "\n".join(S))
        print("Success.")
        print(f'Outputted to {os.path.abspath(outputp)}')

    sys.exit(0)

if __name__ == "__main__":
    def is_valid_file(file_path):
        if not os.path.exists(file_path):
            raise argparse.ArgumentTypeError(f"File '{file_path}' does not exist.")
        
        _, file_extension = os.path.splitext(file_path)
        allowed_extensions = ['.bones']  # Add your allowed extensions here

        if file_extension.lower() in allowed_extensions:
            return file_path
        else:
            raise argparse.ArgumentTypeError(f"Invalid file extension. Allowed extensions are {', '.join(allowed_extensions)}.")

    argps = argparse.ArgumentParser(description="Compile .bones input file to the custom SESH Logisim CPU")
    argps.add_argument("input_file", help=".bones input file to be compiled", type=is_valid_file )
    args = argps.parse_args()
    
    fileIn = fi.FileInput(args.input_file)
    main(fileIn)

