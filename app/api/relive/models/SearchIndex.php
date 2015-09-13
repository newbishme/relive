<?php

namespace relive\models;

class SearchIndex extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'events';
	protected  $primaryKey = 'event_id';
	public $timestamps = false;
	protected $appends = ['hashtags'];
	protected $hidden = array('event_id','dateAdded','startDate','endDate','caption','longitude','latitude','eventhashtagrelationship','rankPoints');
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	public function eventhashtagrelationship() {
		return $this->hasMany('relive\models\EventHashtagRelationship','event_id','event_id');
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