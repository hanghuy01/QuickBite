type Listener<T = any> = (payload: T) => void;

class SimpleEmitter<Events extends Record<string, any>> {
  private listeners: { [K in keyof Events]?: Listener<Events[K]>[] } = {};

  on<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {
    (this.listeners[event] ||= []).push(fn);
  }

  off<K extends keyof Events>(event: K, fn: Listener<Events[K]>) {
    this.listeners[event] = (this.listeners[event] || []).filter((l) => l !== fn);
  }

  emit<K extends keyof Events>(event: K, payload?: Events[K]) {
    (this.listeners[event] || []).forEach((l) => l(payload as Events[K]));
  }
}

// 🟢 Khai báo event types
type MyEvents = {
  logout: void; // có thể thêm nhiều event khác: login, error, ...
};

// 🟢 Tạo instance dùng chung
export const logoutEmitter = new SimpleEmitter<MyEvents>();
