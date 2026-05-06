<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'kesan',
    ];




    public function serviceCenter()
    {
        return $this->belongsTo(Service_Center::class, 'service_center_id', 'service_center_id');
    }

    
}
