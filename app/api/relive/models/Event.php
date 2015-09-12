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
	protected $hidden = array('rankPoints');


	public function eventhashtagrelationship() {
		return $this->hasMany('relive\EventHashtagRelationship');
	}

	public function posteventrelationship() {
		return $this->hasMany('relive\PostEventRelationship');
	}
}