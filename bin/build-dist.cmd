@echo off

set DIR=%~dp0.
set PATH=%DIR%\..\node_modules\.bin;%PATH%

set webpack_config=
if not [%1]==[] if exist "%~1" set webpack_config="%~1"
if not defined webpack_config  set webpack_config="%DIR%\..\webpack\cjs\webpack-base.config.js"

set dist=%cd%\dist

if exist "%dist%" rmdir /Q /S "%dist%"

rem :: es2020/esm
call :webpack --config %webpack_config% --env target=es2020 --env module=esm

rem :: es2020/cjs
call :webpack --config %webpack_config% --env target=es2020 --env module=cjs

rem :: es2020/web
call :webpack --config %webpack_config% --env target=es2020 --env module=web

rem :: es5/web
call :webpack --config %webpack_config% --env target=es5 --env module=web

call :update_pkg_json

goto :done

:webpack
  echo webpack %*
  echo.
  rem :: call webpack %*
  call node "%DIR%\..\node_modules\webpack\bin\webpack.js" %*
  echo.
  echo.
  goto :eof

:update_pkg_json
  call node "%DIR%\update_pkg_json.js"
  goto :eof

:done
