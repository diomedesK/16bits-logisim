START;
ADDRESS 0x1000; //Carregando o valor inicial (e constante) de Y em R0 (R0 = 16)
LOAD R0;
ADDRESS 0x1001; //Carregando o valor inicial de X em R1
LOAD R1;
COPY R1, R2;    //R2 = 0
ADDRESS 0x1010; //Carregando o valor limite da tela (0x001F) (32) em R3
LOAD R3;
PAINT R1, R0;   //Começa a pintar
STPU R1, R1;    
ADDRESS 0x0009;  //Fazer a comparação de X < 32. Se sim, continuar pintando
JLT R1, R3; //Saltar para a linha anterior a "PAINT R1, R0;"
PASS;
PASS; 
PASS;
PASS; 
ERASE R1, R0;   //Se chegou até aqui R1 excede a tela
STPD R1, R1;    
ADDRESS 0x0010; //Saltar para Erase
JGT R1, R2;     //Saltar enquanto X > 0 
ADDRESS 0x0009; //Else saltar de novo para PAINT R1, R0
JEQ R0, R0;
HALT;




CONST 0x0010, 0x1000; //Valor Y do meio da tela (31x31 com início em 0)
CONST 0x0000, 0x1001; //Valor de início de X
CONST 0x001F, 0x1010; //Limite da tela (32)

//Criar duas funçoes: 1) X = X+1; 2) X = X-1
