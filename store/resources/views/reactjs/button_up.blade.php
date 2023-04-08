<style>
    .button_uptop {
    	cursor: pointer;
        width: 32px;
        height: 32px;
        overflow: hidden;
        text-align: center;
        border: 1px solid #04BCAA;
        color: #999;
        border-radius: 3px;
        float: left;
        position: fixed;
        right: 16px;
        bottom: 15px;
        z-index: 900;
    	display: flex;
        align-items: center;
        justify-content: center;
    	visibility: hidden;
    }
    
    
</style>

<div class = "button button_uptop" onclick='$("body,html").animate({scrollTop: 0}, 500, "swing");'>

    <i class="fa fa-angle-up"></i>
    
</div>

<script type="text/javascript">

$(window).scroll(function(){
   if($('body').scrollTop() > 200 || $('html').scrollTop() > 200){
	   $(".button_uptop").css('visibility', 'unset');
   }else{
	   $(".button_uptop").css('visibility', 'hidden');
   }
});

</script>