# pnetlab_main
<b>1. For Network Developers</b>  

Pnetlab allows you to integrate any device to the platform. The process involves defining fields in a template file. Your new field automatically appears in the form when you add or edit a node. Then, you can use PHP to insert your new field to the command for starting the device.  
<b>1.1 Template File </b>  
The template file is saved in the "templates" folder. It contains five main template files placed in the device folder. Other template files extend from the main template file. The template file follows the .yml format. Each field of the template file will be converted to an input box in the "Add a New Node" and "Edit Node" form.  

For example:  
```
console_2nd: 
  type: list # type of configuration (list, number, text, checkbox)
  value: ''  # the default value
  options:   # Options in case type is list
    '': 'Empty'
    telnet: Telnet
    rdp: RDP
    vnc: VNC
    ssh: SSH
    http: HTTP
    https: HTTPS
  wipe: 1 # 1 means this field needs to be wiped to get affected
  width: 6 # width of the input box 6/12 screen width
```
With this configuration, you will see an input box with the name "console_2nd". To change the name "console_2nd", please define it in language/common.json or create a new .json file in the language folder.  

<b>1.2 Device Files.</b>  
Device files are created by PHP. They process your input to create a command for starting the device. There are five main device files, device_qemu.php, device_iol.php, device_docker.php, device_dynamips.php, device_vpcs.php. Other device files extend from the main device file.  

In Device Files, you have to edit three functions to make your new field affected: getParmas, editParams, command.  

- editParmas: Get params from ADD or EDIT form and load to $this. $p is an object with keys that correspond with fields in the template file.
- getParams: Get params to save to .unl file.
- command: This function will build a command form params.  

In addition, you may have to modify other functions depending on your purpose.
After all is done, you can try starting the device. Then, you can find the built command in the log file: /opt/unetlab/data/Logs/unl_wrapper.txt.  

<b>2. For Pnetlab Developers</b>  

Backend:  
- The old module from Unetlab is still kept. Please refer to file: /opt/unetlab/html/api.php.
- We added a new module based on Laravel in the folder /opt/unetlab/html/store.

Frontend:  
- Pnetlab is built using React. You can find the source code in the folder: /opt/unetlab/html/store/resources.
- For rebuild from folder /opt/unetlab/html/store: run "npm run watch" for watch mode and "npm run production" for production.
