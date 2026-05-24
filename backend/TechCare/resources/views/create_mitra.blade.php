@extends('layout')

@section('content')
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow mt-6">
        <div class="flex items-center justify-between border-b pb-4 mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Register Mitra & Workshop</h2>
            <a href="{{ route('admin.dashboard') }}" class="text-sm text-gray-500 hover:text-blue-500">&larr; Back to
                Dashboard</a>
        </div>

        @if ($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <ul class="list-disc pl-5 text-sm">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ url('/admin/mitra') }}" method="POST">
            @csrf

            <h3 class="text-lg font-bold text-blue-600 mb-4 border-l-4 border-blue-600 pl-2">1. Mitra (Owner) Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Owner Email</label>
                    <input type="email" name="mitra_email"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Account Password</label>
                    <input type="password" name="mitra_password"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required>
                </div>
            </div>

            <h3 class="text-lg font-bold text-green-600 mb-4 border-l-4 border-green-600 pl-2">2. Workshop Details</h3>
            <div class="grid grid-cols-1 gap-4 mb-8">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Workshop Name</label>
                    <input type="text" name="shop_name"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Workshop Description</label>
                    <textarea name="shop_description" rows="3"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" required></textarea>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Full Address</label>
                    <textarea name="shop_address" rows="3"
                        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" required></textarea>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit"
                    class="bg-gray-800 hover:bg-black text-white font-bold py-3 px-6 rounded shadow-lg transition">
                    Create Account & Workshop
                </button>
            </div>
        </form>
    </div>
@endsection
