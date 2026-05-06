<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'jumlah_pembayaran',
        'status_pembayaran',
    ];



    public function order()
{
    return $this->belongsTo(Order::class, 'id_order', 'id_order');
}

}




