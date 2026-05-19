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
        Schema::table('service_centers', function (Blueprint $table) {
            $table->decimal('jarak_service_center', 8, 2)->default(0)->after('lokasi_service_center');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_centers', function (Blueprint $table) {
            $table->dropColumn('jarak_service_center');
        });
    }
};
