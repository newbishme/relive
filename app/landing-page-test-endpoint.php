<?php

$start = 1;
$end = 10;

$items = array();

for ($i = $start; $i < $end; $i++)
{
  $items[] = array(
            'id'=>"".$i,
            'title'=>'Event '.$i,
            'image'=>'http://lorempixel.com/600/400/nature/'.$i
    );
}
echo json_encode($items, JSON_UNESCAPED_SLASHES);

?>
