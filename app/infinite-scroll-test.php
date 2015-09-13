<?php

$lastRecord = $_GET['lastRec'];

$start = $lastRecord;
$end = $lastRecord + 20;

$items = array();

for ($i = $start; $i < $end; $i++)
{
  $items[] = array(
            'title'=>'Title '.$i,
            'image'=>'http://lorempixel.com/600/400/nature/'.$i,
            'author'=>'Author '.$i,
            'content'=>'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
    );
}
echo json_encode($items, JSON_UNESCAPED_SLASHES);

?>
