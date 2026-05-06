<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_service',
        'deskripsi_service',
        'harga_service',
    ];


        public function serviceCenter()
    {
        return $this->belongsTo(Service_Center::class, 'service_center_id', 'service_center_id');
    }


    
}
