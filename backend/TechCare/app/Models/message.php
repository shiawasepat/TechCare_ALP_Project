<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class message extends Model
{
    protected $fillable = [
        'id_sender',
        'sender_role',
        'pesan'
    ];


    public function messages()
    {
        return $this->hasMany(Message::class, 'chat_id', 'chat_id');
    }


    public function chat()
    {
        return $this->belongsTo(Chats::class, 'chat_id', 'chat_id');
    }
}



    // dont mind this shit below
//     public function getSender()
//     {
//         if ($this->sender_role === 'user') {
//             return User::find($this->sender_id);
//         }

//         return Mitra::find($this->sender_id);
//     }
// }