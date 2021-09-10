<?php

//    $data = json_decode($_POST['images']);
//    var_dump($data);

    foreach ($_POST['images'] as $key => $value) {
        base64_to_jpeg($value, __DIR__ . '/images/' . $key . 'image.jpeg');
    }

    $rootPath = realpath('images');

    # create new zip opbject
    $zip = new ZipArchive();

    # create a temp file & open it
    $zip->open('images.zip', ZipArchive::CREATE);

    $iterator = new RecursiveDirectoryIterator($rootPath);
    $iterator->setFlags(RecursiveDirectoryIterator::SKIP_DOTS);
    $files = new RecursiveIteratorIterator($iterator,RecursiveIteratorIterator::LEAVES_ONLY);

    # loop through each file
    foreach($files as $file){

        # download file
        $download_file = file_get_contents($file);

        #add it to the zip
        $zip->addFromString(basename($file),$download_file);

    }

    # close zip
    $zip->close();

    foreach($files as $file)
        if(is_file($file))
            unlink($file); // delete file

//    unlink('images.zip');

function base64_to_jpeg($base64_string, $output_file) {
    // open the output file for writing
    $ifp = fopen( $output_file, 'wb' );

    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode( ',', $base64_string );

    // we could add validation here with ensuring count( $data ) > 1
    fwrite( $ifp, base64_decode( $data[ 1 ] ) );

    // clean up the file resource
    fclose( $ifp );

    return $output_file;
}
?>