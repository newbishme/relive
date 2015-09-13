<?php

$start = 1;
$currentLastEntry = 10;

$lastRecord = $_GET['lastEventId'];

if ($start >= $currentLastEntry) {
   echo '';
} else {
  $start = $lastRecord + 1;
  $items = array();

  for ($i = $start; $i <= $currentLastEntry; $i++)
  {
    $items[] = array(
              'id'=>"".$i,
              'title'=>'Event '.$i,
              'image'=>'http://lorempixel.com/600/400/nature/'.$i
      );
  }
  echo json_encode($items, JSON_UNESCAPED_SLASHES);

}

?>
