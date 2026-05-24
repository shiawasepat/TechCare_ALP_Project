<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mitra;
use App\Models\Service_Center;
use App\Models\Technician;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // 0. The Dashboard (List everything)
    public function index()
    {
        // Fetch all service centers, plus their owner (Mitra) and their technicians
        // Make sure you have these relationships defined in your Service_Center model!
        $serviceCenters = Service_Center::with(['mitra', 'technicians'])->latest()->get();

        return view('dashboard', compact('serviceCenters'));
    }

    // 1. Show the Create Form (Mitra + Service Center)
    public function create()
    {
        return view('create_mitra');
    }

    // 1 & 2. Store the Mitra + Service Center safely
    public function store(Request $request)
    {
        $request->validate([
            // Mitra Validation
            'mitra_email' => 'required|email|unique:mitras,email',
            'mitra_password' => 'required|min:6',
            
            // Service Center Validation
            'shop_name' => 'required|string',
            'shop_description' => 'required|string',
            'shop_address' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // A. Create the Boss (Mitra)
            $mitra = Mitra::create([
                'email' => $request->mitra_email,
                'password' => Hash::make($request->mitra_password),
            ]);

            // B. Create the Shop and link it to the Boss
            Service_Center::create([
                'id_mitra' => $mitra->id_mitra, // Or whatever your primary key is named
                'name_service_center' => $request->shop_name,
                'deskripsi_service_center' => $request->shop_description,
                'lokasi_service_center' => $request->shop_address,
            ]);

            DB::commit(); // Save everything permanently

            return redirect()->route('admin.dashboard')->with('success', 'Mitra and Workshop created successfully!');

        } catch (\Exception $e) {
            DB::rollBack(); // Uh oh, something failed. Cancel everything!
            return back()->with('error', 'Failed to create: ' . $e->getMessage());
        }
    }

    // 3. Add Technician to a specific Shop
    public function storeTechnician(Request $request, $id_service_center)
    {
        $request->validate([
            'tech_name' => 'required|string',
            'tech_email' => 'required|email|unique:technicians,email',
            'tech_password' => 'required|min:6',
        ]);

        Technician::create([
            'id_service_center' => $id_service_center,
            'name' => $request->tech_name,
            'email' => $request->tech_email,
            'password' => Hash::make($request->tech_password),
        ]);

        return back()->with('success', 'Technician added perfectly!');
    }

    // 3b. Delete a specific Technician from a Shop
    public function destroyTechnician($id_service_center, $id_technician)
    {
        $technician = Technician::where('id_technician', $id_technician)
            ->where('id_service_center', $id_service_center)
            ->firstOrFail();

        $technician->delete();

        return back()->with('success', 'Technician removed successfully!');
    }

    // 4. The Nuke Button (Delete Everything)
    public function destroy($id_service_center)
    {
        try {
            DB::beginTransaction();

            $shop = Service_Center::findOrFail($id_service_center);
            $id_mitra = $shop->id_mitra;

            // A. Delete the workers (Technicians)
            Technician::where('id_service_center', $id_service_center)->delete();

            // B. Delete the shop
            $shop->delete();

            // C. Delete the boss (Mitra)
            Mitra::where('id_mitra', $id_mitra)->delete();

            DB::commit();

            return back()->with('success', 'Workshop, Mitra, and Technicians nuked from orbit.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete: ' . $e->getMessage());
        }
    }
}