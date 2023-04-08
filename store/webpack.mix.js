let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
	
	resolve: {
		extensions: ['.js', '.scss', '.json'],
        alias: {
            "@root": __dirname + "/store/resources",
            "@react": __dirname + "/store/resources/react",
            "@comp": __dirname + "/store/resources/react/components",
            
        }
    }
    
});

mix.react('store/resources/react/app.js', 'store/public/react/js')
.js('store/resources/react/main.js', 'store/public/react/js')
.js('store/resources/react/lab.js', 'store/public/react/js');
mix.copyDirectory('store/resources/assets/img', 'store/public/assets/img')
.copyDirectory('store/resources/assets/fonts', 'store/public/assets/fonts')
.copyDirectory('store/resources/assets/js', 'store/public/assets/js'); 

