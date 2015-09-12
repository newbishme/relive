<?php

namespace relive\models;

class EventHashtagRelationship extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'eventhashtagrelationships';
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	public function hashtag() {
		return $this->belongsTo('relive\Hashtag');
	}

	public function event() {
		return $this->belongsTo('relive\Event');
	}
}