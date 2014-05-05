<?php 
/*
Template Name: Digital Invisibles
*/

// if submitting the form
if ( isset($_POST['submit']) ) {

	// collect $_POST variables
	$submitter_name = $_POST['submitter-name'];
	$submitter_email = $_POST['submitter-email'];
	$invisible_name = $_POST['invisible-name'];
	$information = isset($_POST['information']) ? $_POST['information'] : '';

	// clean them up
	$submitter_name = htmlspecialchars($submitter_name);
	$submitter_email = htmlspecialchars($submitter_email);
	$invisible_name = htmlspecialchars($invisible_name);
	$information = htmlspecialchars($information);

	$email_to = 'scott.p.donaldson@gmail.com';
	$email_subject = 'Digital Invisible: ' . $invisible_name;
	$email_body = $submitter_name . ' (' . $submitter_email . ') submitted the following Digital Invisible:\n';
	$email_body .= $invisible_name . '\n';
	$email_body .= $information;

	mail($email_to, $email_subject, $email_body);

}

get_header(); the_post(); ?>

	<section id="primary" class="row-fluid">

		<section id="content" class="span12">		

			<section class="icy-slogan" style="border-bottom: 0;">
				<h2 class="icy-slogan-title fadeInDown animated"><?php the_title(); ?></h2>
			</section>		

        	<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">                       

	            <div class="entry-content">

	            	<div class="the-content row-fluid">

		            	<div class="span6 col-left">

		            		<h2 class="caps">Submit an Invisible</h2>
		            	
							<form action="<?php the_permalink(); ?>" id="digital-invisibles-submit" method="POST">

								<div class="row-fluid">
									<label for="submitter-name">Your name</label>
									<input type="text" id="submitter-name" name="submitter-name" required>
								</div>

								<div class="row-fluid">
									<label for="submitter-email">Your email</label>
									<input type="email" id="submitter-email" name="submitter-email" required>
								</div>
	
								<div class="row-fluid">
									<label for="invisible-name">Name of "invisible"</label>
									<input type="text" id="invisible-name" name="invisible-name" required>
								</div>

								<div class="row-fluid">
									<label for="information">More info</label>
									<textarea name="information" id="information"></textarea>
								</div>

								<input type="submit" value="Submit" name="submit">
							</form>

		            	</div>

		            	<div class="span6 col-right">
		            		<h2 class="caps">Invisibles</h2>

		            		<p>Track the progress we have made to bring visibility to underrepresented characters of architectural history.</p>

							<div class="invisible" data-wiki="Denise_Scott_Brown">
								<h3>Denise Scott Brown</h3>
								<div class="edits">Loading...</div>
							</div>

							<div class="invisible" data-wiki="Lina_Bo_Bardi">
								<h3>Lina Bo Bardi</h3>
								<div class="edits">Loading...</div>
							</div>

							<div class="invisible" data-wiki="Jane_Jacobs">
								<h3>Jane Jacobs</h3>
								<div class="edits">Loading...</div>
							</div>

							<div class="invisible" data-wiki="Frank_Lloyd_Wright">
								<h3>Frank Lloyd Wright</h3>
								<div class="edits">Loading...</div>
							</div>

							<div class="invisible">
								<h3><span class="strikethrough">Jane Doe</span></h3>
								<div class="edits">Invisible</div>
							</div>
		            	</div>
	                    
						
	                </div>
	            </div>	

	        </article>

		</section>

	</section>

	<script src="<?= get_stylesheet_directory_uri(); ?>/invisibles.js"></script>

<?php get_footer(); ?>