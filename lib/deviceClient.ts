export function generateDeviceId(): string {
    try {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
    }
    catch (e) {

    }

    return 'dev-' + Math.random().toString(36).slice(2, 12);
}

export function getStoredDeviceId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('deviceId');
}

export function storeDeviceId(deviceId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('deviceId', deviceId);
}

export function clearDeviceId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('deviceId');
}

export function ensureDeviceId(): string {
    let id = getStoredDeviceId();
    if (!id) {
        id = generateDeviceId();
        storeDeviceId(id);
    }
    return id;
}