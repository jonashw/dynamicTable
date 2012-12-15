@echo off
echo Minifying!
java -jar c:\www\core\yuicompressor-2.4.7.jar --type js -o jQuery.dynamicTable.min.js jQuery.dynamicTable.js
java -jar c:\www\core\yuicompressor-2.4.7.jar --type js -o jQuery.dynamicTable.bootstrap.min.js jQuery.dynamicTable.bootstrap.js
