<?php 
    $out = array();
    foreach (glob('js/objects/*.js') as $filename) {
        $p = pathinfo($filename);
        // $out[] = 'js/objects/'.$p['filename'].'.js';
        $path = ',';
        echo '"js/objects/'.$p['filename'].'.js"'.$path;
        echo '<br>';
    }

    // echo "<br>";
    // $paths = '';
    // foreach (glob('js/objects/*.js') as $filename) {
    //     $p = pathinfo($filename);
    //     $path = ',';

    //     // $paths += '<script type="text/javascript" src="js/objects/'.$p['filename'].'.js"></script>'.$path;
    //     $out[] = '"js/objects/'.$p['filename'].'.js"'.$path;
    // }

    // echo json_encode($out); 
?>;