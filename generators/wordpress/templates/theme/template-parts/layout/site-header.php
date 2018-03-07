<header class="site-header">
	<?php if (has_nav_menu('primary')) : ?>
		<nav class="site-navigation">
			<?php wp_nav_menu(array('theme_location' => 'primary')); ?>
		</nav>
	<?php endif; ?>
</header>
