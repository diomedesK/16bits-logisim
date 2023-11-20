ADDRESS 0x3000;
LOAD R0;
COPY R0, R1;
COPY R0, R2;
COPY R0, R3;
PASS;   //////////////////////////////////////////////////////////////////////////
ADDRESS 0x3002;
LOAD R3;
PASS;   /////////////////////////////////////////////////////////////////////////
ADDRESS 0x1111; //flagX
LOAD R0;
ADDRESS 0x2222; //flagY
LOAD R1;                
ADDRESS 0x3001;   ////////////   Primeira parte onde R2 == 1   ///////////////      #ramX+
LOAD R2;                            
ADDRESS 0x0039;   #address addX                                                               
JEQ R0, R2;
PASS;                                                                               #ramY+
ADDRESS 0x0042;   #address addY
JEQ R1, R2;
PASS;   
ADDRESS 0x3000;  /////////////   Segunda parte onde R2 == 0   ///////////////       #ramX-
LOAD R2;
ADDRESS 0x004C;   #address subX
JEQ R0, R2;
PASS;                                                                               #ramY-
ADDRESS 0x0055;   #address subY
JEQ R1, R2;
PASS;           ///////////////////      Normal      ////////////////////////       #trunk
ADDRESS 0x2400;
LOAD R0;
ADDRESS 0x2500;
LOAD R1;
START;
PAINT R0, R1;
PASS;           --- Parte onde sao setadas as bandeiras ---
ADDRESS 0x3000;                                                                      
LOAD R2;
ADDRESS 0x0064; #address setX0                                                              #X0
JEQ R0, R3;
PASS;
ADDRESS 0x006A; #address setX1                                                              #X1
JEQ R0, R2;
PASS;           linha 44
ADDRESS 0x007A; #address setY1                                                              #Y1
JEQ R1, R2;
PASS;
ADDRESS 0x0074; #address setY0                                                              #Y0
STPD R3, R3;
JEQ R1, R3;    
PASS;           
ADDRESS 0x0006; #address começo        linha 52                                           #trunk2
JEQ R0, R0;
SOUND 0x0AAA;
HALT;           /////////////////////// FIM ///////////////////////////
PASS;
ADDRESS 0x2400;                    57                                            #addX
LOAD R0;
STPU R0, R0;
SAVE R0;
ADDRESS 0x1111; 
LOAD R0;
ADDRESS 0x0012; #address ramY+
JEQ R0, R0;
PASS;
ADDRESS 0x2500;              66                                                  #addY
LOAD R0;
STPU R0, R0;
STPU R0, R0;
SAVE R0;
ADDRESS 0x1111; 
LOAD R0;
ADDRESS 0x0016; #address ramX-
JEQ R0, R0;
PASS;
ADDRESS 0x2400;               76                                                 #subX
LOAD R0;
STPD R0, R0;
SAVE R0;
ADDRESS 0x1111; 
LOAD R0;
ADDRESS 0x001A; #address ramY-
JEQ R0, R0;
PASS;
ADDRESS 0x2500;                    85                                            #subY
LOAD R0;
STPD R0, R0;
STPD R0, R0;
SAVE R0;
ADDRESS 0x1111; 
LOAD R0;
ADDRESS 0x001D; #address trunk
JEQ R0, R0;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
ADDRESS 0x1111;          100                                                    #setX0
SAVE R2;
ADDRESS 0x002D;   #address Y0   
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x3001;                                                              #setX1
LOAD R2;
ADDRESS 0x1111;
SAVE R2;
ADDRESS 0x3000;
LOAD R2;
ADDRESS 0x002D;   #address Y0
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x2222;                                                              #setY0
SAVE R2;
ADDRESS 0x0034;   #address trunk2
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x3001;                                                              #setY1
LOAD R2;
ADDRESS 0x2222;
SAVE R2;
ADDRESS 0x3000;
LOAD R2;
ADDRESS 0x0034;   #address trunk2;
JEQ R0, R0;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;



CONST 0x0000, 0x3000;
CONST 0x0001, 0x3001;
CONST 0x001F, 0x3002;

CONST 0x0001, 0x1111;
CONST 0x0001, 0x2222;

//0X2400 = x