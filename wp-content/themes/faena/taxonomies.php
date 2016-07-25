<?php
    $pageTemplate = locate_template('dist/taxonomies/'. $post->post_name .'.php');
    if (file_exists($pageTemplate)) {
        require_once($pageTemplate);
    } else {
        header('Location: /404.php');
    }
?>