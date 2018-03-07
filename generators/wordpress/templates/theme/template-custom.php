<?php
// Template Name: Custom Template
get_header();
?>
<main>
	<?php
	while (have_posts()) : the_post();
		get_template_part('template-parts/page/content', 'custom');
	endwhile;
	?>
</main>
<?php get_footer(); ?>
