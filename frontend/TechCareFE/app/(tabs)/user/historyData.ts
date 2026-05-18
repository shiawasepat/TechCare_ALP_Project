export type HistoryItem = {
	id: string;
	title: string;
	serviceType: string;
	status: string;
	price: string;
	time: string;
	date: string;
	address: string;
	technician: string;
	paymentMethod: string;
	notes: string;
	steps: string[];
};

export const historyItems: HistoryItem[] = [
	{
		id: "1",
		title: "Mugen Computer Pettarani",
		serviceType: "Home Service",
		status: "Completed repair",
		price: "Rp110.000",
		time: "2 days ago",
		date: "16 May 2026",
		address: "Jl. A. P. Pettarani No.89a, Makassar",
		technician: "Ardi Setiawan",
		paymentMethod: "Cash",
		notes: "Laptop dibersihkan, thermal paste diganti, dan fan diservis.",
		steps: ["Diagnosa awal", "Pembersihan internal", "Ganti thermal paste", "Final check"],
	},
	{
		id: "2",
		title: "Elextra Komputer",
		serviceType: "Scheduled Service",
		status: "Service scheduled",
		price: "Rp90.000",
		time: "1 week ago",
		date: "10 May 2026",
		address: "Jl. A.P. Pettarani Ruko Diamond No. 3, Makassar",
		technician: "Rizky Pratama",
		paymentMethod: "Transfer",
		notes: "Booking dibuat untuk pengecekan layar dan instalasi ulang sistem.",
		steps: ["Booking dibuat", "Konfirmasi jadwal", "Pengecekan unit", "Menunggu kunjungan"],
	},
	{
		id: "3",
		title: "HND Computer",
		serviceType: "Home Service",
		status: "Canceled booking",
		price: "Rp0",
		time: "2 weeks ago",
		date: "3 May 2026",
		address: "Jalan Ince Nurdin No.1AB, Makassar",
		technician: "Belum ditugaskan",
		paymentMethod: "-",
		notes: "Pesanan dibatalkan sebelum teknisi berangkat.",
		steps: ["Booking dibuat", "Konfirmasi jadwal", "Dibatalkan user"],
	},
];

export const getHistoryItemById = (id?: string) => historyItems.find((item) => item.id === id) ?? historyItems[0];