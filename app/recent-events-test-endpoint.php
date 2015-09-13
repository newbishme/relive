<?php

$start = 1;
$currentLastEntry = 5;

$items = array();

for ($i = $start; $i <= $currentLastEntry; $i++)
{
  $items[] = array(
            'id'=>"".$i,
            'title'=>'Event '.$i,
    );
}
echo json_encode($items, JSON_UNESCAPED_SLASHES);


?>
