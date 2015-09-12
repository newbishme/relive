<?php

namespace relive\models;

class MediaURL extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'mediaurls';
	protected  $primaryKey = 'mediaurl_id';
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */

	public function media() {
		return $this->belongsTo('relive\models\Media');
	}
}