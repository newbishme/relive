<?php

namespace relive\models;

class PostEventRelationship extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'posteventrelationships';
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	public function post() {
		return $this->belongsTo('relive\models\Post');
	}

	public function event() {
		return $this->belongsTo('relive\models\Event');
	}
}