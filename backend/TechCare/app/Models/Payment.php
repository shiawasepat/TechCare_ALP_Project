<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'id_order',
        'jumlah_pembayaran',
        'metode_pembayaran',
    ];



    public function order()
{
    return $this->belongsTo(Order::class, 'id_order', 'id_order');
}

}




