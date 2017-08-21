<?php get_header(); ?>
<main>
	<?php if (have_posts()) : ?>
		<header>
			<h1 class="heading--page-title"><?php the_archive_title(); ?></h1>
			<p><?php the_archive_description(); ?></p>
		</header>
	<?php
		while (have_posts()) : the_post();
			get_template_part('template-parts/content', get_post_format());
		endwhile;
	else :
		get_template_part('template-parts/content', 'none');
	endif;
	?>
</main>
<?php get_footer(); ?>
