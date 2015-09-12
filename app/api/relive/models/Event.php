<?php

namespace relive\models;

class Event extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'events';
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $appends = ['hashtags'];
	protected $hidden = array('rankPoints','eventhashtagrelationship');


	public function eventhashtagrelationship() {
		return $this->hasMany('relive\models\EventHashtagRelationship');
	}

	public function posteventrelationship() {
		return $this->hasMany('relive\models\PostEventRelationship');
	}

	public function getHashtagsAttribute() {
		$hashtags = [];

		foreach($this->eventhashtagrelationship as $relationship) {
			array_push($hashtags, $relationship->hashtag->hashtag);
		}
		return $hashtags;
	}
}