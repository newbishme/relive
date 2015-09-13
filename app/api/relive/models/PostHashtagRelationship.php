<?php

namespace relive\models;

class PostHashtagRelationship extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'posthashtagrelationships';
	protected  $primaryKey = 'relation_id';
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	public function post() {
		return $this->belongsTo('relive\models\Post');
	}

	public function hashtag() {
		return $this->belongsTo('relive\models\Hashtag');
	}
}