import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "@/constants/api";

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

type HistoryServiceCenter = {
	lokasi_service_center?: string | null;
	jarak_service_center?: number | string | null;
	name_service_center?: string | null;
};

export type HistoryBackendOrder = {
	id_order?: number | string;
	id?: number | string;
	created_at?: string | null;
	waktu_reservasi?: string | null;
	tipe_order?: string | null;
	alamat_home_service?: string | null;
	status_order?: string | null;
	id_technician?: number | string | null;
	user?: {
		name?: string | null;
	} | null;
	service?: {
		nama_service?: string | null;
		harga_service?: number | string | null;
		serviceCenter?: HistoryServiceCenter | null;
		service_center?: HistoryServiceCenter | null;
	} | null;
	payment?: {
		jumlah_pembayaran?: number | string | null;
		metode_pembayaran?: string | null;
	} | null;
	technician?: {
		name?: string | null;
	} | null;
};

export type HistoryFetchResult = {
	items: HistoryItem[];
	isFallback: boolean;
	message?: string;
};

export const historyItems: HistoryItem[] = [
	{
		id: "1",
		title: "Mugen Computer Pettarani",
		serviceType: "Home Service",
		status: "Completed service",
		price: "Rp110.000",
		time: "2 days ago",
		date: "16 May 2026",
		address: "Jl. A. P. Pettarani No.89a, Makassar",
		technician: "Ardi Setiawan",
		paymentMethod: "Cash",
		notes: "Laptop cleaned, thermal paste replaced, and fan serviced.",
		steps: ["Initial diagnosis", "Internal cleaning", "Thermal paste replacement", "Final check"],
	},
	{
		id: "2",
		title: "Elextra Komputer",
		serviceType: "Scheduled Service",
		status: "Scheduled",
		price: "Rp90.000",
		time: "1 week ago",
		date: "10 May 2026",
		address: "Jl. A.P. Pettarani Ruko Diamond No. 3, Makassar",
		technician: "Rizky Pratama",
		paymentMethod: "Transfer",
		notes: "Booking created for screen inspection and OS reinstallation.",
		steps: ["Booking created", "Schedule confirmed", "Unit inspection", "Awaiting visit"],
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
		technician: "Not assigned",
		paymentMethod: "-",
		notes: "Order canceled before the technician departed.",
		steps: ["Booking created", "Schedule confirmed", "Canceled by user"],
	},
];

const formatCurrency = (value?: number | string | null) => {
	const numericValue = typeof value === "number" ? value : Number(value);

	if (!Number.isFinite(numericValue)) {
		return "Rp0";
	}

	return `Rp${numericValue.toLocaleString("id-ID")}`;
};

