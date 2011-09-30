@ECHO OFF

SET CurrentDir=%~1
SET OutPutFile=%CurrentDir%%~2
SET BuildOrder=%CurrentDir%%~3

ECHO JSBuild Starting...
FOR /F "tokens=*" %%A in (%BuildOrder%) DO (  
@REM Wrap each file output in a new line
@ECHO. >>%OutPutFile%.temp
ECHO Building... %%A
@TYPE %CurrentDir%%%A >> %OutPutFile%.temp
@ECHO. >>%OutPutFile%.temp
)

@REM Remove the OutputFile if it exists
DEL %OutPutFile%

@REM Wrap the final output in an IIFE
@REM (function(window, undefined){ >> %OutPutFile%
@TYPE %OutPutFile%.temp >> %OutPutFile%
@REM })(window); >> %OutPutFile%
DEL %OutPutFile%.temp
ECHO JSBuild Succeeded
ENDLOCAL
GOTO :eof