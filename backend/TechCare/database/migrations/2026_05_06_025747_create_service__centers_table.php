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
        Schema::create('service_centers', function (Blueprint $table) {
            $table->id("id_service_center");
            $table->foreignId('id_mitra')->unique()->constrained('mitras', 'id_mitra');
            $table->foreignId('id_service')->constrained('services', 'id_service');
            $table->foreignId('id_rating')->constrained('ratings', 'id_rating');
            $table->string('nama_service_center');
            $table->string('deskripsi_service_center');
            $table->string('lokasi_service_center');
            $table->enum('status_service_center', ['buka', 'tutup'])-> default('buka');
            $table->string('foto_service_center')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_centers');
    }
};
