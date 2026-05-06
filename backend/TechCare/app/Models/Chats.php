<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chats extends Model
{
    protected $fillable = [

    ];



    public function order()
    {
        return $this->belongsTo(Order::class, 'id_order', 'id_order');
    }

        public function messages()
    {
        return $this->hasMany(Message::class, 'chat_id', 'chat_id');
    }
}
