<!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
		<div class="site-container">
			<header class="site-header">
				<?php if (has_nav_menu('primary')) : ?>
					<nav class="site-navigation">
						<?php wp_nav_menu(array('menu_id' => 'primary', 'theme_location' => 'primary')); ?>
					</nav>
				<?php endif; ?>
			</header>
