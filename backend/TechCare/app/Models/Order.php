<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $primaryKey = 'id_order';
    protected $fillable = [
        'id_service',
        'id_user',
        'status_order',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'id_service', 'id_service');
    }


    public function payment()
    {
    return $this->hasOne(Payment::class, 'id_order', 'id_order');
    }




    public function chat()
    {
        return $this->hasOne(Chats::class, 'id_order', 'id_order');
    }

    


}
