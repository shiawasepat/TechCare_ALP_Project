<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Service_Center extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name_service_center',
        'deskripsi_service_center',
        'lokasi_service_center',
        'status_service_center',

    ];



    public function mitra()
    {
        return $this->belongsTo(Mitra::class, 'mitra_id', 'mitra_id');
    }


    public function services()
    {
        return $this->hasMany(Service::class, 'service_center_id', 'service_center_id');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'service_center_id', 'service_center_id');
    }








}