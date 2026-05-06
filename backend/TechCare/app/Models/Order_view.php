<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Order_view extends Model
   
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'status'


    ];

    public function order()
{
    return $this->hasMany(Order::class, 'id_order_view', 'id_order_view');
}


    public function historyMitra()
    {
        return $this->belongsTo(History_mitra::class, 'id_history_mitra', 'id_history_mitra');
    }





    
}
