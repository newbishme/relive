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
	protected $fillable = array('eventName');
	public $timestamps = false;
	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $appends = ['image'];

	protected $hidden = array('rankPoints','eventhashtagrelationship','posteventrelationship');

	public function eventhashtagrelationship() {
		return $this->hasMany('relive\models\EventHashtagRelationship','event_id','event_id');
	}

	public function posteventrelationship() {
		return $this->hasMany('relive\models\PostEventRelationship','event_id','event_id');
	}

	public function getImageAttribute() {
		$posts = [];

		while (true) {
			$relationship = $this->posteventrelationship()->orderByRaw("RAND()")->first();
			if ($relationship) {
				$id = $relationship->toArray()['post_id'];
				$media = \relive\models\Post::find($id)->media;
				if ($media) {
					return $media->data[0]->mediaURL;	
				}
			} else {
				return "";
			}
		}
	}
}