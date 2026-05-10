<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'id_chat',
        'id_sender',
        'sender_role',
        'pesan'
    ];




    public function chat()
    {
        return $this->belongsTo(Chats::class, 'id_chat', 'id_chat');
    }

        public function sender()
    {
        if ($this->sender_role === 'user') {
            return $this->belongsTo(User::class, 'id_sender');
        }

        return $this->belongsTo(Mitra::class, 'id_sender', 'id_mitra');
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