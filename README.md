## Overview

This is a 16-bit CPU that I built some time ago (around the end of 2021) as a project to better understand how computers work.
It works through the Logisim circuit simulator. To use it, just import the CPU.circ file into Logisim.  

In addition to the CPU design, I have also written a very basic Assembly language to make writing code easier. The source files should end with ```.bones``` and the compiled files end with ```.sesh```.   
To use these files, with Logisim open, right click over the RAM component and click on "Load Image", then import the ```.sesh``` file into it.

## Architecture

The CPU has 4 general use registers and 1 address register. The address register is used in ```SAVE``` and ```LOAD``` operations.
The memory contains 16384 addressable addresses, with each address being able to hold 16 bits of information. It also offers out-of-the-box support for a 32x32 display and a keyboard to serve as input.
There are 23 instructions available, ranging from logical operations to instructions related to the interface.

## Assembly Language

The CPU instruction set is very simple, and it's composed of 23 commands. Here is a quick explanation of these:

### ALU Operations

The commands that fall under this category are:

| Command | Syntax | Description | Binary output | Hex output | 
|---------|--------|-------------|---------------|------------| 
| ADD | ADD *Ra*, *Rb*, *Rdest* | Adds Ra to Rb and stores the result in Rdest | 0100 1000 RaRb 00DD | 0x48xy | 
| SUB | SUB *Ra*, *Rb*, *Rdest* | Subtract Rb from Ra and stores the result in Rdest | 0100 1001 RaRb 00DD | 0x49xy | 
| MUL | MUL *Ra*, *Rb*, *Rdest* | Multiply Ra to Rb and stores the result in Rdest | 0100 1010 RaRb 00DD | 0x4Axy | 
| DIV | DIV *Ra*, *Rb*, *Rdest* | Divides Ra by Rb and stores the result in Rdest | 0100 1011 RaRb 00DD | 0x4Bxy | 
| STPU | STPU *Rn*, *Rdest* | Increases Rn by 1 and stores the result in Rdest | 0100 0101 00RR 00DD | 0x45xy | 
| STPD | STPD *Rn*, *Rdest* | Decreases Rn by 1 and stores the result in Rdest | 0100 0110 00RR 00DD | 0x46xy | 
| NOT | NOT *Rn*, *Rdest* | Negates Rn and stores the result in Rdest. <br> If Rn is 1, output is *0*, else output is *FFFF - (Rn - 1)* | 0100 0111 00RR 00DD | 0x47xy | 
| COPY | COPY *Rn*, *Rdest* | Copies the value from Rn into Rdest | 0100 1111 00RR 00DD | 0x4Fxy | 

### JUMP Operations

JUMP operations modify the Program Counter (PC) if a specific condition is met.
In this tiny Assembly language, the destiny (or new PC value) is given by the value of the *address* register. The value of the address register is modified by calling the *ADDRESS* command.
Usually, a jump operation will look like the following:

```
ADDRESS 0x0009;  // Loads the value 0x0009 in the address register
JLT R1, R3; // Jump to 0x0009 if the value of R1 is smaller than R3
```

| Command | Syntax | Description | Binary output | Hex output | 
|---------|--------|-------------|---------------|------------| 
| JGT | JGT *Ra*, *Rb* | Modify PC to the value of the address register if Ra is greater than Rb | 1010 0000 R1R2 0000 | 0xA0x0 | 
| JLT | JLT *Ra*, *Rb* | Modify PC to the value of the address register if Ra is smaller than Rb | 1010 0001 R1R2 0000 | 0xA1x0 | 
| JNQ | JNQ *Ra*, *Rb* | Modify PC to the value of the address register if Ra is different from Rb | 1010 0010 R1R2 0000 | 0xA2x0 | 
| JEQ | JEQ *Ra*, *Rb* | Modify PC to the value of the address register if Ra is equal to Rb | 1010 0011 R1R2 0000 | 0xA3x0 | 

### RAM modifiers

Memory modifier operations act by modifying the RAM. They are usually written in the following fashion:
```
ADDRESS 0x001A;  // Loads the value 0x0009 in the address register
LOAD R0; // Save the value of the of the 0x0009 RAM address into the R0 register.

CONST 0x0005, 0x001A; // Writes the value 0x5 in the 0x001A address of the RAM.
```

| Command | Syntax | Description | Binary output | Hex output | 
|---------|--------|-------------|---------------|------------| 
| ADDRESS | ADDRESS *addr* | Stores the addr value into the address register | 11AA AAAA AAAA AAAA | 0xwxyz | 
| SAVE | SAVE *Rn* | Saves the value of the *Rn* register into the memory address pointed by the address register | 1000 1000 0000 00SS | 0x880x | 
| LOAD | LOAD *Rn* | Loads the value present in the memory address pointed by the address register into the *Rn* register  | 1000 0000 0000 00DD | 0x800x | 
| CONST | CONST *value*, *loc* | Saves the constant value CONST in the loc address of the RAM | *value* | *value* | 

### Interface

In order to create a form of user interface, a set of graphical commands were incorporated right into the CPU instructions. 

In the following table, *Rx* and *Ry* represent X and Y coordinates of a 2D Cartesian plane.

| Command | Syntax | Description | Binary output | Hex output | 
|---------|--------|-------------|---------------|------------| 
| START | START | Turns on the RGB video device | 1011 1000 0000 0000 | 0xb800 | 
| PAINT | PAINT *Rx*, *Ry* | Paint a white pixel in the X, Y coordinates indicated by Rx and Ry | 1011 11XX XXXY YYYY | 0xBxyz | 
| ERASE | ERASE *Rx*, *Ry* | Erases any pixel existent in the X, Y coordinates indicated by Rx and Ry | 1011 00XX XXXY YYYY | 0xBxyz | 
| SOUND | SOUND *freq* | Emits a beep with the specified frequency | 1001 FFFF FFFF FFFF | 0x9xyz | 
| BUFF | BUFF *Rn* | Reads a character from the keyboard buffer and stores it into the Rn register | Binary output | Hex output | 

### Commands with no arguments

In this category fall the two instructions composed by a single instruction alone.
The PASS instruction is meant just to make some sort of visual code segmentation possible. 

| Command | Syntax | Description | Binary output | Hex output | 
|---------|--------|-------------|---------------|------------| 
| HALT | HALT | Stops the program execution | 0000 1111 0000 1111 | 0x0F0F | 
| PASS | PASS | Does nothing | 0000 0000 0000 0000 | 0x0000 | 


