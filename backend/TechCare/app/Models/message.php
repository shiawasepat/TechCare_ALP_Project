<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'id_chats',
        'sender_id',
        'sender_type',
        'pesan'
    ];




    public function chat()
    {
        return $this->belongsTo(Chats::class, 'id_chats', 'id_chats');
    }
    // decided using polymorph not manually too much hassle gay
    public function sender()
    {
        return $this->morphTo();
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