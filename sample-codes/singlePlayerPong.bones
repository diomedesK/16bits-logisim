ADDRESS 0x3000;
LOAD R0;
COPY R0, R1;
COPY R0, R2;
COPY R0, R3;
PASS;   //////////////////////////////////////////////////////////////////////////
BUFF R0;
BUFF R0;
ADDRESS 0x3001;
LOAD R3;    //R3 = 1 
ADDRESS 0x3005;                  "w"                                               #raqPlus
LOAD R1;            12
ADDRESS 0x00E0; Address #Raq+
JEQ R0, R1; //Jeq r0, r1
PASS;
ADDRESS 0x3006;                 "s"                                             #raqMinus
LOAD R1;
ADDRESS 0x00F7; Address #Raq-
JEQ R0, R1;                     19
PASS;                                                                            #donFreaks
ADDRESS 0x3002;
LOAD R3;
PASS;
PASS;     ---------- Parte onde são feitas as adições e subtrações em X e Y -----------
ADDRESS 0x1111; //flagX
LOAD R0;
ADDRESS 0x2222; //flagY
LOAD R1;                
ADDRESS 0x3001;   ////////////   Primeira parte onde R2 == 1   ///////////////      #ramX+
LOAD R2;                            
ADDRESS 0x0052;   #address addX                                                               
JEQ R0, R2;
PASS;                                                                               #ramY+
ADDRESS 0x005C;   #address addY
JEQ R1, R2;
PASS;   
ADDRESS 0x3000;  /////////////   Segunda parte onde R2 == 0   ///////////////       #ramX-
LOAD R2;
ADDRESS 0x0067;   #address subX
JEQ R0, R2;
PASS;                                                                               #ramY-
ADDRESS 0x0071;   #address subY
JEQ R1, R2;
PASS;           ///////////////////      Normal      ////////////////////////       #trunk
PASS;   //Desenhar a raquete
ADDRESS 0x3000;
LOAD R0; //R0 = X (0)
ADDRESS 0x1800;
LOAD R1; //R1 = Y da raquete
START;
PAINT R0, R1;
STPU R1, R1;    //STPU R1, R1
PAINT R0, R1;
ADDRESS 0x2400;
LOAD R0;
ADDRESS 0x2500;
LOAD R1;
PAINT R0, R1;
PASS;           --- Parte onde sao setadas as bandeiras ---
ADDRESS 0x3001;              //R2 é 1 aqui, e não 0 como em screenPong                                                                   
LOAD R2;
ADDRESS 0x0080; #address setX0                                                              #X0
JEQ R0, R3;
PASS;
ADDRESS 0x0088; #address setX1              tatakae                                         #X1
JEQ R0, R2;
PASS;
ADDRESS 0x3000;                                                                         #Y1
LOAD R2;                     //R2 é 0 agr por conta de Y        
ADDRESS 0x00CA; #address setY1                                                              
JEQ R1, R2;
PASS;
ADDRESS 0x00C4; #address setY0                                                              #Y0
STPD R3, R3;
JEQ R1, R3;    
PASS;           
ADDRESS 0x0001; #address começo  (onde r3 == 31)                                        #trunk2
JEQ R0, R0;
PASS;   // SOUND 0x0AAA;
HALT;           /////////////////////// FIM ///////////////////////////
PASS;
ADDRESS 0x2400;                                                               #addX
LOAD R0;
STPU R0, R0;
SAVE R0;
ADDRESS 0x1111; 
LOAD R0;
ADDRESS 0x0021; #address ramY+
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x2500;                                                                  #addY
LOAD R0;
STPU R0, R0;
STPU R0, R0;
SAVE R0;
ADDRESS 0x1111; 
LOAD R0;
ADDRESS 0x0025; #address ramX-
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x2400;                                                                  #subX
LOAD R0;
STPD R0, R0;
SAVE R0;
ADDRESS 0x1111; 
LOAD R0;
ADDRESS 0x0029; #address ramY-
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x2500;                                                                  #subY
LOAD R0;
STPD R0, R0;
STPD R0, R0;
SAVE R0;
ADDRESS 0x1111; 
LOAD R0;
ADDRESS 0x002C; #address trunk
JEQ R0, R0;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
ADDRESS 0x3000;                                                             #setX0
LOAD R2;
ADDRESS 0x1111;                                                                 
SAVE R2;
ADDRESS 0x0049;   #address Y0   (R2 vai ter que voltar a ser 0)
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x3001;                                136                              #setX1
LOAD R2;
ADDRESS 0x1111;
SAVE R2;  //X1 = True  
ADDRESS 0x2200;
SAVE R1;    //backup R1
ADDRESS 0x2500;
LOAD R1;    //R1 = Y
ADDRESS 0x2201;
SAVE R3;    //backup R3
ADDRESS 0x1800;
LOAD R3;    //R3 = Raq
ADDRESS 0x00AE;          #address subY+;
STPD R3, R3;
JEQ R1, R3; 
PASS;
STPU R3, R3;
JEQ R1, R3;
PASS; 
SOUND 0x0AAA;   PASS
STPU R3, R3;
ADDRESS 0x00B5;          #address subY-;
JEQ R1, R3;
STPU R3, R3; 
JEQ R1, R3;
ADDRESS 0x0123; #address GameOver                               #ELSE
JEQ R0, R0;
PASS;                                        156                    
ADDRESS 0x2200;                                                 #backToNormal
LOAD R1;
ADDRESS 0x2201;
LOAD R3;
PASS;
ADDRESS 0x0049; #address Y0
JEQ R0, R0;
PASS;
PASS;
PASS;
ADDRESS 0x2222;                                                             #subY+
SAVE R2;
ADDRESS 0x00A4; address #backToNormal
JEQ R0, R0;
PASS; // SOUND 0x0AAA;
PASS;
PASS;
ADDRESS 0x3000;                                                              #subY-
LOAD R2;
ADDRESS 0x2222;
SAVE R2;
ADDRESS 0x00A4; address #backToNormal
JEQ R0, R0;
PASS;
PASS;
PASS;
PASS;
PASS;
ADDRESS 0x0049;   #address Y0
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x2222;                                                              #setY0
SAVE R2;
ADDRESS 0x004D;   #address trunk2
JEQ R0, R0;
PASS;
PASS;
ADDRESS 0x3001;                                                              #setY1
LOAD R2;
ADDRESS 0x2222;
SAVE R2;
ADDRESS 0x3000;
LOAD R2;
ADDRESS 0x004D;   #address trunk2;
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
ADDRESS 0x2200;                                                                   #raq+
SAVE R0;
ADDRESS 0x1800; //R0 = Y
LOAD R0;
ADDRESS 0x2201;
SAVE R3;
ADDRESS 0x3000; //R3 = 0
LOAD R3;
ADDRESS 0x0116; #address notAllowed
JEQ R3, R0;
ADDRESS 0x1800;
STPD R0, R0;
SAVE R0;
ADDRESS 0x2200;                                                                   
LOAD R0;
ADDRESS 0x2201;                                                                   
LOAD R3;
ADDRESS 0x0014;  #address donFreaks
JEQ R0, R0;
PASS;
PASS;
PASS;
PASS;
ADDRESS 0x2200;                     240                                              #raq-
SAVE R0;
ADDRESS 0x1800;
LOAD R0;
ADDRESS 0x2201;
SAVE R3;
ADDRESS 0x3002;
LOAD R3;
STPD R3, R3;
ADDRESS 0x0116; #address notAllowed
JEQ R3, R0;
ADDRESS 0x1800;
STPU R0, R0;
SAVE R0;
ADDRESS 0x2200;                                                                   
LOAD R0;
ADDRESS 0x2201;
LOAD R3;
ADDRESS 0x0014;  #address donFreaks
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
ADDRESS 0x2200;                                                             #notAllowed
LOAD R0;
ADDRESS 0x2201;
LOAD R3;
ADDRESS 0x0014;  #address donFreaks
JEQ R0, R0;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
PASS;
START;                                                                        #gameover
ADDRESS 0x3100;
LOAD R0;
COPY R0, R1;
COPY R0, R2;
COPY R0, R3;
START;
PASS;
PASS;               E
ADDRESS 0x3102;
LOAD R0;
COPY R0, R1;
PAINT R0, R1;
STPU R1, R1;
PAINT R0, R1;
STPU R1, R1;
PAINT R0, R1;
STPU R1, R1;
PAINT R0, R1;
STPU R1, R1;
PAINT R0, R1;
STPU R1, R1;
PAINT R0, R1;
STPU R1, R1;    //Barra de E
ADDRESS 0x3102;
LOAD R0;
COPY R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;   //
ADDRESS 0x3102;
LOAD R0;
COPY R0, R1;
STPU R1, R1;
STPU R1, R1;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;   //
LOAD R0;
COPY R0, R1;
STPU R1, R1;
STPU R1, R1;
STPU R1, R1;
STPU R1, R1;
STPU R1, R1;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1;
STPU R0, R0;
PAINT R0, R1; 
STPU R0, R0;
PAINT R0, R1;   //
PASS;  -----------------------  FIM "E" --------------------
ADDRESS 0x310B;
LOAD R0;
ADDRESS 0x3102;
LOAD R1;        2
PAINT R0, R1;   //  
STPU R0, R2;
PAINT R2, R1;
STPU R1, R1;    3
PAINT R0, R1;   //
STPU R2, R2;
PAINT R2, R1;
STPU R1, R1;    4
PAINT R0, R1;   //
STPU R2, R2;
PAINT R2, R1;
STPU R1, R1;    5
PAINT R0, R1;   //
STPU R2, R2;
PAINT R2, R1;
STPU R1, R1;    6
PAINT R0, R1;   //
STPU R2, R2;
PAINT R2, R1;
STPU R1, R1;    7
PAINT R0, R1;   //
STPU R2, R2;
PAINT R2, R1;
PASS;   /////////////////
STPU R2, R2;
PAINT R2, R1;
STPD R1, R1;
PAINT R2, R1;
STPD R1, R1;
PAINT R2, R1;
STPD R1, R1;
PAINT R2, R1;
STPD R1, R1;
PAINT R2, R1;
STPD R1, R1;
PAINT R2, R1;
STPD R1, R1;
PASS;   ---------------- FIM "N" -------------------
ADDRESS 0x3114;
LOAD R0;
COPY R0, R2;
ADDRESS 0x3102;
LOAD R1;    ////////
PAINT R0, R1;   //
STPU R2, R2;
PAINT R2, R1;
STPU R2, R2;
PAINT R2, R1;
STPU R2, R2;
PAINT R2, R1;
STPU R2, R2;
PAINT R2, R1;
STPU R1, R1;
PAINT R0, R1;   //
STPU R2, R2;
PAINT R2, R1;
STPU R1, R1;    
PAINT R0, R1;   //
STPU R2, R2;
PAINT R2, R1;
STPU R1, R1;    
PAINT R0, R1;   //
PAINT R2, R1;
STPU R1, R1;
PAINT R0, R1;
STPD R2, R2;
PAINT R2, R1;
STPU R1, R1;
PAINT R0, R1;
STPD R2, R2;
PAINT R2, R1;
STPD R2, R2;
PAINT R2, R1;
STPD R2, R2;
PAINT R2, R1;
STPD R2, R2;
PAINT R2, R1;
PASS;    ------------------ Fim "D" -----------------------
HALT;
PASS;

CONST 0x0000, 0x3000;
CONST 0x0001, 0x3001;
CONST 0x001F, 0x3002;

CONST 0x0077, 0x3005;   //ascii "w"
CONST 0x0073, 0x3006;   //ascii "s"


CONST 0x0001, 0x1111;   //FlagX
CONST 0x0001, 0x2222;   //FlagY



CONST 0x0000, 0x3100;
CONST 0x0002, 0x3102;
CONST 0x0006, 0x3106;

CONST 0x000B, 0x310B;
CONST 0x0014, 0x3114;

//0X2400 = x
//0X2500 = y
//0X1800 = r[0]


//Aumentar a range do impacto de [Y, Y+1] para [Y-1, Y, Y+1, Y+1+1]