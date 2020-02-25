*=$E000

define scrn_mem $0080   ; start of screen memory

strout:
; writes a null terminated string to screen
; LDX #<data
; LDY #>data
; JSR strout
  STX strout_lsb    ; addr = lsb
  STY strout_msb    ; addr + 1 = msb
  LDY #0            ; Y = 0
strout_1:
  LDA (str_lsb), Y  ; load char at address (data + Y)
  BEQ strout_2      ; if 0 we are done
  STY strout_y      ; save Y
  JSR chrout        ; print to screen
  LDY strout_y      ; restore Y
  INY               ; increment Y
  JMP strout_1      ; loop
strout_2:
  RTS               ; done
strout_y:
  BRK               ; save Y here
strout_lsb:         ; pointer to string to print
  BRK
strout_msb:
  BRK

chrout:
; writes a char to screen
; LDA #char
; JSR chrout
  LDX chrout_ptr    ; get position to put char
  STA scrn_mem, X   ; copy char to screen
  INX               ; increment position
  STX chrout_ptr    ; save new position
  RTS
chrout_ptr:         ; next char position on screen
  BRK