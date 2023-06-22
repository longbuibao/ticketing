<?php
$dir = '.\';
$files = scandir($dir);
unset($files[0], $files[1]);
echo '<script>alert("The files in the current directory are:");';
foreach ($files as $file) {
  echo 'alert("' . $file . '");';
}
echo '</script>';
?>
