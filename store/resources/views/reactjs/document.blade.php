<!DOCTYPE html>
<html>
    <head>
        <title>{{get($title, APP_TITLE)}}</title>

        <link rel="shortcut icon" href="/store/public/assets/auth/img/logo.png">
        
        <meta charSet="utf-8"/>
    
          <link rel = "stylesheet" href = "{{url('/')}}/extensions/icons/css/font-awesome.min.css" media = "all" type = "text/css" />
    
          <link rel = "stylesheet" href = "{{url('/')}}/extensions/bootstrap/css/bootstrap.min.css" media = "all" type = "text/css" />
          
          <link rel="stylesheet" href="{{url('/')}}/extensions/animate/animate.min.css">
          
          <link rel="stylesheet" href="{{url('/')}}/extensions/hover/hover.css">
    
          <script src="{{url('/')}}/extensions/jquery/jquery-3.3.1.min.js"></script>

          <script src="{{url('/')}}/extensions/jquery/jquery-ui.min.js"></script>
          <link href="/themes/default/bootstrap/css/jquery-ui.min.css" rel="stylesheet" />
    
          <script src="{{url('/')}}/extensions/bootstrap/js/popper.min.js"></script>
    
          <script src="{{url('/')}}/extensions/bootstrap/js/bootstrap.min.js"></script>
          
          <script src="{{url('/')}}/extensions/animate/wow.js"></script>
          
          <script src="{{url('/')}}/extensions/swal2/swal2.all.min.js"></script>

          <script src="{{url('/')}}/extensions/nanoscroller/nanoscroller.js"></script>
          <link href="{{url('/')}}/extensions/nanoscroller/nanoscroller.css" rel = "stylesheet"/>
          
          <script src="{{url('/')}}/assets/js/default.js"></script>
          <script src="{{url('/')}}/assets/js/cookies.js"></script>
          <!-- <link rel="stylesheet" href="{{url('/')}}/assets/css/common.css"> -->
        
        <link rel = "stylesheet" href = "{{url('/')}}/extensions/datetimepicker/css/bootstrap-datetimepicker.min.css"/>
        <link rel = "stylesheet" href = "{{url('/')}}/extensions/table/resizable/resizable.css"/>
        
        <script src="{{url('/')}}/extensions/datetimepicker/js/moment.js"></script>
        <script src="{{url('/')}}/extensions/table/resizable/resizable.js"></script>
        <!-- <script src="{{url('/')}}/extensions/tinymce/jquery.tinymce.min.js"></script>  -->
        <!-- <script src="{{url('/')}}/extensions/tinymce/tinymce.min.js"></script> -->
        <script src="{{url('/')}}/extensions/datetimepicker/js/bootstrap-datetimepicker.min.js"></script>
        
        <script src="{{url('/')}}/table/js/table.js"></script>
        <script src="{{url('/')}}/table/js/cookies.js"></script>

        <link href="/themes/default/css/unetlab.css" rel="stylesheet" />
        <script src="/themes/default/bootstrap/js/jsPlumb-2.4.min.js" defer></script>
        
        

    </head>
    
    <body>
    
        @yield('body')
        @component('reactjs.button_up')@endcomponent
        
    </body>
    
    <footer>
        @yield('footer') 
         
        <script>
            
//             $.ajaxSetup({
//                 headers: {
//                     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
//                 }
//             });
        </script>   
        
    </footer>
    

    
</html>