const formatReadableDate = (value?: string | null) => {
	if (!value) {
		return "-";
	}

	const normalizedValue = value.includes("T") ? value : value.replace(" ", "T");
	const parsedDate = new Date(normalizedValue);

	if (Number.isNaN(parsedDate.getTime())) {
		return value;
	}

	return parsedDate.toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

const formatRelativeTime = (value?: string | null) => {
	if (!value) {
		return "Just now";
	}

	const normalizedValue = value.includes("T") ? value : value.replace(" ", "T");
	const parsedDate = new Date(normalizedValue);

	if (Number.isNaN(parsedDate.getTime())) {
		return "Just now";
	}

	const diffMs = Date.now() - parsedDate.getTime();
	const diffMinutes = Math.round(Math.abs(diffMs) / (1000 * 60));

	if (diffMinutes < 60) {
		return diffMs >= 0 ? `${Math.max(diffMinutes, 1)} min ago` : `in ${Math.max(diffMinutes, 1)} min`;
	}

	const diffHours = Math.round(diffMinutes / 60);
	if (diffHours < 24) {
		return diffMs >= 0 ? `${diffHours} hour${diffHours > 1 ? "s" : ""} ago` : `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
	}

	const diffDays = Math.round(diffHours / 24);
	if (diffDays < 7) {
		return diffMs >= 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""} ago` : `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
	}

	return formatReadableDate(value);
};

const getServiceVariant = (value?: string | null) => (value === "home_service" ? "Home Service" : "Scheduled Service");

const getStatusLabel = (value?: string | null) => {
	const normalizedValue = (value || "").toLowerCase();

	if (normalizedValue.includes("cancel")) {
		return "Canceled booking";
	}

	if (normalizedValue.includes("complete")) {
		return "Completed service";
	}

	if (normalizedValue.includes("progress")) {
		return "Service in progress";
	}

	if (normalizedValue.includes("pending")) {
		return "Waiting confirmation";
	}

	return "Service updated";
};

const getTechnicianLabel = (order: HistoryBackendOrder) => {
	if (order.technician?.name) {
		return order.technician.name;
	}

	if (order.status_order && order.status_order.toLowerCase().includes("cancel")) {
		return "Order canceled";
	}

	if (order.id_technician) {
		return "Technician assigned";
	}

	return "Not assigned";
};

const getPriceValue = (order: HistoryBackendOrder) => {
	const paymentValue = Number(order.payment?.jumlah_pembayaran);
	if (Number.isFinite(paymentValue)) {
		return paymentValue;
	}

	if (order.status_order && order.status_order.toLowerCase().includes("cancel")) {
		return 0;
	}

	const serviceValue = Number(order.service?.harga_service);
	return Number.isFinite(serviceValue) ? serviceValue : 0;
};

const getNotes = (order: HistoryBackendOrder, statusLabel: string, paymentMethod: string) => {
	const orderType = getServiceVariant(order.tipe_order);

	if (statusLabel.toLowerCase().includes("cancel")) {
		return `${orderType} was canceled before the service started.`;
	}

	if (statusLabel.toLowerCase().includes("complete")) {
		return paymentMethod !== "-"
			? `Service completed and payment via ${paymentMethod} has been recorded.`
			: "Service completed and ready for review.";
	}

	if (statusLabel.toLowerCase().includes("progress")) {
		return "Technician is currently performing the service.";
	}

	return "Waiting for schedule confirmation from the system.";
};

const getSteps = (order: HistoryBackendOrder, statusLabel: string) => {
	const steps = ["Booking created"];
	const isHomeService = order.tipe_order === "home_service";

	if (statusLabel.toLowerCase().includes("cancel")) {
		steps.push("Schedule confirmed", "Canceled by user");
		return steps;
	}

	if (statusLabel.toLowerCase().includes("complete")) {
		steps.push("Schedule confirmed");
		steps.push(isHomeService ? "Technician en route" : "Work completed");
		steps.push("Final check");
		return steps;
	}

	if (statusLabel.toLowerCase().includes("progress")) {
		steps.push("Schedule confirmed", isHomeService ? "Technician en route" : "In progress");
		return steps;
	}

	steps.push("Awaiting confirmation");
	return steps;
};

const isOrderLikeRecord = (value: unknown): value is HistoryBackendOrder => {
	if (!value || typeof value !== "object") {
		return false;
	}

	const record = value as Record<string, unknown>;
	return ["id_order", "status_order", "tipe_order", "waktu_reservasi", "alamat_home_service"].some((key) => key in record);
};

const extractOrdersFromPayload = (payload: unknown): HistoryBackendOrder[] => {
	if (Array.isArray(payload)) {
		return payload.filter(isOrderLikeRecord);
	}

	if (!payload || typeof payload !== "object") {
		return [];
	}

	const record = payload as Record<string, unknown>;
	const nestedCandidates = [
		record.orders,
		record.history,
		record.data,
		(record.data as Record<string, unknown> | undefined)?.orders,
		(record.user as Record<string, unknown> | undefined)?.orders,
		(record.payload as Record<string, unknown> | undefined)?.orders,
	];

	for (const candidate of nestedCandidates) {
		const orders = extractOrdersFromPayload(candidate);
		if (orders.length > 0) {
			return orders;
		}
	}

	return isOrderLikeRecord(record) ? [record] : [];
};

const parseResponseBody = async (response: Response) => {
	const text = await response.text();
	const trimmed = text.trim();

	if (!trimmed) {
		return null;
	}

	try {
		return JSON.parse(trimmed) as unknown;
	} catch {
		return trimmed;
	}
};

const transformBackendOrderToHistoryItem = (order: HistoryBackendOrder): HistoryItem => {
	const serviceCenter = order.service?.serviceCenter || order.service?.service_center;
	const title = serviceCenter?.name_service_center || order.service?.nama_service || "Riwayat service";
	const serviceType = getServiceVariant(order.tipe_order);
	const statusLabel = getStatusLabel(order.status_order);
	const timeValue = order.waktu_reservasi || order.created_at;
	const paymentMethod = order.payment?.metode_pembayaran || "-";

	return {
		id: String(order.id_order ?? order.id ?? ""),
		title,
		serviceType,
		status: statusLabel,
		price: formatCurrency(getPriceValue(order)),
		time: formatRelativeTime(timeValue),
		date: formatReadableDate(timeValue),
		address: order.alamat_home_service || serviceCenter?.lokasi_service_center || serviceCenter?.name_service_center || "Alamat belum tersedia",
		technician: getTechnicianLabel(order),
		paymentMethod,
		notes: getNotes(order, statusLabel, paymentMethod),
		steps: getSteps(order, statusLabel),
	};
};

export const fetchHistoryItems = async (): Promise<HistoryFetchResult> => {
	const token = (await AsyncStorage.getItem("authToken"))?.trim();

	if (!token) {
		return {
			items: historyItems,
			isFallback: true,
			message: "Login token not found. Showing example history data.",
		};
	}

	try {
		const response = await fetch(`${API_BASE_URL}/user/orders`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
				"ngrok-skip-browser-warning": "true",
			},
		});

		const body = await parseResponseBody(response);

		if (!response.ok) {
			const message = typeof body === "object" && body && "message" in body ? String((body as Record<string, unknown>).message) : `HTTP ${response.status}`;

			if (response.status === 401) {
				return {
					items: historyItems,
					isFallback: true,
					message: "Session not valid. Showing example history data.",
				};
			}

			throw new Error(message);
		}

		const orders = extractOrdersFromPayload(body);

		if (!orders.length) {
			return {
				items: historyItems,
				isFallback: true,
				message: "User history endpoint returned no orders. Showing example history data.",
			};
		}

		return {
			items: orders.map(transformBackendOrderToHistoryItem),
			isFallback: false,
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error("Error fetching history data:", message);

		return {
			items: historyItems,
			isFallback: true,
			message: `Unable to access backend history: ${message}. Showing example history data.`,
		};
	}
};

export const findHistoryItemById = (items: HistoryItem[], id?: string) => {
	if (!id) {
		return undefined;
	}

	return items.find((item) => item.id === id);
};

export const isHistoryRelevantItem = (item: HistoryItem) => {
	const normalizedStatus = item.status.toLowerCase();
	return normalizedStatus.includes("complete") || normalizedStatus.includes("cancel");
};

export const getHistoryItemById = (id?: string) => findHistoryItemById(historyItems, id) ?? historyItems[0];