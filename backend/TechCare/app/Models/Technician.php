<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Technician extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $table = 'technicians';
    protected $primaryKey = 'id_technician';

    protected $fillable = [
        'id_service_center',
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function serviceCenter()
    {
        return $this->belongsTo(Service_Center::class, 'id_service_center');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'id_technician');
    }
}