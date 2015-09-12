<?php

namespace relive\models;

class Post extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'posts';
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('rankPoints');

	public function provider() {
		return $this->belongsTo('relive\models\Provider');
	}

	public function media() {
		return $this->hasOne('relive\models\Media');
	}

	public function posteventrelationship() {
		return $this->hasMany('relive\models\PostEventRelationship');
	}

	public function posthashtagrelationship() {
		return $this->hasMany('relive\models\PostHashtagRelationship');
	}
}