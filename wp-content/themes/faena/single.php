<?php
    $singleTemplate = locate_template('dist/singles/'. $post->post_type .'.php');
    if (file_exists($singleTemplate)) {
        require_once($singleTemplate);
    } else {
        header('Location: /404');
    }
?>