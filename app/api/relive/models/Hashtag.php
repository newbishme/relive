<?php

namespace relive\models;

class Hashtag extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'hashtags';
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	public function posthashtagrelationship() {
		return $this->hasMany('relive\PostHashtagRelationship');
	}

	public function eventhashtagrelationship() {
		return $this->hasMany('relive\EventHashtagRelationship');
	}
}