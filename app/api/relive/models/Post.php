<?php

namespace relive\models;

class Post extends \Illuminate\Database\Eloquent\Model {
	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'posts';
	protected  $primaryKey = 'post_id';
	protected $fillable = array('datetime', 'postURL', 'author', 'caption', 'provider_id');
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('rankPoints','provider_id','posteventrelationship','posthashtagrelationship');
	protected $appends = ['providerName','media'];

	public function toArray() {
		$data = parent::toArray();
		$newData = [];
		if ($data['media']!=null) {
			return $data;
		} else {
			unset($data['media']);
			return $data;
		}
	}
	public function provider() {
		return $this->belongsTo('relive\models\Provider','provider_id','provider_id');
	}

	public function media() {
		return $this->hasOne('relive\models\Media','post_id','post_id');
	}

	public function posteventrelationship() {
		return $this->hasMany('relive\models\PostEventRelationship','post_id','post_id');
	}

	public function posthashtagrelationship() {
		return $this->hasMany('relive\models\PostHashtagRelationship','post_id','post_id');
	}

	public function getProviderNameAttribute() {
		return $this->provider()->select('providerName')->first()->providerName;
	}

	public function getMediaAttribute() {
		$media = $this->media()->get()->first();
		return $media;
	}
}