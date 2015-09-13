<?php

namespace relive\models;

class Media extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'medias';
	protected  $primaryKey = 'media_id';
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	public function mediaURLs() {
		return $this->hasMany('relive\models\MediaURL','media_id','media_id');
	}

	public function post() {
		return $this->belongsTo('relive\models\Post','post_id','post_id');
	}
}