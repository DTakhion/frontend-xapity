class StorageService {

  get<T>(itemKey: string | number): T | null {
    const localItem = localStorage.getItem(itemKey.toString());
    return localItem ? JSON.parse(localItem) : null;
  }

  set<T extends object>(itemKey: string | number, item: T): void {
    localStorage.setItem(itemKey.toString(), JSON.stringify(item));
  }

  delete(itemKey: string | number): void {
    localStorage.removeItem(itemKey.toString());
  }
}

export default new StorageService();
