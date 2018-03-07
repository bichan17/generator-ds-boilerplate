<?php get_header(); ?>
<main>
	<?php
	while (have_posts()) : the_post();
		get_template_part('template-parts/post/content-single', get_post_type());
	endwhile;
	?>
</main>
<?php get_footer(); ?>
