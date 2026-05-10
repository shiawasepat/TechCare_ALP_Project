<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('history_mitras', function (Blueprint $table) {
            $table->id('id_history_mitra');
            $table->foreignId('id_mitra')->constrained('mitras', 'id_mitra');
            $table->foreignId('id_order_view')->constrained('order_views', 'id_order_view');
            $table->timestamp('tanggal_selesai')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('history_mitras');
    }
};
