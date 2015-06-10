<?php
/*
Template Name: Digital Invisibles
*/

get_header(); the_post(); ?>

	<script src="<?= get_stylesheet_directory_uri(); ?>/underscore.js"></script>
	<script src="<?= get_stylesheet_directory_uri(); ?>/snap.js"></script>

	<section id="primary" class="row-fluid">

		<section id="content">

			<section class="icy-slogan" style="border-bottom: 0;">
				<h2 class="icy-slogan-title fadeInDown animated"><?php the_title(); ?></h2>
			</section>

			<?php if (isset($_POST['submit'])) { ?>
				<h3 class="red" style="text-align: center; margin-bottom: 30px;">Thanks for submitting! Be sure to check back here here for progress.</h3>
			<?php } ?>

        	<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">

	            <div class="entry-content">

	            	<div class="the-content">

						<p><strong>Follow Design for Equality on Twitter, and tell us who you think deserves to be represented on Wikipedia.<br><br>
							<span style="display: block; text-align: center;">
							<a href="https://twitter.com/design_equality" class="twitter-follow-button" data-show-count="false">Follow @design_equality</a>
	<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
							</span>
					</strong></p>

						<?php

	            		$invisibles = get_field('invisibles');

	            		if ($invisibles) { ?>

		            	<div class="row-fluid">
		            		<h2 class="caps">Invisibles</h2>

		            		<p>Track the progress we have made to bring visibility to underrepresented characters of architectural history.</p>

							<?php
		            		foreach ($invisibles as $invisible) {

		            			if (function_exists('preg_filter')) {
			           				$wiki_slug = $invisible['wiki_page'] ? preg_filter('/_|\W/', '', $invisible['wiki_page']) : '';
			           			} else {
			           				$wiki_slug = $invisible['wiki_page'] ? preg_replace('/_|\W/', '', $invisible['wiki_page']) : '';
			           			}
		           				if ( strlen($wiki_slug) === 0 ) { $wiki_slug = $invisible['wiki_page']; }

		            			$invisible_class = $invisible['is_wiki_page'] ? 'invisible row-fluid' : 'invisible row-fluid no-edits';
		            			$data_wiki = $invisible['wiki_page'] ? 'data-real-wiki="' . $invisible['wiki_page'] . '" data-wiki="' . $wiki_slug . '"' : '';
		            			$h3_span_class = $invisible['is_wiki_page'] ? '' : 'strikethrough';
			            		?>

			            		<div class="<?= $invisible_class; ?>" <?= $data_wiki ?>>
			            			<h3><span class="<?= $h3_span_class; ?>"><?= $invisible['name']; ?></span></h3>
			            			<div class="edits-and-graph">
				            			<div class="edits">
				            				<?php if ($invisible['is_wiki_page']) { ?>
				            					<span>Loading...</span>
				            					<small class="total-number caps">Total number of edits made</small>
				            				<?php } else { ?>
				            					<span>Invisible</span>
				            				<?php } ?>
				            			</div>
				            		</div>
			            		</div>
		            		<?php } ?>
		            	</div>

		            	<?php } ?>
	                </div>
	            </div>

	        </article>

		</section>

	</section>

	<script src="<?= get_stylesheet_directory_uri(); ?>/invisibles.js"></script>

<?php get_footer(); ?>
