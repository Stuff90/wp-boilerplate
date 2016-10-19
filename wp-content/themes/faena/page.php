<?php
    $pageTemplate = locate_template('dist/pages/'. $post->post_name .'.php');
    if (file_exists($pageTemplate)) {
        if (have_posts()) : while (have_posts()) : the_post();
            require_once($pageTemplate);
        endwhile; endif;
        die();
    }
    $pageTemplate = locate_template('dist/pages/page-'. $post->ID .'.php');
    if (file_exists($pageTemplate)) {
        if (have_posts()) : while (have_posts()) : the_post();
            require_once($pageTemplate);
        endwhile; endif;
        die();
    }
    header('Location: /404.php');
?>
