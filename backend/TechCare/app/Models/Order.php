<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'id_service',
        'id_user',
        'id_payment'
    ];



    public function payment()
    {
    return $this->hasOne(Payment::class, 'id_order', 'id_order');
    }


    public function orderView()
    {
        return $this->belongsTo(Order_view::class, 'id_order_view', 'id_order_view');
    }


    public function chat()
    {
        return $this->hasOne(Chats::class, 'id_order', 'id_order');
    }

    


}
