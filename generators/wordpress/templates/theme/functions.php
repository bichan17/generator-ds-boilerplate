<?php

if (!function_exists('<%= config.wordpressThemePrefix %>_setup')) :
	function <%= config.wordpressThemePrefix %>_setup() {
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

		// add_image_size('name', 1600, 9999);
	}
endif;
add_action('after_setup_theme', '<%= config.wordpressThemePrefix %>_setup');

function custom_upload_mimes($existing_mimes = array()) {
	$existing_mimes['svg'] = 'image/svg';
	return $existing_mimes;
}
add_filter('upload_mimes', 'custom_upload_mimes');

function <%= config.wordpressThemePrefix %>_scripts() {
	wp_enqueue_style('<%= config.themeName %>-style', get_stylesheet_uri(), array(), null);
	wp_enqueue_script('jquery');
	wp_enqueue_script('<%= config.themeName %>-script', get_theme_file_uri('/assets/scripts/main.bundle.js'), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', '<%= config.wordpressThemePrefix %>_scripts');

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
