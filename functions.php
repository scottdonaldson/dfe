<?php

// Include this theme's stylesheet on the front end
function output_theme_css() { ?>

	<link rel="stylesheet" href="<?= get_stylesheet_directory_uri(); ?>/style.css">

<?php
}
add_action('wp_head', 'output_theme_css');


// ----- Include Advanced Custom Fields
include_once('functions/advanced-custom-fields/acf.php');
include_once('functions/acf-repeater/acf-repeater.php');