<?php

if (!function_exists('theme_setup')) :
	function theme_setup() {
		add_theme_support('automatic-feed-links');
		add_theme_support('html5', array(
			'caption',
			'comment-form',
			'comment-list',
			'gallery',
			'search-form'
			));
		add_theme_support('title-tag');
		add_theme_support('post-thumbnails');

		register_nav_menus(array('primary' => 'Primary Menu'));

		add_image_size('thumbnail-retina', 640, 9999);
		add_image_size('medium-retina', 1536, 9999);
		add_image_size('large-retina', 2048, 9999);
		add_image_size('extra-large', 1440, 9999);
		add_image_size('extra-large-retina', 2880, 9999);
	}
endif;
add_action('after_setup_theme', 'theme_setup');

function custom_upload_mimes($existing_mimes = array()) {
	$existing_mimes['svg'] = 'image/svg';
	return $existing_mimes;
}
add_filter('upload_mimes', 'custom_upload_mimes');

function theme_scripts() {
	wp_enqueue_style('theme-style', get_stylesheet_uri());
	wp_enqueue_script('jquery');
	wp_enqueue_script('theme-script', get_theme_file_uri('/assets/scripts/main.js'), array('jquery'), false, true);
}
add_action('wp_enqueue_scripts', 'theme_scripts');

add_filter('emoji_svg_url', '__return_false');
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'start_post_rel_link', 10, 0);
remove_action('wp_head', 'parent_post_rel_link', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'rest_output_link_wp_head', 10);
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0 );
remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
remove_action('wp_head', array($GLOBALS['sitepress'], 'meta_generator_tag'));
add_filter('w3tc_can_print_comment', '__return_false', 10, 1);

require get_template_directory() . '/includes/custom-post-types.php';
