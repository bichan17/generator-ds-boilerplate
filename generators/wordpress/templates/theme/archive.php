<?php
// Template Name: Archives
get_header();
?>
<main>
	<header>
		<h1><?php the_archive_title(); ?></h1>
		<p><?php the_archive_description(); ?></p>
	</header>
	<div>
		<?php
		if (have_posts()) :
			while (have_posts()) : the_post();
				get_template_part('template-parts/post/content', get_post_type());
			endwhile;
			the_posts_pagination();
		endif;
		?>
	</div>
</main>
<?php get_footer(); ?>
