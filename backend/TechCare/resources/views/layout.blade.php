<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - TechCare</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans antialiased">

    @auth('admin')
    <nav class="bg-blue-600 p-4 shadow-md flex justify-between items-center text-white">
        <div class="font-bold text-xl">TechCare Admin</div>
        <div class="flex items-center space-x-4">
            <span>Welcome, {{ Auth::guard('admin')->user()->name }}</span>
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold transition">
                    Logout
                </button>
            </form>
        </div>
    </nav>
    @endauth

    <div class="container mx-auto mt-4 px-4">
        @if(session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                {{ session('success') }}
            </div>
        @endif
        @if(session('error'))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {{ session('error') }}
            </div>
        @endif
    </div>

    <main class="container mx-auto p-4">
        @yield('content')
    </main>

</body>
</html>