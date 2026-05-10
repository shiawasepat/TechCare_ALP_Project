<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chats extends Model
{
    protected $fillable = [
        'id_order',
        

    ];



    public function order()
    {
        return $this->belongsTo(Order::class, 'id_order', 'id_order');
    }

        public function messages()
    {
        return $this->hasMany(Message::class, 'id_chat', 'id_chat');
    }
}
