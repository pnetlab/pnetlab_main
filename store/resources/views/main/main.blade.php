<!DOCTYPE html>
<html data-ng-app="unlMainApp">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <title>PNETLab | Lab is Simple</title>

  <link rel="shortcut icon" href="/store/public/assets/auth/img/logo.png">

  <!-- Tell the browser to be responsive to screen width -->
  <!-- <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport"> -->
  
  <!-- jQuery toggleswitch plugin css -->
  <!-- <link rel="stylesheet" href="/themes/adminLTE/plugins/ToggleSwitch/css/tinytools.toggleswitch.min.css"> -->
  
  <link rel="stylesheet" href="/store/public/extensions/toastr/toastr.min.css">
  <!-- Theme style -->
  {{-- <link rel="stylesheet" href="/themes/adminLTE/dist/css/AdminLTE.min.css"> --}}


  <script src="/store/public/extensions/jquery/jquery-3.3.1.min.js"></script>
  <script src="/store/public/extensions/jquery/jquery-ui.min.js" defer></script>

  <!-- Bootstrap 4 -->
  <script src="/store/public/extensions/bootstrap/js/popper.min.js"></script>
  <script src="/store/public/extensions/bootstrap/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="/store/public/extensions/icons/css/font-awesome.min.css" media="all" type="text/css" />
  <link rel="stylesheet" href="/store/public/extensions/bootstrap/css/bootstrap.min.css" media="all" type="text/css" />

  <!-- <script src="/themes/adminLTE/plugins/ToggleSwitch/tinytools.toggleswitch.min.js"></script> -->
  <script src="/store/public/extensions/angularJS/angular.js"></script>
  <!-- <script src="/themes/adminLTE/plugins/b64encode/b64encoder.js"></script> -->
  <!-- BEGIN CORE ANGULARJS PLUGINS -->
  <script src="/store/public/extensions/angularJS/angular-sanitize.min.js" type="text/javascript"></script>
  <script src="/store/public/extensions/angularJS/plugins/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
  <script src="/store/public/extensions/angularJS/angular-touch.min.js" type="text/javascript"></script>
  <script src="/store/public/extensions/angularJS/plugins/angular-ui-router.min.js" type="text/javascript"></script>
  <script src="/store/public/extensions/angularJS/plugins/ocLazyLoad.min.js" type="text/javascript"></script>
  <script src="/store/public/extensions/angularJS/plugins/angular-animate.js" type="text/javascript"></script>
  <script src="/store/public/extensions/angularJS/plugins/contextMenu.js" type="text/javascript"></script>
  <link rel="stylesheet" href="/store/public/extensions/angularJS/plugins/ui-select/select.min.css">
  <script src="/store/public/extensions/angularJS/plugins/ui-select/select.min.js" type="text/javascript"></script>
  <script src="/store/public/extensions/angularJS/angular-cookies.min.js" type="text/javascript"></script>
  <script src="/store/public/extensions/angularJS/plugins/angular-file-upload/angular-file-upload.min.js"></script>
  <!-- <script src="/themes/adminLTE/plugins/ng-knob/ng-knob.js" type="text/javascript"></script> -->
  <!-- END CORE ANGULARJS PLUGINS -->
  <!-- Toastr -->
  <script src="/store/public/extensions/toastr/toastr.min.js" type="text/javascript"></script>
  <script src="/store/public/extensions/swal2/swal2.all.min.js"></script>
  
  <script src="/store/public/admin/default/initial" type="text/javascript"></script>
  <script src="/store/public/assets/js/default.js" type="text/javascript"></script>
  <script src="/store/public/assets/js/constant.js" type="text/javascript"></script>
  <script src="/store/public/extensions/datetimepicker/js/moment.js"></script>

  <script src="/store/public/main/js/angularjs/app.js"></script>
  <script src="/store/public/main/js/angularjs/controllers/mainCtrl.js"></script>
  <script src="/store/public/main/js/angularjs/controllers/modalCtrl.js"></script>

  <link href="/themes/default/css/unetlab.css" rel="stylesheet" />
  <script src="/themes/default/bootstrap/js/jsPlumb-2.4.min.js" defer></script>
    
  <link id="load_files_before" />
</head>

<body data-ng-controller="unlMainController" class="page-loading">
  
    <div ng-if="loaded">
      <lab_folder></lab_folder>
    </div>

  
  <script>
  
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "2000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }

  </script>
</body>

</html>