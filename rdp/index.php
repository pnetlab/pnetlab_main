<?php //Generate text file on the fly

      header("Cache-Control: public"); 
      header("Content-Description: File Transfer"); 
      header("Content-Disposition: attachment; filename=".$_GET["target"]."_".$_GET["port"].".rdp"); 
      header("Content-Type: application/x-rdp"); 
      header("Content-Transfer-Encoding: 8bit"); 
   $content="screen mode id:i:2
smart sizing:i:1
session bpp:i:16
winposstr:s:0,1,305,203,1105,803
compression:i:1
keyboardhook:i:2
displayconnectionbar:i:1
disable wallpaper:i:0
disable full window drag:i:0
allow desktop composition:i:1
allow font smoothing:i:1
disable menu anims:i:0
disable themes:i:0
disable cursor setting:i:0
bitmapcachepersistenable:i:1
audiomode:i:0
redirectprinters:i:1
redirectcomports:i:0
redirectsmartcards:i:1
redirectclipboard:i:1
redirectposdevices:i:0
autoreconnection enabled:i:1
auto connect:i:1
authentication level:i:0
prompt for credentials:i:0
negotiate security layer:i:1
remoteapplicationmode:i:0
alternate shell:s:
shell working directory:s:
gatewayhostname:s:
gatewayusagemethod:i:4
gatewaycredentialssource:i:4
gatewayprofileusagemethod:i:0
promptcredentialonce:i:0
devicestoredirect:s:*
drivestoredirect:s:*";

print $content."\r\nfull address:s:".$_GET["target"].":".$_GET["port"];
?>
