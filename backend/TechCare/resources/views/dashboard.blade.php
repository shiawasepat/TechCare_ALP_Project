@extends('layout')

@section('content')
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Workshop Management</h1>
        <a href="{{ url('/admin/mitra/create') }}"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow">
            + Register New Mitra & Workshop
        </a>
    </div>

    <div class="bg-white rounded-lg shadow overflow-visible">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workshop Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mitra Owner
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technicians
                    </th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @foreach ($serviceCenters as $shop)
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-bold text-gray-900">{{ $shop->name_service_center }}</div>
                            <div class="text-sm text-gray-500">{{ $shop->lokasi_service_center }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ $shop->mitra->email ?? 'N/A' }}</div>
                            <div class="text-xs text-gray-500">ID: {{ $shop->mitra->id_mitra ?? 'N/A' }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {{ $shop->technicians->count() }} Workers
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div class="relative inline-flex flex-wrap items-center justify-center gap-2">
                                <details class="relative inline-block text-left group">
                                    <summary
                                        class="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded cursor-pointer list-none text-xs font-bold">
                                        View Tech
                                    </summary>
                                    <div
                                        class="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] min-w-0 bg-white border rounded shadow-xl z-50 p-4">
                                        <h3 class="text-xs font-bold text-gray-700 mb-2 border-b pb-1">Technicians in
                                            {{ $shop->name_service_center }}</h3>
                                        <div class="max-h-48 overflow-y-auto">
                                            @forelse ($shop->technicians as $tech)
                                                <div
                                                    class="flex items-center justify-between gap-2 py-2 border-b last:border-b-0">
                                                    <div class="min-w-0">
                                                        <div class="text-xs font-semibold text-gray-800 truncate">
                                                            {{ $tech->name }}</div>
                                                        <div class="text-xs text-gray-500 truncate">{{ $tech->email }}
                                                        </div>
                                                    </div>
                                                    <form
                                                        action="{{ url('/admin/service_center/' . $shop->id_service_center . '/technician/' . $tech->id_technician) }}"
                                                        method="POST"
                                                        onsubmit="return confirm('Delete this technician?');">
                                                        @csrf
                                                        @method('DELETE')
                                                        <button type="submit"
                                                            class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                                                            Delete
                                                        </button>
                                                    </form>
                                                </div>
                                            @empty
                                                <div class="text-xs text-gray-500">No technicians yet.</div>
                                            @endforelse
                                        </div>
                                    </div>
                                </details>

                                <details class="relative inline-block text-left group">
                                    <summary
                                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer list-none text-xs font-bold">
                                        + Tech
                                    </summary>
                                    <div
                                        class="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] min-w-0 bg-white border rounded shadow-xl z-50 p-4">
                                        <h3 class="text-xs font-bold text-gray-700 mb-2 border-b pb-1">Add Tech to
                                            {{ $shop->name_service_center }}</h3>
                                        <form class="grid grid-cols-1 gap-2"
                                            action="{{ url('/admin/service_center/' . $shop->id_service_center . '/technician') }}"
                                            method="POST">
                                            @csrf
                                            <input type="text" name="tech_name" placeholder="Name"
                                                class="block w-full text-xs p-1 border rounded" required>
                                            <input type="email" name="tech_email" placeholder="Email"
                                                class="block w-full text-xs p-1 border rounded" required>
                                            <input type="password" name="tech_password" placeholder="Password"
                                                class="block w-full text-xs p-1 border rounded" required>
                                            <button type="submit"
                                                class="block w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 rounded">Save
                                                Tech</button>
                                        </form>
                                    </div>
                                </details>

                                <form action="{{ url('/admin/service_center/' . $shop->id_service_center) }}"
                                    method="POST"
                                    onsubmit="return confirm('WARNING: This deletes the Mitra, the Workshop, and ALL Technicians. Are you sure?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit"
                                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold transition">
                                        Delete All
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
