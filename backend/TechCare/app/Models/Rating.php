<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'id_service_center',
        'id_user',
        'nilai_rating', // dont forget use this on controller thingy magic $request->validate([ 'rating' => 'required|integer|min:1|max:5' ]);
        'kesan',
    ];




    public function serviceCenter()
    {
        return $this->belongsTo(Service_Center::class, 'id_service_center', 'id_service_center');
    }

    
}
