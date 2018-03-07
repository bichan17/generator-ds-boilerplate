<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header>
		<h2><a href="<?php get_permalink(); ?>"><?php the_title(); ?></a></h2>
	</header>
	<div>
		<?php the_excerpt(); ?>
	</div>
</article>
