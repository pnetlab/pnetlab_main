<?php 
namespace App\Helpers\Captcha;

class Captcha {
    
    public static $CONFIG = array(
        'CAPTCHA_POOL' => 'ABCDEFGHJKLMNPQRSTUVWXYZ1234567890',
        'CAPTCHA_LENG' => 2,
        'CAPTCHA_SIZE' => 20,
        'CAPTCHA_WIDTH' => 80,
        'CAPTCHA_HEIGHT' => 40,
        'CAPTCHA_BACKGROUND'=>[255,255,255],
        'CAPTCHA_COLOR' => [64,64,64],
        'CAPTCHA_FONT' =>  '/ARIALBD.TTF',
        );

    public static function createCaptcha($id){
        $captcha_num = substr(str_shuffle(self::$CONFIG['CAPTCHA_POOL']), 0, self::$CONFIG['CAPTCHA_LENG']);
        $image = imagecreate(self::$CONFIG['CAPTCHA_WIDTH'], self::$CONFIG['CAPTCHA_HEIGHT']);
        $backgroundColor = imagecolorallocate($image, ...self::$CONFIG['CAPTCHA_BACKGROUND']); // set background color
        $captcharColor = imagecolorallocate($image, ...self::$CONFIG['CAPTCHA_COLOR']); // set background color
        $text_color = imagecolorallocate($image, 0, 0, 0);
        imagettftext($image, self::$CONFIG['CAPTCHA_SIZE'], rand()%15, 5, self::$CONFIG['CAPTCHA_HEIGHT']-5, $captcharColor, __DIR__ . self::$CONFIG['CAPTCHA_FONT'], $captcha_num);
        
        $line_color = imagecolorallocate($image, 64,64,64);
        for($i=0; $i<5; $i++) {
            imageline($image,0,rand()%self::$CONFIG['CAPTCHA_HEIGHT'], self::$CONFIG['CAPTCHA_WIDTH'] ,rand()%self::$CONFIG['CAPTCHA_HEIGHT'] , $line_color);
        }
        
        $pixel_color = imagecolorallocate($image, 0,0,255);
        for($i=0; $i<500; $i++) {
            imagesetpixel($image,rand()%self::$CONFIG['CAPTCHA_WIDTH'], rand()%self::$CONFIG['CAPTCHA_HEIGHT'], $pixel_color);
        }
        
        
        ob_start();
        imagejpeg($image);
        $imagedata = ob_get_clean();
        $imgHtml = '<img src="data:image/png;base64,'.base64_encode($imagedata).'" alt="captchar" width="'.self::$CONFIG['CAPTCHA_WIDTH'].'" height="'.self::$CONFIG['CAPTCHA_HEIGHT'].'"/>';
        session(['captcha_'.$id=> $captcha_num]);
        return ['img' => $imgHtml];
    }
    
    public static function verifyCaptcha($captcha){
        if(!is_array($captcha)) return false;
        $id = array_keys($captcha)[0];
        if(session('captcha_'.$id) == '' || session('captcha_'.$id) == null) return false;
        if($captcha[$id] == session('captcha_'.$id)){
            session(['captcha_'.$id=>'']);
            return true;
        }else{
            session(['captcha_'.$id=>'']);
        }
        
    }

}

?>