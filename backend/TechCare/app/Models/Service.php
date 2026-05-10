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
        'id_service_center',
        'nama_service',
        'deskripsi_service',
        'harga_service',
    ];


        public function serviceCenter()
    {
        return $this->belongsTo(Service_Center::class, 'id_service_center', 'id_service_center');
    }


    
}
