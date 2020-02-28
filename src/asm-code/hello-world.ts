export const HELLO_WORLD =
`; prints "Hello World!" to 'screen memory'
*=$0200                 ; Start at $0200
define str_lsb $00      ; 0page address containing pointer to string to print
define str_msb $01
define scrn_ptr $0270   ; address containing next screen position
define scrn_mem $0280   ; start of screen memory

  LDX #<data        ; get the lsb of the string
  LDY #>data        ; get the msb of the string
  JSR strout        ; print it
  BRK

strout:
; writes a null terminated string to screen
; LDX #<data
; LDY #>data
; JSR strout
  STX str_lsb       ; addr = lsb
  STY str_msb       ; addr + 1 = msb
  LDY #0            ; Y = 0
strout_1:
  LDA (str_lsb), Y  ; load char at address (data + Y)
  BEQ strout_2      ; if 0 we are done
  STY strout_3      ; save Y
  JSR chrout        ; print to screen
  LDY strout_3      ; restore Y
  INY               ; increment Y
  JMP strout_1      ; loop
strout_2:
  RTS               ; done
strout_3:
  BRK               ; save Y here

chrout:
; writes a char to screen
; LDA #char
; JSR chrout
  LDX scrn_ptr      ; get position to put char
  STA scrn_mem, X   ; copy char to screen
  INX               ; increment position
  STX scrn_ptr      ; save new position
  RTS

data:
  DCB "Hello World!", 0
`;
