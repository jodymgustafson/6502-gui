export const REGISTER_COUNT = 
`; counts in X and Y registers
define max_x $0F
define max_y $0A
  LDY #$00
y_loop:
  LDX #$00
x_loop:
  INX
  STX $0020
  CPX #max_x
  BNE x_loop
  INY
  STY $0028
  CPY #max_y
  BNE y_loop
  BRK`;
